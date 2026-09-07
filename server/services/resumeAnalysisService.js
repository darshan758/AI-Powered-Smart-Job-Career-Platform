const groq = require('../utils/aiClient');

const analyzeResumeText = async (rawText) => {
  const prompt = `You are a resume parsing assistant. Extract structured information from the resume text below.

Return ONLY valid JSON, with no extra text, no markdown code fences, no explanations. Match this exact structure:

{
  "skills": ["skill1", "skill2"],
  "experience": [
    { "title": "", "company": "", "duration": "", "description": "" }
  ],
  "projects": [
    { "name": "", "description": "", "techUsed": ["tech1", "tech2"] }
  ]
}

Rules:
- "skills" should be individual technical skills only (languages, frameworks, tools) — not soft skills like "teamwork".
- If a section (experience or projects) is not present in the resume, return an empty array for it — do not invent data.
- "duration" should be written exactly as it appears in the resume (e.g. "Jan 2022 - Present").
- Do not include any commentary, only the JSON object.

Resume text:
"""
${rawText}
"""`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const responseText = completion.choices[0].message.content;

  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch (err) {
    throw new Error('AI returned invalid JSON — could not parse resume analysis');
  }

  return {
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
  };
};

module.exports = { analyzeResumeText };