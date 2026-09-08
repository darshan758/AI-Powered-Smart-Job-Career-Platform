const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalFileName: String,
  fileUrl: String,
  rawText: {
    type: String, // extracted text from the PDF, used for AI parsing
  },
  extractedSkills: [{
    type: String,
  }],
  extractedProjects: [{
    title: String,
    description: String,
  }],
  parsedSkills: [{
    type: String,
  }],
  parsedExperience: [{
    title: String,
    company: String,
    duration: String,
    description: String,
  }],
  parsedProjects: [{
    name: String,
    description: String,
    techUsed: [{
      type: String,
    }],
  }],
  targetRole: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);