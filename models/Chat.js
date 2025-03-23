// models/Chat.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true,
    enum: ['user', 'ai']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  audioUrl: String,
  isProcessing: {
    type: Boolean,
    default: false
  },
  metadata: {
    language: String,
    sentiment: String,
    entities: [String],
    intentScore: Number
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: function() {
      return `Chat ${new Date().toLocaleString()}`;
    }
  },
  messages: [messageSchema],
  aiModel: {
    type: String,
    default: 'default'
  },
  language: {
    type: String,
    default: 'en'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  summary: String,
  tags: [String]
}, {
  timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

