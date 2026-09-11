const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const Student = require('../models/Student');
const Industry = require('../models/Industry');
const Notification = require('../models/Notification');

/**
 * @desc    Apply for an opportunity (Student applies)
 * @route   POST /api/applications
 * @access  Private (Student only)
 */
const applyOpportunity = async (req, res, next) => {
  try {
    const { opportunityId, coverNote } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        success: false,
        message: 'Opportunity ID is required to submit an application.',
      });
    }

    // Find student profile for requesting user
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found for authenticated user.',
      });
    }

    // Verify opportunity exists and is open
    const opportunity = await Opportunity.findById(opportunityId).populate('postedByIndustryId');
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found.',
      });
    }

    if (opportunity.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'This opportunity has already been closed for applications.',
      });
    }

    // Check existing application to provide an immediate clean response
    const existing = await Application.findOne({
      opportunityId,
      studentId: student._id,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this opportunity.',
      });
    }

    const application = await Application.create({
      opportunityId,
      studentId: student._id,
      status: 'applied',
      coverNote: coverNote || '',
      timeline: [
        {
          label: 'Application submitted',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          done: true,
        },
      ],
    });

    // Notify industry user
    if (opportunity.postedByIndustryId && opportunity.postedByIndustryId.userId) {
      await Notification.create({
        userId: opportunity.postedByIndustryId.userId,
        kind: 'application',
        title: 'New Applicant Received',
        message: `${req.user.name} applied for "${opportunity.title}"`,
      });
    }

    await application.populate({
      path: 'opportunityId',
      populate: { path: 'postedByIndustryId', select: 'companyName industrySector logoPath' },
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications submitted by a student
 * @route   GET /api/applications/student/:studentId
 * @access  Private
 */
const getStudentApplications = async (req, res, next) => {
  try {
    const studentIdParam = req.params.studentId;

    let student = await Student.findById(studentIdParam);
    if (!student) {
      student = await Student.findOne({ userId: studentIdParam });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const applications = await Application.find({ studentId: student._id })
      .populate({
        path: 'opportunityId',
        populate: { path: 'postedByIndustryId', select: 'companyName industrySector logoPath website' },
      })
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

/**
 * @desc    Get all applications for a specific opportunity
 * @route   GET /api/applications/opportunity/:opportunityId
 * @access  Private (Industry owner / Academician / Admin)
 */
const getOpportunityApplications = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const applications = await Application.find({ opportunityId })
      .populate({
        path: 'studentId',
        populate: [
          { path: 'userId', select: 'name email' },
          { path: 'institutionId', select: 'name address' },
        ],
      })
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

/**
 * @desc    Industry updates application status (applied, shortlisted, rejected, selected) & mentor feedback
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Industry / Academician / Admin)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const { status, mentorFeedback } = req.body;

    const application = await Application.findById(applicationId)
      .populate('opportunityId')
      .populate('studentId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (status) {
      application.status = status.toLowerCase();
      const statusLabels = {
        shortlisted: 'Shortlisted for interview / review',
        selected: 'Offer released / Selected',
        rejected: 'Not progressed this cycle',
        applied: 'Application under review',
      };

      application.timeline.push({
        label: statusLabels[status.toLowerCase()] || `Status changed to ${status}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        done: true,
      });
    }

    if (mentorFeedback !== undefined) {
      application.mentorFeedback = mentorFeedback;
    }

    await application.save();

    // Create notification for student
    if (application.studentId && application.studentId.userId) {
      await Notification.create({
        userId: application.studentId.userId,
        kind: 'application',
        title: `Application Status: ${status ? status.toUpperCase() : 'Updated'}`,
        message: `Your application for "${application.opportunityId?.title || 'Opportunity'}" was updated to ${status}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyOpportunity,
  getStudentApplications,
  getOpportunityApplications,
  updateApplicationStatus,
};
