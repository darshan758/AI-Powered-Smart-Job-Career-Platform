const JobRole = require('../models/JobRole');
const Resume = require('../models/Resume');
const { calculateSkillGap } = require('../services/skillGapService');

// GET /api/jobroles
const getAllJobRoles = async (req, res) => {
  try {
    const roles = await JobRole.find().select('title description');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobroles/:roleId/skill-gap
const getSkillGap = async (req, res) => {
  try {
    const jobRole = await JobRole.findById(req.params.roleId);
    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume || resume.parsedSkills.length === 0) {
      return res.status(400).json({
        message: 'No analyzed resume found. Upload and analyze a resume first.',
      });
    }

    const skillGap = calculateSkillGap(resume.parsedSkills, jobRole);

    // Save the user's chosen target role onto their resume for future features (roadmap, matching)
    resume.targetRole = jobRole.title;
    await resume.save();

    res.json(skillGap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllJobRoles, getSkillGap };