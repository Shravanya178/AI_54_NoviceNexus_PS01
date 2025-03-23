// controllers/chatController.js
import Chat from '../models/Chat.js';
import { generateAIResponse } from '../services/aiService.js';
import { generateSpeech } from '../services/ttsService.js';
import { detectLanguage } from '../services/languageService.js';

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { title, aiModel } = req.body;
    
    const newChat = new Chat({
      userId: req.user.id,
      title: title || `Chat ${new Date().toLocaleString()}`,
      aiModel: aiModel || 'default'
    });
    
    await newChat.save();
    
    res.status(201).json({
      success: true,
      chat: newChat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating chat',
      error: error.message
    });
  }
};

// Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filters
    const filter = { userId: req.user.id };
    
    if (req.query.archived === 'true') {
      filter.isArchived = true;
    } else if (req.query.archived === 'false') {
      filter.isArchived = false;
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { 'messages.text': { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Get chats
    const chats = await Chat.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title createdAt updatedAt isArchived aiModel');
    
    // Get total count
    const totalChats = await Chat.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      chats,
      pagination: {
        current: page,
        limit,
        total: totalChats,
        pages: Math.ceil(totalChats / limit)
      }
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chats',
      error: error.message
    });
  }
};

// Get a single chat by ID
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat',
      error: error.message
    });
  }
};

// Add a message to a chat
export const addMessage = async (req, res) => {
  try {
    const { text, audioInput } = req.body;
    
    if (!text && !audioInput) {
      return res.status(400).json({
        success: false,
        message: 'Message text or audio input is required'
      });
    }
    
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Detect language if not specified
    const detectedLanguage = await detectLanguage(text);
    
    // Add user message
    const userMessage = {
      text,
      sender: 'user',
      timestamp: new Date(),
      metadata: {
        language: detectedLanguage
      }
    };
    
    chat.messages.push(userMessage);
    chat.language = detectedLanguage;
    
    // Process AI response
    const aiResponseText = await generateAIResponse(text, chat.aiModel, chat.messages);
    
    // Generate speech if needed
    let audioUrl = null;
    if (process.env.TEXT_TO_SPEECH_ENABLED === 'true') {
      audioUrl = await generateSpeech(aiResponseText, detectedLanguage);
    }
    
    // Add AI message
    const aiMessage = {
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date(),
      audioUrl,
      metadata: {
        language: detectedLanguage
      }
    };
    
    chat.messages.push(aiMessage);
    
    // Update chat title if it's the first message
    if (chat.messages.length <= 2 && !chat.title.trim()) {
      chat.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
    }
    
    await chat.save();
    
    res.status(200).json({
      success: true,
      message: aiMessage
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding message',
      error: error.message
    });
  }
};

// Update chat (title, archive status)
export const updateChat = async (req, res) => {
  try {
    const { title, isArchived } = req.body;
    
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    if (title !== undefined) chat.title = title;
    if (isArchived !== undefined) chat.isArchived = isArchived;
    
    await chat.save();
    
    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating chat',
      error: error.message
    });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const result = await Chat.deleteOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting chat',
      error: error.message
    });
  }
};

// Clear chat history
export const clearChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    chat.messages = [];
    await chat.save();
    
    res.status(200).json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing chat history',
      error: error.message
    });
  }
};
