const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createJobPosting,
  getAllJobPostings,
  getJobPostingById,
  deleteJobPosting,
} = require('../controllers/jobPostingController');

const router = express.Router();

router.post('/', protect, createJobPosting);
router.get('/', getAllJobPostings);
router.get('/:id', getJobPostingById);

const { adminOnly } = require('../middleware/adminMiddleware');

router.delete('/:id', protect, adminOnly, deleteJobPosting);

module.exports = router;