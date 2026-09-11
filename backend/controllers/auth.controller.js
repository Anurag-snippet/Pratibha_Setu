const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Academician = require('../models/Academician');
const Industry = require('../models/Industry');
const { generateToken, setTokenCookie } = require('../utils/tokenUtils');

/**
 * @desc    Sign up a new user and initialize corresponding role profile
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      institutionId,
      course,
      year,
      bio,
      department,
      designation,
      companyName,
      industrySector,
      website,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User doc
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    });

    // Create Role-Specific Profile Document
    let profile = null;

    if (role === 'student') {
      profile = await Student.create({
        userId: user._id,
        institutionId: institutionId || null,
        course: course || 'BAMS',
        year: year || 1,
        bio: bio || '',
        skills: [],
      });
    } else if (role === 'academician') {
      profile = await Academician.create({
        userId: user._id,
        institutionId: institutionId || null,
        department: department || 'Dravyaguna / Pharmacology',
        designation: designation || 'Associate Professor',
      });
    } else if (role === 'industry') {
      profile = await Industry.create({
        userId: user._id,
        companyName: companyName || name,
        industrySector: industrySector || 'Ayurveda & Herbal Formulations',
        website: website || '',
      });
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user with email & password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select passwordHash as it has select: false in schema
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Fetch matching profile
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id }).populate('institutionId');
    } else if (user.role === 'academician') {
      profile = await Academician.findOne({ userId: user._id }).populate('institutionId');
    } else if (user.role === 'industry') {
      profile = await Industry.findOne({ userId: user._id });
    }

    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user info
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id }).populate('institutionId');
    } else if (user.role === 'academician') {
      profile = await Academician.findOne({ userId: user._id }).populate('institutionId');
    } else if (user.role === 'industry') {
      profile = await Industry.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear token cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
};
