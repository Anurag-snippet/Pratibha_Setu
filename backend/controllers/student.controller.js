const mongoose = require('mongoose');
const Student = require('../models/Student');
const Opportunity = require('../models/Opportunity');
const Skill = require('../models/Skill');
const { buildRecommendationPipeline } = require('../utils/matchScore');

/**
 * @desc    Get student profile by ID
 * @route   GET /api/students/:id/profile
 * @access  Private
 */
const getStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    // Check if ID is user ID or student ID
    let student = await Student.findById(studentId)
      .populate('userId', 'name email role')
      .populate('institutionId', 'name type address contactEmail');

    if (!student) {
      student = await Student.findOne({ userId: studentId })
        .populate('userId', 'name email role')
        .populate('institutionId', 'name type address contactEmail');
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student profile
 * @route   PATCH /api/students/:id/profile
 * @access  Private (Owner student or Admin)
 */
const updateStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const { course, year, bio, institutionId, profilePhotoPath } = req.body;

    let student = await Student.findById(studentId);
    if (!student) {
      student = await Student.findOne({ userId: studentId });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Authorization check
    if (
      req.user.role === 'student' &&
      student.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own student profile',
      });
    }

    if (course !== undefined) student.course = course;
    if (year !== undefined) student.year = year;
    if (bio !== undefined) student.bio = bio;
    if (institutionId !== undefined) student.institutionId = institutionId;
    if (profilePhotoPath !== undefined) student.profilePhotoPath = profilePhotoPath;

    await student.save();
    await student.populate('institutionId', 'name type address');
    await student.populate('userId', 'name email role');

    return res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student skills
 * @route   GET /api/students/:id/skills
 * @access  Private
 */
const getStudentSkills = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    let student = await Student.findById(studentId);
    if (!student) {
      student = await Student.findOne({ userId: studentId });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: student.skills || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update or add skills into student's embedded skills array
 * @route   POST /api/students/:id/skills
 * @access  Private (Owner student or Admin)
 */
const updateStudentSkills = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const { skills } = req.body; // Array of { skillId, skillName, proficiencyScore }

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of skill objects.',
      });
    }

    let student = await Student.findById(studentId);
    if (!student) {
      student = await Student.findOne({ userId: studentId });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Authorization
    if (
      req.user.role === 'student' &&
      student.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update your own skills',
      });
    }

    // Merge or replace skills
    for (const item of skills) {
      let resolvedSkillId = item.skillId;
      let resolvedSkillName = item.skillName;

      // If skillId wasn't passed, find or create skill by name
      if (!resolvedSkillId && resolvedSkillName) {
        let skillDoc = await Skill.findOne({
          name: new RegExp(`^${resolvedSkillName.trim()}$`, 'i'),
        });
        if (!skillDoc) {
          skillDoc = await Skill.create({
            name: resolvedSkillName.trim(),
            category: 'Ayush Core',
          });
        }
        resolvedSkillId = skillDoc._id;
        resolvedSkillName = skillDoc.name;
      }

      const existingIndex = student.skills.findIndex(
        (s) =>
          (resolvedSkillId && s.skillId && s.skillId.toString() === resolvedSkillId.toString()) ||
          s.skillName.toLowerCase() === (resolvedSkillName || '').toLowerCase()
      );

      if (existingIndex > -1) {
        student.skills[existingIndex].proficiencyScore = item.proficiencyScore ?? student.skills[existingIndex].proficiencyScore;
        student.skills[existingIndex].assessedAt = new Date();
      } else if (resolvedSkillId && resolvedSkillName) {
        student.skills.push({
          skillId: resolvedSkillId,
          skillName: resolvedSkillName,
          proficiencyScore: item.proficiencyScore || 60,
          assessedAt: new Date(),
        });
      }
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: 'Student skills updated successfully',
      data: student.skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get skill gap analysis for student compared to market demands in Opportunity
 * @route   GET /api/students/:id/skill-gap
 * @access  Private
 */
const getSkillGap = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    let student = await Student.findById(studentId);
    if (!student) {
      student = await Student.findOne({ userId: studentId });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // 1. Aggregation pipeline over Opportunity to find top in-demand skills
    const demandPipeline = [
      { $match: { status: 'open' } },
      { $unwind: '$requiredSkills' },
      {
        $group: {
          _id: '$requiredSkills.skillId',
          skillName: { $first: '$requiredSkills.skillName' },
          opportunityCount: { $sum: 1 },
        },
      },
      { $sort: { opportunityCount: -1 } },
      { $limit: 12 },
    ];

    const marketDemand = await Opportunity.aggregate(demandPipeline);

    // 2. Map student's existing skill scores
    const studentSkillMap = new Map();
    (student.skills || []).forEach((s) => {
      if (s.skillId) {
        studentSkillMap.set(s.skillId.toString(), {
          score: s.proficiencyScore,
          assessedAt: s.assessedAt,
        });
      }
      if (s.skillName) {
        studentSkillMap.set(s.skillName.toLowerCase(), {
          score: s.proficiencyScore,
          assessedAt: s.assessedAt,
        });
      }
    });

    // 3. Compute benchmark and gap score
    const skillGapResults = marketDemand.map((item) => {
      const skillIdStr = item._id ? item._id.toString() : '';
      const skillNameKey = (item.skillName || '').toLowerCase();
      const studentSkill = studentSkillMap.get(skillIdStr) || studentSkillMap.get(skillNameKey);

      const studentScore = studentSkill ? studentSkill.score : 0;
      // High market demand benchmark ranges from 70 to 85
      const benchmarkScore = Math.min(85, 60 + item.opportunityCount * 5);
      const gap = Math.max(0, benchmarkScore - studentScore);

      return {
        skillId: item._id,
        skillName: item.skillName,
        marketDemandCount: item.opportunityCount,
        studentScore,
        benchmarkScore,
        gap,
        status:
          studentScore >= benchmarkScore
            ? 'Proficient'
            : studentScore > 0
            ? 'Needs Improvement'
            : 'Missing Skill',
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        studentId: student._id,
        skillGaps: skillGapResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recommended opportunities ranked by skill overlap
 * @route   GET /api/students/:id/recommendations
 * @access  Private
 */
const getRecommendations = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    let student = await Student.findById(studentId);
    if (!student) {
      student = await Student.findOne({ userId: studentId });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const limit = parseInt(req.query.limit, 10) || 8;
    const studentSkillIds = (student.skills || [])
      .map((s) => s.skillId)
      .filter(Boolean);

    const pipeline = buildRecommendationPipeline(studentSkillIds, limit);
    const recommendations = await Opportunity.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getStudentSkills,
  updateStudentSkills,
  getSkillGap,
  getRecommendations,
};
