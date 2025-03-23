import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

// Load environment variables
dotenv.config();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app & Server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// MongoDB Connection with Auto-Reconnect
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Handle MongoDB Disconnections
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Reconnecting...');
  connectDB();
});

// Connect to MongoDB
connectDB();

// Configure CORS middleware with expanded options
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Frontend URL from env or default
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Static Files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Events
io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);
  
  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });
  
  socket.on('send-message', async (message) => {
    console.log('📩 Message received:', message);
    socket.emit('ai-thinking', true);
    
    try {
      // Simulate AI response delay
      setTimeout(() => {
        const aiResponse = {
          id: Date.now().toString(),
          text: "🤖 AI response placeholder. Replace with actual AI logic.",
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        io.to(message.roomId).emit('receive-message', aiResponse);
        socket.emit('ai-thinking', false);
      }, 1000);
    } catch (error) {
      console.error('❌ Error processing message:', error);
      socket.emit('error', { message: 'Failed to process message' });
      socket.emit('ai-thinking', false);
    }
  });
  
  // Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;