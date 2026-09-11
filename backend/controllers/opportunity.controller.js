const Opportunity = require('../models/Opportunity');
const Industry = require('../models/Industry');
const Skill = require('../models/Skill');

/**
 * @desc    Get list of opportunities with filters, text search & pagination
 * @route   GET /api/opportunities
 * @access  Public / Authenticated
 */
const getOpportunities = async (req, res, next) => {
  try {
    const {
      type,
      skill,
      location,
      stipend_min,
      status,
      audience,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    const filter = {};

    // Filter by type
    if (type) {
      filter.type = type.toLowerCase();
    }

    // Filter by status (default to open if not specified, or allow querying all)
    if (status) {
      filter.status = status.toLowerCase();
    } else {
      filter.status = 'open';
    }

    // Filter by audience
    if (audience) {
      filter.audience = { $in: [audience.toLowerCase(), 'all'] };
    }

    // Filter by location (regex case-insensitive)
    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    // Filter by minimum stipend
    if (stipend_min) {
      filter.stipend = { $gte: Number(stipend_min) };
    }

    // Filter by required skill
    if (skill) {
      filter['requiredSkills.skillName'] = new RegExp(skill, 'i');
    }

    // Text search on title & description
    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Opportunity.countDocuments(filter);
    const opportunities = await Opportunity.find(filter)
      .populate('postedByIndustryId', 'companyName industrySector logoPath website verified')
      .sort(search ? { score: { $meta: 'textScore' } } : sort)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: opportunities.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
      data: opportunities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single opportunity by ID
 * @route   GET /api/opportunities/:id
 * @access  Public / Authenticated
 */
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedByIndustryId', 'companyName industrySector logoPath website verified');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new opportunity (Industry only)
 * @route   POST /api/opportunities
 * @access  Private (Industry role only)
 */
const createOpportunity = async (req, res, next) => {
  try {
    // Find current user's Industry profile
    const industry = await Industry.findOne({ userId: req.user._id });
    if (!industry) {
      return res.status(404).json({
        success: false,
        message: 'Industry profile not found for authenticated user.',
      });
    }

    const {
      type,
      title,
      description,
      responsibilities,
      location,
      mode,
      duration,
      stipend,
      isRemote,
      deadline,
      audience,
      requiredSkills,
    } = req.body;

    // Resolve requiredSkills array
    const resolvedRequiredSkills = [];
    if (Array.isArray(requiredSkills)) {
      for (const item of requiredSkills) {
        if (typeof item === 'string') {
          let sDoc = await Skill.findOne({ name: new RegExp(`^${item.trim()}$`, 'i') });
          if (!sDoc) {
            sDoc = await Skill.create({ name: item.trim(), category: 'Ayush Core' });
          }
          resolvedRequiredSkills.push({ skillId: sDoc._id, skillName: sDoc.name });
        } else if (item.skillId || item.skillName) {
          let sId = item.skillId;
          let sName = item.skillName;
          if (!sId && sName) {
            let sDoc = await Skill.findOne({ name: new RegExp(`^${sName.trim()}$`, 'i') });
            if (!sDoc) {
              sDoc = await Skill.create({ name: sName.trim(), category: 'Ayush Core' });
            }
            sId = sDoc._id;
            sName = sDoc.name;
          }
          resolvedRequiredSkills.push({ skillId: sId, skillName: sName });
        }
      }
    }

    const opportunity = await Opportunity.create({
      postedByIndustryId: industry._id,
      type: (type || 'internship').toLowerCase(),
      title,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      location: location || 'Pan-India',
      mode: mode || 'On-site',
      duration: duration || '3 months',
      stipend: stipend !== undefined ? stipend : 0,
      isRemote: isRemote || mode === 'Remote',
      deadline: deadline || null,
      audience: audience || 'student',
      status: 'open',
      requiredSkills: resolvedRequiredSkills,
    });

    await opportunity.populate('postedByIndustryId', 'companyName industrySector logoPath');

    return res.status(201).json({
      success: true,
      message: 'Opportunity posted successfully',
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update opportunity (with industry ownership check)
 * @route   PATCH /api/opportunities/:id
 * @access  Private (Industry owner only)
 */
const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    const industry = await Industry.findOne({ userId: req.user._id });
    if (!industry || opportunity.postedByIndustryId.toString() !== industry._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit opportunities posted by your organization.',
      });
    }

    const fieldsToUpdate = [
      'type',
      'title',
      'description',
      'responsibilities',
      'location',
      'mode',
      'duration',
      'stipend',
      'isRemote',
      'deadline',
      'status',
      'audience',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        opportunity[field] = req.body[field];
      }
    });

    if (req.body.requiredSkills && Array.isArray(req.body.requiredSkills)) {
      const resolved = [];
      for (const item of req.body.requiredSkills) {
        if (typeof item === 'string') {
          let sDoc = await Skill.findOne({ name: new RegExp(`^${item.trim()}$`, 'i') });
          if (!sDoc) {
            sDoc = await Skill.create({ name: item.trim(), category: 'Ayush Core' });
          }
          resolved.push({ skillId: sDoc._id, skillName: sDoc.name });
        } else if (item.skillId || item.skillName) {
          resolved.push({ skillId: item.skillId, skillName: item.skillName });
        }
      }
      opportunity.requiredSkills = resolved;
    }

    await opportunity.save();
    await opportunity.populate('postedByIndustryId', 'companyName industrySector logoPath');

    return res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully',
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete opportunity (with industry ownership check)
 * @route   DELETE /api/opportunities/:id
 * @access  Private (Industry owner only)
 */
const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    const industry = await Industry.findOne({ userId: req.user._id });
    if (!industry || opportunity.postedByIndustryId.toString() !== industry._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete opportunities posted by your organization.',
      });
    }

    await Opportunity.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Opportunity deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
