const express = require('express');
const { body } = require('express-validator');
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunity.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

const opportunityRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type')
    .isIn(['internship', 'job', 'workshop', 'mentorship', 'fdp', 'research'])
    .withMessage('Type must be internship, job, workshop, mentorship, fdp, or research'),
];

router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);
router.post(
  '/',
  verifyToken,
  requireRole('industry', 'institution_admin'),
  opportunityRules,
  validate,
  createOpportunity
);
router.patch(
  '/:id',
  verifyToken,
  requireRole('industry', 'institution_admin'),
  updateOpportunity
);
router.delete(
  '/:id',
  verifyToken,
  requireRole('industry', 'institution_admin'),
  deleteOpportunity
);

module.exports = router;
