const JobRole = require('../models/JobRole');
const Resume = require('../models/Resume');
const LearningRoadmap = require('../models/LearningRoadmap');
const { calculateSkillGap } = require('../services/skillGapService');
const { generateRoadmap } = require('../services/roadmapService');

// POST /api/roadmap/generate/:roleId
const createRoadmap = async (req, res) => {
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

    // Reuse Step 8's logic rather than duplicating the comparison here
    const { missingRequired, missingNiceToHave } = calculateSkillGap(
      resume.parsedSkills,
      jobRole
    );

    if (missingRequired.length === 0 && missingNiceToHave.length === 0) {
      return res.status(200).json({
        message: 'No skill gaps found — you already match all skills for this role!',
        items: [],
      });
    }

    const items = await generateRoadmap(missingRequired, missingNiceToHave, jobRole.title);

    // Replace any existing roadmap for this user + role (regenerating is allowed)
    let roadmap = await LearningRoadmap.findOne({ user: req.user._id, targetRole: jobRole.title });

    if (roadmap) {
      roadmap.items = items;
      await roadmap.save();
    } else {
      roadmap = await LearningRoadmap.create({
        user: req.user._id,
        targetRole: jobRole.title,
        items,
      });
    }

    res.status(201).json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/roadmap
const getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await LearningRoadmap.find({ user: req.user._id });
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PATCH /api/roadmap/:roadmapId/item/:itemId
const toggleRoadmapItem = async (req, res) => {
  try {
    const roadmap = await LearningRoadmap.findOne({
      _id: req.params.roadmapId,
      user: req.user._id, // ensures users can only touch their own roadmap
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    const item = roadmap.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Roadmap item not found' });
    }

    item.completed = !item.completed;
    await roadmap.save();

    const completedCount = roadmap.items.filter((i) => i.completed).length;
    const progressPercentage = Math.round((completedCount / roadmap.items.length) * 100);

    res.json({
      message: 'Item updated',
      item,
      progressPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRoadmap, getMyRoadmaps, toggleRoadmapItem };

