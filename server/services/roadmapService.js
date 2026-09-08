const groq = require('../utils/aiClient');

const generateRoadmap = async (missingRequired, missingNiceToHave, targetRole) => {
  const prompt = `You are a career mentor creating a learning roadmap for someone targeting the role: "${targetRole}".

They are missing these REQUIRED skills: ${missingRequired.join(', ') || 'none'}
They are missing these NICE-TO-HAVE skills: ${missingNiceToHave.join(', ') || 'none'}

Create a prioritized learning roadmap. Return ONLY valid JSON, no extra text, matching this exact structure:

{
  "items": [
    {
      "skill": "",
      "priority": "high | medium | low",
      "estimatedTime": "",
      "resources": ["suggestion 1", "suggestion 2"]
    }
  ]
}

Rules:
- Order the array so the most foundational/urgent skills come first — someone should be able to follow this top to bottom.
- Required skills should generally be "high" or "medium" priority; nice-to-have skills are usually "medium" or "low", unless a nice-to-have skill is foundational to a required one.
- "estimatedTime" should be realistic for a learner studying part-time (e.g. "1-2 weeks", "3-4 days").
- "resources" should be short, practical suggestions (e.g. "Official docs + build a small CRUD app"), not actual URLs.
- Include ALL missing skills from both lists, don't skip any.
- Do not include any commentary, only the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    response_format: { type: 'json_object' },
  });

  const responseText = completion.choices[0].message.content;

  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch (err) {
    throw new Error('AI returned invalid JSON — could not generate roadmap');
  }

  if (!Array.isArray(parsed.items)) {
    throw new Error('AI response missing expected "items" array');
  }

  return parsed.items;
};

module.exports = { generateRoadmap };