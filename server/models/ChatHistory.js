const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);

const chatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one ongoing conversation thread per user, for simplicity
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatHistory', chatHistorySchema);