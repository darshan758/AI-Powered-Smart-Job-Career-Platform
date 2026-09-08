// Checks that do not need AI: fast, deterministic, and free.
const checkContactInfo = (rawText) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/;
  const hasEmail = emailRegex.test(rawText);
  const hasPhone = phoneRegex.test(rawText);
  const issues = [];

  if (!hasEmail) issues.push('No email address detected');
  if (!hasPhone) issues.push('No phone number detected');

  return { score: (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0), maxScore: 10, hasEmail, hasPhone, issues };
};

const checkSections = (rawText) => {
  const sectionPatterns = {
    experience: /\b(experience|work history|employment)\b/i,
    education: /\b(education|academic background)\b/i,
    skills: /\b(skills|technical skills|core competencies)\b/i,
    projects: /\b(projects|portfolio)\b/i,
  };
  const foundSections = Object.entries(sectionPatterns)
    .filter(([, pattern]) => pattern.test(rawText))
    .map(([section]) => section);
  const missingSections = Object.keys(sectionPatterns).filter((section) => !foundSections.includes(section));

  return {
    score: Math.round((foundSections.length / 4) * 15),
    maxScore: 15,
    foundSections,
    missingSections,
  };
};

const checkEducation = (rawText) => {
  const educationRegex = /\b(bachelor|master|b\.?tech|m\.?tech|b\.?sc|m\.?sc|university|college|degree|diploma)\b/i;
  const found = educationRegex.test(rawText);
  return { score: found ? 15 : 0, maxScore: 15, found };
};

const checkFormatting = (rawText) => {
  const trimmedText = rawText.trim();
  const wordCount = trimmedText ? trimmedText.split(/\s+/).length : 0;
  const bulletCount = (rawText.match(/(?:^|\n)\s*[•●▪\-*]\s/g) || []).length;
  const issues = [];
  let score = 0;

  if (wordCount >= 200 && wordCount <= 1200) {
    score += 5;
  } else {
    issues.push(wordCount < 200 ? 'Resume seems too short — add more detail' : 'Resume seems too long — consider trimming');
  }

  if (bulletCount >= 5) {
    score += 5;
  } else {
    issues.push('Use more bullet points to describe experience — this improves ATS parsing');
  }

  return { score, maxScore: 10, wordCount, bulletCount, issues };
};

module.exports = { checkContactInfo, checkSections, checkEducation, checkFormatting };