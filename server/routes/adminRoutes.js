const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { getAllUsers } = require('../controllers/authController');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;