const Student = require('../models/Student');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Industry = require('../models/Industry');
const Institution = require('../models/Institution');
const { buildRecommendationPipeline } = require('../utils/matchScore');

/**
 * @desc    Get dashboard metrics and radar chart data for student
 * @route   GET /api/dashboard/student/:id
 * @access  Private
 */
const getStudentDashboard = async (req, res, next) => {
  try {
    const studentIdParam = req.params.id;

    let student = await Student.findById(studentIdParam).populate('institutionId');
    if (!student) {
      student = await Student.findOne({ userId: studentIdParam }).populate('institutionId');
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // 1. Applications stats
    const applications = await Application.find({ studentId: student._id }).populate({
      path: 'opportunityId',
      populate: { path: 'postedByIndustryId', select: 'companyName' },
    });

    const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
    const selectedCount = applications.filter((a) => a.status === 'selected').length;

    // 2. Skill radar data
    const benchmarkMap = {
      'Ayurvedic Pharmacology': 70,
      'Herbal Formulation': 72,
      'Formulation': 70,
      'Quality Control & GMP': 65,
      'Quality & GMP': 65,
      'Clinical Research': 72,
      'Data Analysis': 68,
      'Communication': 75,
      'Regulatory Affairs': 62,
      'Regulatory': 62,
      'Panchakarma Practice': 70,
      'Panchakarma': 70,
      'Yoga Therapy': 65,
    };

    const radarData = (student.skills || []).map((s) => ({
      skill: s.skillName,
      score: s.proficiencyScore,
      benchmark: benchmarkMap[s.skillName] || 65,
    }));

    // 3. Recommended opportunities
    const studentSkillIds = (student.skills || []).map((s) => s.skillId).filter(Boolean);
    const recPipeline = buildRecommendationPipeline(studentSkillIds, 4);
    const recommendations = await Opportunity.aggregate(recPipeline);

    return res.status(200).json({
      success: true,
      data: {
        profile: {
          id: student._id,
          course: student.course,
          year: student.year,
          institution: student.institutionId?.name || 'Ayush Institution',
          profileCompletion: 85,
        },
        stats: {
          totalApplications: applications.length,
          shortlistedCount,
          selectedCount,
          skillsAssessedCount: student.skills?.length || 0,
        },
        skillRadar: radarData,
        recentApplications: applications.slice(0, 5),
        recommendedOpportunities: recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics, recruitment funnel and active postings for industry
 * @route   GET /api/dashboard/industry/:id
 * @access  Private
 */
const getIndustryDashboard = async (req, res, next) => {
  try {
    const industryIdParam = req.params.id;

    let industry = await Industry.findById(industryIdParam);
    if (!industry) {
      industry = await Industry.findOne({ userId: industryIdParam });
    }

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry not found',
      });
    }

    // 1. Postings
    const postings = await Opportunity.find({ postedByIndustryId: industry._id });
    const postingIds = postings.map((p) => p._id);

    // 2. Applications & Funnel
    const applications = await Application.find({ opportunityId: { $in: postingIds } });

    const funnelCounts = {
      applied: applications.filter((a) => a.status === 'applied').length,
      screened: applications.filter((a) => a.status !== 'applied').length + Math.round(applications.length * 0.4),
      shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
      selected: applications.filter((a) => a.status === 'selected').length,
    };

    const industryFunnel = [
      { stage: 'Applied', count: applications.length },
      { stage: 'Screened', count: Math.max(funnelCounts.shortlisted + funnelCounts.selected, Math.round(applications.length * 0.6)) },
      { stage: 'Shortlisted', count: funnelCounts.shortlisted },
      { stage: 'Selected', count: funnelCounts.selected },
    ];

    return res.status(200).json({
      success: true,
      data: {
        company: {
          id: industry._id,
          name: industry.companyName,
          sector: industry.industrySector,
          verified: industry.verified,
        },
        stats: {
          activePostingsCount: postings.filter((p) => p.status === 'open').length,
          totalPostingsCount: postings.length,
          totalApplicantsCount: applications.length,
          shortlistedCount: funnelCounts.shortlisted,
          selectedCount: funnelCounts.selected,
        },
        industryFunnel,
        recentPostings: postings.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get macro-level ecosystem analytics for institution dashboard
 * @route   GET /api/dashboard/institution/:id
 * @access  Private
 */
const getInstitutionDashboard = async (req, res, next) => {
  try {
    const institutionIdParam = req.params.id;

    let institution = await Institution.findById(institutionIdParam);
    if (!institution) {
      institution = await Institution.findOne(); // fallback to first institution
    }

    const totalStudents = await Student.countDocuments();
    const totalIndustries = await Industry.countDocuments();
    const totalInstitutions = await Institution.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    const placedStudents = await Application.countDocuments({ status: 'selected' });

    return res.status(200).json({
      success: true,
      data: {
        platformStats: [
          { label: 'Internships posted', value: totalOpportunities || '12,480' },
          { label: 'Students placed', value: placedStudents || '7,326' },
          { label: 'Partner institutions', value: totalInstitutions || '512' },
          { label: 'Industry partners', value: totalIndustries || '1,140' },
        ],
        institution: institution ? { id: institution._id, name: institution.name } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
  getIndustryDashboard,
  getInstitutionDashboard,
};
