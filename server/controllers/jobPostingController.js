const JobPosting = require('../models/JobPosting');
const { analyzeJobDescription } = require('../services/jobDescriptionService');
const { upsertVector } = require('../services/vectorService');

// POST /api/jobpostings
const createJobPosting = async (req, res) => {
  try {
    const { title, company, location, rawDescription } = req.body;

    if (!title || !company || !rawDescription) {
      return res.status(400).json({ message: 'title, company, and rawDescription are required' });
    }

    const { extractedSkills, experienceLevel } = await analyzeJobDescription(rawDescription);

    const jobPosting = await JobPosting.create({
      title,
      company,
      location,
      rawDescription,
      extractedSkills,
      experienceLevel,
      createdBy: req.user._id,
    });

    const embeddingText = `${title} at ${company}. Required skills: ${extractedSkills.join(', ')}. ${rawDescription}`;

    try {
      await upsertVector(jobPosting._id.toString(), embeddingText, {
        type: 'job',
        title: jobPosting.title,
        company: jobPosting.company,
      });
    } catch (vectorError) {
      console.error('Job posting vector indexing failed:', vectorError.message);
    }

    res.status(201).json(jobPosting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobpostings
const getAllJobPostings = async (req, res) => {
  try {
    const postings = await JobPosting.find().select('-rawDescription').sort({ createdAt: -1 });
    res.json(postings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobpostings/:id
const getJobPostingById = async (req, res) => {
  try {
    const posting = await JobPosting.findById(req.params.id);
    if (!posting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json(posting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE /api/jobpostings/:id
const deleteJobPosting = async (req, res) => {
  try {
    const posting = await JobPosting.findByIdAndDelete(req.params.id);
    if (!posting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json({ message: 'Job posting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJobPosting, getAllJobPostings, getJobPostingById, deleteJobPosting };