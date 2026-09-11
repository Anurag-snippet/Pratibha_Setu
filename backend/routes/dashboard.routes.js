const express = require('express');
const {
  getStudentDashboard,
  getIndustryDashboard,
  getInstitutionDashboard,
} = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/student/:id', verifyToken, getStudentDashboard);
router.get('/industry/:id', verifyToken, getIndustryDashboard);
router.get('/institution/:id', verifyToken, getInstitutionDashboard);

module.exports = router;
