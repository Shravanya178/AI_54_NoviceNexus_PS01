// routes/chat.js
import express from 'express';
import { 
  createChat,
  getUserChats,
  getChatById,
  addMessage,
  updateChat,
  deleteChat,
  clearChatHistory
} from '../controllers/chatcontroller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all chat routes
router.use(authenticate);

router.post('/', createChat);
router.get('/', getUserChats);
router.get('/:id', getChatById);
router.post('/:id/messages', addMessage);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);
router.delete('/:id/history', clearChatHistory);

export default router;