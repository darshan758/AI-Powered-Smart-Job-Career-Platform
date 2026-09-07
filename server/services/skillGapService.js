// Common variations mapped to a single canonical form
const SKILL_SYNONYMS = {
  'react.js': 'react',
  'reactjs': 'react',
  'node.js': 'node',
  'nodejs': 'node',
  'node js': 'node',
  'express.js': 'express',
  'expressjs': 'express',
  'mongo db': 'mongodb',
  'mongo': 'mongodb',
  'js': 'javascript',
  'ts': 'typescript',
  'tailwind': 'tailwind css',
  'restful apis': 'rest apis',
  'rest api': 'rest apis',
  'git hub': 'github',
};

// Converts a skill string into a consistent comparable form
const normalizeSkill = (skill) => {
  const lower = skill.trim().toLowerCase();
  return SKILL_SYNONYMS[lower] || lower;
};

const calculateSkillGap = (userSkills, jobRole) => {
  // Build a normalized Set of the user's skills for O(1) lookup
  const normalizedUserSkills = new Set(userSkills.map(normalizeSkill));

  const matchedRequired = [];
  const missingRequired = [];
  const matchedNiceToHave = [];
  const missingNiceToHave = [];

  jobRole.requiredSkills.forEach((skill) => {
    if (normalizedUserSkills.has(normalizeSkill(skill))) {
      matchedRequired.push(skill);
    } else {
      missingRequired.push(skill);
    }
  });

  jobRole.niceToHaveSkills.forEach((skill) => {
    if (normalizedUserSkills.has(normalizeSkill(skill))) {
      matchedNiceToHave.push(skill);
    } else {
      missingNiceToHave.push(skill);
    }
  });

  const totalRequired = jobRole.requiredSkills.length;
  const matchPercentage =
    totalRequired === 0 ? 0 : Math.round((matchedRequired.length / totalRequired) * 100);

  return {
    role: jobRole.title,
    matchPercentage,
    matchedRequired,
    missingRequired,
    matchedNiceToHave,
    missingNiceToHave,
  };
};

module.exports = { calculateSkillGap };