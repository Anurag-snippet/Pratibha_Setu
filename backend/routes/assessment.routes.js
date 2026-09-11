const express = require('express');
const {
  getAssessmentQuestions,
  submitAssessment,
} = require('../controllers/assessment.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/questions', verifyToken, getAssessmentQuestions);
router.post('/submit', verifyToken, requireRole('student'), submitAssessment);

module.exports = router;
