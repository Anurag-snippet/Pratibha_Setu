const Academician = require('../models/Academician');
const Student = require('../models/Student');
const Application = require('../models/Application');

/**
 * @desc    Get Academician Profile
 * @route   GET /api/academicians/:id/profile
 * @access  Private
 */
const getAcademicianProfile = async (req, res, next) => {
  try {
    const academicianId = req.params.id;

    let academician = await Academician.findById(academicianId)
      .populate('userId', 'name email role')
      .populate('institutionId', 'name type address contactEmail');

    if (!academician) {
      academician = await Academician.findOne({ userId: academicianId })
        .populate('userId', 'name email role')
        .populate('institutionId', 'name type address contactEmail');
    }

    if (!academician) {
      return res.status(404).json({
        success: false,
        message: 'Academician profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: academician,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Academician Profile
 * @route   PATCH /api/academicians/:id/profile
 * @access  Private (Owner Academician or Admin)
 */
const updateAcademicianProfile = async (req, res, next) => {
  try {
    const academicianId = req.params.id;
    const { department, designation, institutionId } = req.body;

    let academician = await Academician.findById(academicianId);
    if (!academician) {
      academician = await Academician.findOne({ userId: academicianId });
    }

    if (!academician) {
      return res.status(404).json({
        success: false,
        message: 'Academician profile not found',
      });
    }

    if (
      req.user.role === 'academician' &&
      academician.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to edit another academician profile',
      });
    }

    if (department !== undefined) academician.department = department;
    if (designation !== undefined) academician.designation = designation;
    if (institutionId !== undefined) academician.institutionId = institutionId;

    await academician.save();
    await academician.populate('institutionId', 'name type address');
    await academician.populate('userId', 'name email role');

    return res.status(200).json({
      success: true,
      message: 'Academician profile updated successfully',
      data: academician,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get students under academician's institution with skill & placement summary
 * @route   GET /api/academicians/:id/students
 * @access  Private (Academicians / Admin)
 */
const getAcademicianStudents = async (req, res, next) => {
  try {
    const academicianId = req.params.id;

    let academician = await Academician.findById(academicianId);
    if (!academician) {
      academician = await Academician.findOne({ userId: academicianId });
    }

    if (!academician) {
      return res.status(404).json({
        success: false,
        message: 'Academician profile not found',
      });
    }

    const institutionFilter = academician.institutionId
      ? { institutionId: academician.institutionId }
      : {};

    const students = await Student.find(institutionFilter)
      .populate('userId', 'name email')
      .populate('institutionId', 'name');

    // Aggregate application / placement status per student
    const studentIds = students.map((s) => s._id);
    const applications = await Application.find({ studentId: { $in: studentIds } })
      .populate({
        path: 'opportunityId',
        select: 'title postedByIndustryId',
        populate: { path: 'postedByIndustryId', select: 'companyName' },
      });

    const applicationsByStudent = new Map();
    applications.forEach((app) => {
      const sid = app.studentId.toString();
      if (!applicationsByStudent.has(sid)) applicationsByStudent.set(sid, []);
      applicationsByStudent.get(sid).push(app);
    });

    const studentSummaries = students.map((student) => {
      const apps = applicationsByStudent.get(student._id.toString()) || [];
      const selectedApp = apps.find((a) => a.status === 'selected');
      const shortlistedApp = apps.find((a) => a.status === 'shortlisted');

      let placementStatus = 'Not started';
      let company = '—';

      if (selectedApp) {
        placementStatus = 'Selected';
        company = selectedApp.opportunityId?.postedByIndustryId?.companyName || 'Industry Partner';
      } else if (shortlistedApp) {
        placementStatus = 'Shortlisted';
        company = shortlistedApp.opportunityId?.postedByIndustryId?.companyName || 'Industry Partner';
      } else if (apps.length > 0) {
        placementStatus = 'Applied';
      }

      // Calculate average skill score
      const skillScores = (student.skills || []).map((s) => s.proficiencyScore || 0);
      const avgSkillScore = skillScores.length
        ? Math.round(skillScores.reduce((a, b) => a + b, 0) / skillScores.length)
        : 0;

      // Top skill
      let topSkill = '—';
      if (student.skills && student.skills.length > 0) {
        const sortedSkills = [...student.skills].sort(
          (a, b) => (b.proficiencyScore || 0) - (a.proficiencyScore || 0)
        );
        topSkill = sortedSkills[0].skillName;
      }

      return {
        id: student._id,
        userId: student.userId?._id,
        name: student.userId?.name || 'Student',
        email: student.userId?.email || '',
        course: student.course || 'BAMS',
        year: student.year || 1,
        skillScore: avgSkillScore,
        topSkill,
        placement: placementStatus,
        company,
        applicationsCount: apps.length,
        institution: student.institutionId?.name || '',
      };
    });

    return res.status(200).json({
      success: true,
      count: studentSummaries.length,
      data: studentSummaries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAcademicianProfile,
  updateAcademicianProfile,
  getAcademicianStudents,
};
