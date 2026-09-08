const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMatchScore } = require('../controllers/matchController');

const router = express.Router();

router.get('/:jobId', protect, getMatchScore);

module.exports = router;