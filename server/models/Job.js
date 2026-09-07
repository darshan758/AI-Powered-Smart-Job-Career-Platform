const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  requiredSkills: [{
    type: String,
  }],
  location: String,
  source: String, // e.g. "manual", "scraped", "api"
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);