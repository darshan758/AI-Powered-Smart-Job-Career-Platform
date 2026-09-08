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
    res.status(500).json({ message: error.message });
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