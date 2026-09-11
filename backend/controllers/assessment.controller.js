const AssessmentQuestion = require('../models/AssessmentQuestion');
const AssessmentResponse = require('../models/AssessmentResponse');
const Student = require('../models/Student');
const Skill = require('../models/Skill');

/**
 * @desc    Get assessment questions list
 * @route   GET /api/assessment/questions
 * @access  Private
 */
const getAssessmentQuestions = async (req, res, next) => {
  try {
    const { section, skillId } = req.query;
    const filter = {};

    if (section) filter.section = section;
    if (skillId) filter.skillId = skillId;

    const questions = await AssessmentQuestion.find(filter)
      .populate('skillId', 'name category')
      .sort({ section: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit assessment responses, calculate scores, and update Student embedded skills
 * @route   POST /api/assessment/submit
 * @access  Private (Students)
 */
const submitAssessment = async (req, res, next) => {
  try {
    const { responses } = req.body; // Array of { questionId, responseValue }

    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Assessment submission must contain an array of responses.',
      });
    }

    // Find current student profile
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found for authenticated user.',
      });
    }

    const questionIds = responses.map((r) => r.questionId);
    const questions = await AssessmentQuestion.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    // Skill score calculation buckets
    const skillScoreBuckets = {}; // { skillKey: { skillId, skillName, scores: [] } }
    const savedResponses = [];

    for (const item of responses) {
      const q = questionMap.get(item.questionId.toString());
      if (!q) continue;

      let scoreAwarded = 0;
      if (q.questionType === 'multiple_choice') {
        // Correct MCQ gets 100 points, wrong gets 35
        scoreAwarded = item.responseValue === q.correctAnswerIndex ? 100 : 35;
      } else if (q.questionType === 'rating') {
        // 1 to 5 rating converted to percentage (0 - 100)
        const ratingVal = Number(item.responseValue) || 3;
        scoreAwarded = Math.min(100, Math.round((ratingVal / 5) * 100));
      }

      // Record assessment response doc
      const respDoc = await AssessmentResponse.create({
        studentId: student._id,
        questionId: q._id,
        responseValue: item.responseValue,
        scoreAwarded,
        answeredAt: new Date(),
      });
      savedResponses.push(respDoc);

      const skillKey = (q.skillName || (q.skillId && q.skillId.toString()) || 'General').trim();
      if (!skillScoreBuckets[skillKey]) {
        skillScoreBuckets[skillKey] = {
          skillId: q.skillId,
          skillName: q.skillName || 'General',
          scores: [],
        };
      }
      skillScoreBuckets[skillKey].scores.push(scoreAwarded);
    }

    // Calculate aggregated score per skill and update student embedded skills
    const updatedSkillsSummary = [];

    for (const key of Object.keys(skillScoreBuckets)) {
      const bucket = skillScoreBuckets[key];
      const avgScore = Math.round(
        bucket.scores.reduce((a, b) => a + b, 0) / bucket.scores.length
      );

      // Resolve Skill ObjectId
      let resolvedSkillId = bucket.skillId;
      if (!resolvedSkillId) {
        let sDoc = await Skill.findOne({ name: new RegExp(`^${bucket.skillName}$`, 'i') });
        if (!sDoc) {
          sDoc = await Skill.create({ name: bucket.skillName, category: 'Ayush Core' });
        }
        resolvedSkillId = sDoc._id;
      }

      const existingIdx = student.skills.findIndex(
        (s) =>
          (resolvedSkillId && s.skillId && s.skillId.toString() === resolvedSkillId.toString()) ||
          s.skillName.toLowerCase() === bucket.skillName.toLowerCase()
      );

      if (existingIdx > -1) {
        student.skills[existingIdx].proficiencyScore = avgScore;
        student.skills[existingIdx].assessedAt = new Date();
      } else {
        student.skills.push({
          skillId: resolvedSkillId,
          skillName: bucket.skillName,
          proficiencyScore: avgScore,
          assessedAt: new Date(),
        });
      }

      updatedSkillsSummary.push({
        skillId: resolvedSkillId,
        skillName: bucket.skillName,
        score: avgScore,
      });
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: 'Assessment submitted and skills updated successfully.',
      data: {
        assessedSkills: updatedSkillsSummary,
        studentSkills: student.skills,
        totalResponses: savedResponses.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssessmentQuestions,
  submitAssessment,
};
