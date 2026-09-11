const express = require('express');
const {
  getInstitutionStudents,
  getInstitutionAnalytics,
} = require('../controllers/institution.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:id/students', verifyToken, getInstitutionStudents);
router.get('/:id/analytics', verifyToken, getInstitutionAnalytics);

module.exports = router;
