const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createRoadmap, getMyRoadmaps, toggleRoadmapItem } = require('../controllers/roadmapController');

const router = express.Router();

router.post('/generate/:roleId', protect, createRoadmap);
router.get('/', protect, getMyRoadmaps);
router.patch('/:roadmapId/item/:itemId', protect, toggleRoadmapItem);

module.exports = router;