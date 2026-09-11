const PortfolioItem = require('../models/PortfolioItem');
const Student = require('../models/Student');

/**
 * @desc    Get all portfolio items for a student
 * @route   GET /api/portfolio/:studentId
 * @access  Private / Public
 */
const getStudentPortfolio = async (req, res, next) => {
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

    const items = await PortfolioItem.find({ studentId: student._id }).sort({ createdAt: -1 });

    const grouped = {
      certifications: items.filter((i) => i.type === 'certificate'),
      projects: items.filter((i) => i.type === 'project'),
      achievements: items.filter((i) => i.type === 'achievement'),
    };

    return res.status(200).json({
      success: true,
      count: items.length,
      data: {
        studentId: student._id,
        items,
        grouped,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new item to student's portfolio (with optional file upload)
 * @route   POST /api/portfolio/:studentId/items
 * @access  Private (Owner student or Admin)
 */
const addPortfolioItem = async (req, res, next) => {
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

    // Ownership check
    if (
      req.user.role === 'student' &&
      student.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only add items to your own portfolio.',
      });
    }

    const { type, title, description, issuer, year, tags, issuedDate } = req.body;

    let filePath = '';
    if (req.file) {
      filePath = `/uploads/${req.file.fieldname === 'certificate' ? 'certificates' : 'documents'}/${req.file.filename}`;
    }

    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === 'string') {
        parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const portfolioItem = await PortfolioItem.create({
      studentId: student._id,
      type: (type || 'project').toLowerCase(),
      title,
      description: description || '',
      issuer: issuer || '',
      year: year || '',
      tags: parsedTags,
      filePath,
      issuedDate: issuedDate || null,
      verified: req.user.role === 'academician' || req.user.role === 'institution_admin',
    });

    return res.status(201).json({
      success: true,
      message: 'Portfolio item added successfully',
      data: portfolioItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete portfolio item
 * @route   DELETE /api/portfolio/items/:itemId
 * @access  Private (Owner student or Admin)
 */
const deletePortfolioItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await PortfolioItem.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }

    // Check student ownership
    const student = await Student.findById(item.studentId);
    if (
      req.user.role === 'student' &&
      student &&
      student.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot delete another user\'s portfolio item.',
      });
    }

    await PortfolioItem.findByIdAndDelete(itemId);

    return res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentPortfolio,
  addPortfolioItem,
  deletePortfolioItem,
};
