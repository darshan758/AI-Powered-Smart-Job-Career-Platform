const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    rawDescription: { type: String, required: true },
    extractedSkills: [String],
    experienceLevel: String, // e.g. "Entry", "Mid", "Senior"
    source: { type: String, default: 'manual' }, // 'manual' now, could be 'scraped'/'api' later
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // tracks which admin/user added this posting
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobPosting', jobPostingSchema);