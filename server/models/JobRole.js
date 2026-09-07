const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    requiredSkills: [String],
    niceToHaveSkills: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobRole', jobRoleSchema);