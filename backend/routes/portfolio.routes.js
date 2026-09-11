const express = require('express');
const {
  getStudentPortfolio,
  addPortfolioItem,
  deletePortfolioItem,
} = require('../controllers/portfolio.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/:studentId', getStudentPortfolio);
router.post(
  '/:studentId/items',
  verifyToken,
  upload.single('file'),
  addPortfolioItem
);
router.delete('/items/:itemId', verifyToken, deletePortfolioItem);

module.exports = router;
