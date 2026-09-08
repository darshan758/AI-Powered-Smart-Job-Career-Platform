const {
  checkContactInfo,
  checkSections,
  checkEducation,
  checkFormatting,
} = require('./atsStructuralService');
const { analyzeContentQuality } = require('./atsAiService');
const { calculateSkillOverlap } = require('./skillGapService');

const calculateAtsScore = async (resume, jobPosting = null) => {
  const contactInfo = checkContactInfo(resume.rawText);
  const sections = checkSections(resume.rawText);
  const education = checkEducation(resume.rawText);
  const formatting = checkFormatting(resume.rawText);
  const contentQuality = await analyzeContentQuality(resume.rawText);

  const experienceQualityScore = Math.round(
    ((contentQuality.actionVerbScore + contentQuality.quantifiableScore) / 200) * 25
  );

  let skillsScore;
  let missingKeywords = [];
  if (jobPosting) {
    const overlap = calculateSkillOverlap(resume.parsedSkills, jobPosting.extractedSkills || []);
    skillsScore = Math.round((overlap.overlapPercentage / 100) * 25);
    missingKeywords = overlap.missing;
  } else {
    skillsScore = Math.min(25, Math.round((resume.parsedSkills.length / 10) * 25));
  }

  const finalScore =
    contactInfo.score +
    sections.score +
    education.score +
    formatting.score +
    experienceQualityScore +
    skillsScore;

  return {
    finalScore,
    breakdown: {
      contactInfo,
      sections,
      education,
      formatting,
      experienceQuality: {
        score: experienceQualityScore,
        maxScore: 25,
        actionVerbScore: contentQuality.actionVerbScore,
        quantifiableScore: contentQuality.quantifiableScore,
        weakPhrasesFound: contentQuality.weakPhrasesFound,
      },
      skillsMatch: {
        score: skillsScore,
        maxScore: 25,
        missingKeywords,
        comparedAgainstJob: Boolean(jobPosting),
      },
    },
    suggestions: [
      ...formatting.issues,
      ...contactInfo.issues,
      ...contentQuality.suggestions,
      ...(sections.missingSections.length > 0
        ? [`Add missing sections: ${sections.missingSections.join(', ')}`]
        : []),
    ],
  };
};

module.exports = { calculateAtsScore };