const express = require('express');
const {
  getUserNotifications,
  markNotificationRead,
} = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:userId', verifyToken, getUserNotifications);
router.patch('/:id/read', verifyToken, markNotificationRead);

module.exports = router;
