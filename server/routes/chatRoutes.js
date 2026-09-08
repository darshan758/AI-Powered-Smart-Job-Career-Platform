const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/history', protect, getChatHistory);

module.exports = router;