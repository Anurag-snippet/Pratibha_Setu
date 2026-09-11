const express = require('express');
const {
  getAcademicianProfile,
  updateAcademicianProfile,
  getAcademicianStudents,
} = require('../controllers/academician.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:id/profile', verifyToken, getAcademicianProfile);
router.patch('/:id/profile', verifyToken, updateAcademicianProfile);
router.get(
  '/:id/students',
  verifyToken,
  requireRole('academician', 'institution_admin'),
  getAcademicianStudents
);

module.exports = router;
