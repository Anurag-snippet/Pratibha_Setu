const Skill = require('../models/Skill');

/**
 * @desc    Get all skills
 * @route   GET /api/skills
 * @access  Public / Authenticated
 */
const getAllSkills = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: new RegExp(category, 'i') } : {};

    const skills = await Skill.find(filter).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new skill
 * @route   POST /api/skills
 * @access  Private (Admin / Academician)
 */
const createSkill = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    const existing = await Skill.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Skill already exists.',
        data: existing,
      });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category: category || 'Ayush Core',
    });

    return res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSkills,
  createSkill,
};
