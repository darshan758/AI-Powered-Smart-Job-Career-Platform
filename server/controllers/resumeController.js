const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { analyzeResumeText } = require('../services/resumeAnalysisService');
const { upsertVector } = require('../services/vectorService');

// POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // req.file.buffer is the raw PDF binary data, held in memory by multer
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({
        message: 'Could not extract text — this PDF may be a scanned image, not real text',
      });
    }

    // Check if user already has a resume — update it instead of creating duplicates
    let resume = await Resume.findOne({ user: req.user._id });

    if (resume) {
      resume.originalFileName = req.file.originalname;
      resume.rawText = rawText;
      // Clear old parsed data since it no longer matches the new raw text
      resume.parsedSkills = [];
      resume.parsedExperience = [];
      resume.parsedProjects = [];
      await resume.save();
    } else {
      resume = await Resume.create({
        user: req.user._id,
        originalFileName: req.file.originalname,
        rawText,
      });
    }

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resumeId: resume._id,
      preview: rawText.slice(0, 300), // just a short preview for the frontend to display
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/resume/analyze
const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });

    if (!resume || !resume.rawText) {
      return res.status(404).json({ message: 'No uploaded resume found. Upload one first.' });
    }

    const { skills, experience, projects } = await analyzeResumeText(resume.rawText);

    resume.parsedSkills = skills;
    resume.parsedExperience = experience;
    resume.parsedProjects = projects;
    await resume.save();

    const embeddingText = [
      resume.parsedSkills.join(', '),
      resume.parsedExperience.map((entry) => `${entry.title} at ${entry.company}: ${entry.description}`).join('. '),
      resume.parsedProjects.map((project) => `${project.name}: ${project.description}`).join('. '),
    ].join('. ');

    try {
      await upsertVector(resume._id.toString(), embeddingText, {
        type: 'resume',
        userId: req.user._id.toString(),
      });
    } catch (vectorError) {
      console.error('Resume vector indexing failed:', vectorError.message);
    }

    res.json({
      message: 'Resume analyzed successfully',
      parsedSkills: resume.parsedSkills,
      parsedExperience: resume.parsedExperience,
      parsedProjects: resume.parsedProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, analyzeResume };