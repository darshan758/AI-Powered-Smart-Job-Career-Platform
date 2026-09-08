const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getAtsScore } = require('../controllers/atsController');

const router = express.Router();

router.get('/score', protect, getAtsScore);
router.get('/score/:jobId', protect, getAtsScore);

module.exports = router;