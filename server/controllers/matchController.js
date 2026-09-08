const Resume = require('../models/Resume');
const JobPosting = require('../models/JobPosting');
const { getVectorById, cosineSimilarity } = require('../services/vectorService');
const { calculateSkillOverlap } = require('../services/skillGapService');

// GET /api/match/:jobId
const getMatchScore = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume || resume.parsedSkills.length === 0) {
      return res.status(400).json({
        message: 'No analyzed resume found. Upload and analyze a resume first.',
      });
    }

    const jobPosting = await JobPosting.findById(req.params.jobId);
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    const { matched, missing, overlapPercentage } = calculateSkillOverlap(
      resume.parsedSkills,
      jobPosting.extractedSkills || []
    );

    // Fetch both vectors (created back in Step 12) and compute semantic similarity
    const resumeVector = await getVectorById(resume._id.toString());
    const jobVector = await getVectorById(jobPosting._id.toString());

    if (!resumeVector || !jobVector) {
      return res.json({
        jobTitle: jobPosting.title,
        company: jobPosting.company,
        finalScore: overlapPercentage,
        breakdown: {
          skillOverlapScore: overlapPercentage,
          semanticSimilarityScore: null,
        },
        semanticAvailable: false,
        matchedSkills: matched,
        missingSkills: missing,
      });
    }

    const semanticSimilarity = cosineSimilarity(resumeVector, jobVector); // 0 to 1
    const semanticScore = Math.round(semanticSimilarity * 100);

    // Explicit skill overlap
    // Blended final score — weighted toward concrete skill overlap, semantic similarity as supporting signal
    const finalScore = Math.round(overlapPercentage * 0.6 + semanticScore * 0.4);

    res.json({
      jobTitle: jobPosting.title,
      company: jobPosting.company,
      finalScore,
      breakdown: {
        skillOverlapScore: overlapPercentage,
        semanticSimilarityScore: semanticScore,
      },
      matchedSkills: matched,
      missingSkills: missing,
    });
  } catch (error) {
    console.error('Match calculation error:', error);
    res.status(500).json({
      message: 'Unable to calculate this match right now. Please try again later.',
    });
  }
};

module.exports = { getMatchScore };