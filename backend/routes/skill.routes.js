const express = require('express');
const { getAllSkills, createSkill } = require('../controllers/skill.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllSkills);
router.post(
  '/',
  verifyToken,
  requireRole('academician', 'institution_admin', 'industry'),
  createSkill
);

module.exports = router;
