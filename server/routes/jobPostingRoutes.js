const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  createJobPosting,
  getAllJobPostings,
  getJobPostingById,
  deleteJobPosting,
} = require('../controllers/jobPostingController');

const router = express.Router();

router.post('/', protect, adminOnly, createJobPosting);
router.get('/', getAllJobPostings);
router.get('/:id', getJobPostingById);

router.delete('/:id', protect, adminOnly, deleteJobPosting);

module.exports = router;