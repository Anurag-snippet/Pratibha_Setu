const express = require('express');
const {
  getIndustryProfile,
  updateIndustryProfile,
  getIndustryPostings,
  getIndustryApplicants,
} = require('../controllers/industry.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:id/profile', verifyToken, getIndustryProfile);
router.patch('/:id/profile', verifyToken, updateIndustryProfile);
router.get('/:id/postings', verifyToken, getIndustryPostings);
router.get(
  '/:id/applicants',
  verifyToken,
  requireRole('industry', 'institution_admin'),
  getIndustryApplicants
);

module.exports = router;
