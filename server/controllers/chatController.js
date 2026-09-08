const ChatHistory = require('../models/ChatHistory');
const { getChatResponse } = require('../services/chatService');

const MAX_HISTORY_MESSAGES = 10; // last 10 messages (5 exchanges) sent as context

// POST /api/chat
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    let chat = await ChatHistory.findOne({ user: req.user._id });
    if (!chat) {
      chat = await ChatHistory.create({ user: req.user._id, messages: [] });
    }

    // Only send recent history to the AI, to keep prompts fast and cheap
    const recentHistory = chat.messages.slice(-MAX_HISTORY_MESSAGES);

    const aiReply = await getChatResponse(req.user._id, message, recentHistory);

    // Save both the user's message and the AI's reply
    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: aiReply });
    await chat.save();

    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Chat error:', error);

    const rawMessage = error.message || '';
    const statusCode = error.status || error.statusCode;

    if (
      rawMessage.includes('GROQ_API_KEY') ||
      rawMessage.includes('api key') ||
      statusCode === 401 ||
      rawMessage.includes('401')
    ) {
      return res.status(500).json({
        message: 'AI service is not configured correctly. Please contact support.',
      });
    }
    if (statusCode === 403 || rawMessage.includes('PERMISSION_DENIED')) {
      return res.status(500).json({
        message: 'AI service access was denied. Please contact support.',
      });
    }
    if (rawMessage.includes('rate limit') || rawMessage.includes('429')) {
      return res.status(429).json({
        message: 'AI service is busy right now. Please wait a moment and try again.',
      });
    }
    if (rawMessage.includes('model_not_found') || rawMessage.includes('does not exist')) {
      return res.status(500).json({
        message: 'AI model configuration error. Please contact support.',
      });
    }

    return res.status(500).json({
      message: 'Something went wrong generating a response. Please try again.',
    });
  }
};

// GET /api/chat/history
const getChatHistory = async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ user: req.user._id });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getChatHistory };