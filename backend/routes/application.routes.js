const express = require('express');
const {
  applyOpportunity,
  getStudentApplications,
  getOpportunityApplications,
  updateApplicationStatus,
} = require('../controllers/application.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', verifyToken, requireRole('student'), applyOpportunity);
router.get('/student/:studentId', verifyToken, getStudentApplications);
router.get(
  '/opportunity/:opportunityId',
  verifyToken,
  requireRole('industry', 'academician', 'institution_admin'),
  getOpportunityApplications
);
router.patch(
  '/:id/status',
  verifyToken,
  requireRole('industry', 'academician', 'institution_admin'),
  updateApplicationStatus
);

module.exports = router;
