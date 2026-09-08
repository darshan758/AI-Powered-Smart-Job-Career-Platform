const mongoose = require('mongoose');

const roadmapItemSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    estimatedTime: String, // e.g. "1-2 weeks"
    resources: [String], // suggested resource names/types (e.g. "Official docs", "Build a CRUD app")
    completed: { type: Boolean, default: false },
  },
  { _id: true } // each item gets its own ID so the frontend can toggle "completed" on a specific one
);

const learningRoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRole: { type: String, required: true },
    items: [roadmapItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningRoadmap', learningRoadmapSchema);