const groq = require('../utils/aiClient');

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const analyzeContentQuality = async (rawText) => {
  const prompt = `You are an ATS resume reviewer. Analyze the resume text below for action verbs and quantifiable achievements.

Return ONLY valid JSON matching this structure:
{
  "actionVerbScore": 0,
  "quantifiableScore": 0,
  "weakPhrasesFound": [],
  "suggestions": []
}

Rules:
- Scores must be integers from 0 to 100.
- List actual weak phrases found, up to 5, or an empty array.
- Provide 2-4 short, specific suggestions based on this resume.
- Do not include commentary outside the JSON object.

Resume text:
"""
${rawText}
"""`;

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  let parsed;
  try {
    parsed = JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    throw new Error('AI returned invalid JSON — could not analyze content quality');
  }

  return {
    actionVerbScore: typeof parsed.actionVerbScore === 'number' ? clampScore(parsed.actionVerbScore) : 0,
    quantifiableScore: typeof parsed.quantifiableScore === 'number' ? clampScore(parsed.quantifiableScore) : 0,
    weakPhrasesFound: Array.isArray(parsed.weakPhrasesFound) ? parsed.weakPhrasesFound.slice(0, 5) : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4) : [],
  };
};

module.exports = { analyzeContentQuality };