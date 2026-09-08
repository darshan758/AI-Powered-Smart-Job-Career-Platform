const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadResume, analyzeResume } = require('../controllers/resumeController');

const router = express.Router();

const uploadResumeFile = (req, res, next) => {
	upload.single('resume')(req, res, (error) => {
		if (error) {
			return res.status(400).json({ message: error.message });
		}

		next();
	});
};

router.post('/upload', protect, uploadResumeFile, uploadResume);
router.post('/analyze', protect, analyzeResume);

module.exports = router;