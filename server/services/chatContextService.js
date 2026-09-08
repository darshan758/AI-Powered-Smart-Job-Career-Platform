const Resume = require('../models/Resume');
const LearningRoadmap = require('../models/LearningRoadmap');
const { findSimilar } = require('./vectorService');

const buildUserContext = async (userId, userMessage) => {
  const resume = await Resume.findOne({ user: userId });
  const roadmaps = await LearningRoadmap.find({ user: userId });

  let contextParts = [];

  if (resume) {
    contextParts.push(`User's current skills: ${resume.parsedSkills.join(', ') || 'none parsed yet'}`);
    if (resume.targetRole) {
      contextParts.push(`User's target role: ${resume.targetRole}`);
    }
  } else {
    contextParts.push('User has not uploaded a resume yet.');
  }

  if (roadmaps.length > 0) {
    roadmaps.forEach((roadmap) => {
      const completed = roadmap.items.filter((i) => i.completed).length;
      const pending = roadmap.items.filter((i) => !i.completed).map((i) => i.skill);
      contextParts.push(
        `Roadmap for "${roadmap.targetRole}": ${completed}/${roadmap.items.length} skills completed. Still to learn: ${pending.join(', ') || 'none — all done!'}`
      );
    });
  }

  // Pull in relevant job postings via vector search, only if resume exists
  if (resume) {
    try {
      const relevantJobs = await findSimilar(userMessage, 3, { type: 'job' });
      if (relevantJobs.length > 0) {
        const jobSummaries = relevantJobs
          .map((j) => `${j.metadata.title} at ${j.metadata.company} (relevance: ${Math.round(j.score * 100)}%)`)
          .join('; ');
        contextParts.push(`Potentially relevant job postings: ${jobSummaries}`);
      }
    } catch (error) {
      console.error('Job vector search unavailable:', error.message);
    }
  }

  return contextParts.join('\n');
};

module.exports = { buildUserContext };