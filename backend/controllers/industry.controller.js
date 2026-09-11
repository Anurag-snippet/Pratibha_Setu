const Industry = require('../models/Industry');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

/**
 * @desc    Get Industry Profile
 * @route   GET /api/industries/:id/profile
 * @access  Private
 */
const getIndustryProfile = async (req, res, next) => {
  try {
    const industryId = req.params.id;

    let industry = await Industry.findById(industryId).populate(
      'userId',
      'name email role'
    );

    if (!industry) {
      industry = await Industry.findOne({ userId: industryId }).populate(
        'userId',
        'name email role'
      );
    }

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: industry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Industry Profile
 * @route   PATCH /api/industries/:id/profile
 * @access  Private (Owner Industry or Admin)
 */
const updateIndustryProfile = async (req, res, next) => {
  try {
    const industryId = req.params.id;
    const { companyName, industrySector, website, logoPath } = req.body;

    let industry = await Industry.findById(industryId);
    if (!industry) {
      industry = await Industry.findOne({ userId: industryId });
    }

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry profile not found',
      });
    }

    if (
      req.user.role === 'industry' &&
      industry.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own company profile',
      });
    }

    if (companyName !== undefined) industry.companyName = companyName;
    if (industrySector !== undefined) industry.industrySector = industrySector;
    if (website !== undefined) industry.website = website;
    if (logoPath !== undefined) industry.logoPath = logoPath;

    await industry.save();
    await industry.populate('userId', 'name email role');

    return res.status(200).json({
      success: true,
      message: 'Industry profile updated successfully',
      data: industry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all postings created by this industry
 * @route   GET /api/industries/:id/postings
 * @access  Private
 */
const getIndustryPostings = async (req, res, next) => {
  try {
    const industryId = req.params.id;

    let industry = await Industry.findById(industryId);
    if (!industry) {
      industry = await Industry.findOne({ userId: industryId });
    }

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry profile not found',
      });
    }

    const postings = await Opportunity.find({ postedByIndustryId: industry._id })
      .sort({ createdAt: -1 });

    // Attach application count & shortlisted count per posting
    const postingIds = postings.map((p) => p._id);
    const applications = await Application.find({ opportunityId: { $in: postingIds } });

    const statsByPosting = new Map();
    applications.forEach((app) => {
      const oid = app.opportunityId.toString();
      if (!statsByPosting.has(oid)) {
        statsByPosting.set(oid, { total: 0, shortlisted: 0, selected: 0 });
      }
      const s = statsByPosting.get(oid);
      s.total++;
      if (app.status === 'shortlisted') s.shortlisted++;
      if (app.status === 'selected') s.selected++;
    });

    const postingsWithStats = postings.map((p) => {
      const stats = statsByPosting.get(p._id.toString()) || {
        total: 0,
        shortlisted: 0,
        selected: 0,
      };
      return {
        ...p.toObject(),
        applicantsCount: stats.total,
        shortlistedCount: stats.shortlisted,
        selectedCount: stats.selected,
      };
    });

    return res.status(200).json({
      success: true,
      count: postingsWithStats.length,
      data: postingsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applicants across all postings of this industry
 * @route   GET /api/industries/:id/applicants
 * @access  Private
 */
const getIndustryApplicants = async (req, res, next) => {
  try {
    const industryId = req.params.id;

    let industry = await Industry.findById(industryId);
    if (!industry) {
      industry = await Industry.findOne({ userId: industryId });
    }

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry profile not found',
      });
    }

    // Find all opportunities posted by this industry
    const postings = await Opportunity.find({ postedByIndustryId: industry._id });
    const postingIds = postings.map((p) => p._id);

    // Find all applications for these opportunities
    const applications = await Application.find({ opportunityId: { $in: postingIds } })
      .populate({
        path: 'studentId',
        populate: [
          { path: 'userId', select: 'name email' },
          { path: 'institutionId', select: 'name address' },
        ],
      })
      .populate('opportunityId', 'title type location stipend requiredSkills')
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIndustryProfile,
  updateIndustryProfile,
  getIndustryPostings,
  getIndustryApplicants,
};
