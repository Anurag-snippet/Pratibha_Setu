const express = require('express');
const {
  getStudentProfile,
  updateStudentProfile,
  getStudentSkills,
  updateStudentSkills,
  getSkillGap,
  getRecommendations,
} = require('../controllers/student.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:id/profile', verifyToken, getStudentProfile);
router.patch('/:id/profile', verifyToken, updateStudentProfile);
router.get('/:id/skills', verifyToken, getStudentSkills);
router.post('/:id/skills', verifyToken, updateStudentSkills);
router.get('/:id/skill-gap', verifyToken, getSkillGap);
router.get('/:id/recommendations', verifyToken, getRecommendations);

module.exports = router;
