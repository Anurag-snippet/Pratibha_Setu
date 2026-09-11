const express = require('express');
const {
  uploadDocument,
  getUserDocuments,
  deleteDocument,
} = require('../controllers/document.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/upload', verifyToken, upload.single('document'), uploadDocument);
router.get('/:userId', verifyToken, getUserDocuments);
router.delete('/:id', verifyToken, deleteDocument);

module.exports = router;
