// services/aiService.js
import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Format chat history for AI model consumption
const formatChatHistory = (messages) => {
  return messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));
};

// Generate AI response using OpenAI
export const generateAIResponse = async (userMessage, modelName = 'default', chatHistory = []) => {
  try {
    // Default to GPT-3.5-turbo if not specified
    const model = modelName === 'default' ? 'gpt-3.5-turbo' : modelName;
    
    // Format chat history for the AI model
    const formattedHistory = formatChatHistory(chatHistory);
    
    // Add system message at the beginning
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful, knowledgeable, and friendly AI assistant. Provide accurate, concise, and helpful responses.'
      },
      ...formattedHistory
    ];
    
    // If the last message in history isn't the current user message, add it
    if (chatHistory.length === 0 || chatHistory[chatHistory.length - 1].text !== userMessage) {
      messages.push({
        role: 'user',
        content: userMessage
      });
    }
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI response generation error:', error);
    
    // Return fallback response
    return "I'm sorry, I'm having trouble processing your request. Please try again in a moment.";
  }
};

// Alternative implementation using custom API if needed
export const generateAIResponseViaCustomAPI = async (userMessage, modelName = 'default', chatHistory = []) => {
  try {
    const apiUrl = process.env.CUSTOM_AI_API_URL;
    
    const response = await axios.post(apiUrl, {
      message: userMessage,
      model: modelName,
      history: chatHistory
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.CUSTOM_AI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.response;
  } catch (error) {
    console.error('Custom AI API error:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later.";
  }
};