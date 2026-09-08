const groq = require('../utils/aiClient');

const analyzeJobDescription = async (rawDescription) => {
  const prompt = `You are a job description parsing assistant. Extract structured information from the job posting text below.

Return ONLY valid JSON, no extra text, matching this exact structure:

{
  "extractedSkills": ["skill1", "skill2"],
  "experienceLevel": "Entry | Mid | Senior | Not specified"
}

Rules:
- "extractedSkills" should be individual technical skills only (languages, frameworks, tools, platforms) — not soft skills like "communication" or "team player".
- Include skills mentioned as required OR preferred/nice-to-have, don't filter them out.
- "experienceLevel" should be your best inference from the text (years of experience mentioned, seniority language used). If genuinely unclear, use "Not specified".
- Do not include any commentary, only the JSON object.

Job posting text:
"""
${rawDescription}
"""`;

  const completion = await groq.chat.completions.create({
   model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const responseText = completion.choices[0].message.content;

  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch (err) {
    throw new Error('AI returned invalid JSON — could not parse job description');
  }

  return {
    extractedSkills: Array.isArray(parsed.extractedSkills) ? parsed.extractedSkills : [],
    experienceLevel: typeof parsed.experienceLevel === 'string' ? parsed.experienceLevel : 'Not specified',
  };
};

module.exports = { analyzeJobDescription };