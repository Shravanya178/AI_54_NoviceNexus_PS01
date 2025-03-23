// models/Settings.js
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  language: {
    type: String,
    default: 'en'
  },
  voiceSettings: {
    enabled: {
      type: Boolean,
      default: true
    },
    voiceId: {
      type: String,
      default: 'en-US-Standard-B'
    },
    speed: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0
    },
    pitch: {
      type: Number,
      default: 0,
      min: -10,
      max: 10
    }
  },
  interface: {
    theme: {
      type: String,
      default: 'light',
      enum: ['light', 'dark', 'system']
    },
    fontSize: {
      type: String,
      default: 'medium',
      enum: ['small', 'medium', 'large']
    },
    avatarType: {
      type: String,
      default: 'animated',
      enum: ['animated', 'static', 'none']
    }
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    sound: {
      type: Boolean,
      default: true
    }
  },
  privacy: {
    saveHistory: {
      type: Boolean,
      default: true
    },
    shareData: {
      type: Boolean,
      default: false
    }
  },
  aiSettings: {
    model: {
      type: String,
      default: 'default'
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 1
    },
    maxTokens: {
      type: Number,
      default: 2000
    }
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;