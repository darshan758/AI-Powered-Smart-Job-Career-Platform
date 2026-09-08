const groq = require('../utils/aiClient');
const { buildUserContext } = require('./chatContextService');

const SYSTEM_PROMPT = `You are a helpful, encouraging career guidance assistant for a job-search platform.

You will be given CONTEXT about the specific user you're talking to — their skills, target role, learning roadmap progress, and potentially relevant job postings. Use this context to give specific, personalized advice.

Rules:
- Ground your answers in the provided context. Don't make up skills, jobs, or details not present in the context.
- If the context doesn't contain enough information to answer well (e.g., no resume uploaded), gently tell the user what they should do first (e.g., "upload and analyze your resume") rather than guessing.
- Be encouraging and constructive, especially when discussing skill gaps — frame them as a learning plan, not a deficiency.
- Keep responses conversational and reasonably concise, not overly long unless the user asks for detail.`;

const getChatResponse = async (userId, userMessage, conversationHistory) => {
  const userContext = await buildUserContext(userId, userMessage);

  const messages = [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\nCONTEXT ABOUT THIS USER:\n${userContext}` },
    // Include recent conversation history so the model has continuity
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages,
    temperature: 0.6,
  });

  return completion.choices[0].message.content;
};

module.exports = { getChatResponse };