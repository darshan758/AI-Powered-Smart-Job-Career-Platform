const Resume = require('../models/Resume');
const JobPosting = require('../models/JobPosting');
const { calculateAtsScore } = require('../services/atsService');

// GET /api/ats/score or /api/ats/score/:jobId
const getAtsScore = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume || !resume.rawText || resume.parsedSkills.length === 0) {
      return res.status(400).json({ message: 'No analyzed resume found. Upload and analyze one first.' });
    }

    let jobPosting = null;
    if (req.params.jobId) {
      jobPosting = await JobPosting.findById(req.params.jobId);
      if (!jobPosting) {
        return res.status(404).json({ message: 'Job posting not found' });
      }
    }

    const result = await calculateAtsScore(resume, jobPosting);
    res.json(result);
  } catch (error) {
    console.error('ATS scoring error:', error);
    res.status(500).json({ message: 'Could not calculate ATS score. Please try again.' });
  }
};

module.exports = { getAtsScore };