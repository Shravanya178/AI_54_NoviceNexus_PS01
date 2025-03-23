// controllers/settingsController.js
import Settings from '../models/Settings.js';
import User from '../models/User.js';
import { getSupportedLanguages } from '../services/languageService.js';

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });
    
    if (!settings) {
      // Create default settings if not found
      settings = new Settings({ userId: req.user.id });
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// Update user settings
export const updateSettings = async (req, res) => {
  try {
    const { 
      language, 
      voiceSettings, 
      interface: interfaceSettings, 
      notifications, 
      privacy, 
      aiSettings 
    } = req.body;
    
    let settings = await Settings.findOne({ userId: req.user.id });
    
    if (!settings) {
      settings = new Settings({ userId: req.user.id });
    }
    
    // Update settings if provided
    if (language) settings.language = language;
    
    if (voiceSettings) {
      if (voiceSettings.enabled !== undefined) settings.voiceSettings.enabled = voiceSettings.enabled;
      if (voiceSettings.voiceId) settings.voiceSettings.voiceId = voiceSettings.voiceId;
      if (voiceSettings.speed) settings.voiceSettings.speed = voiceSettings.speed;
      if (voiceSettings.pitch) settings.voiceSettings.pitch = voiceSettings.pitch;
    }
    
    if (interfaceSettings) {
      if (interfaceSettings.theme) settings.interface.theme = interfaceSettings.theme;
      if (interfaceSettings.fontSize) settings.interface.fontSize = interfaceSettings.fontSize;
      if (interfaceSettings.avatarType) settings.interface.avatarType = interfaceSettings.avatarType;
    }
    
    if (notifications) {
      if (notifications.enabled !== undefined) settings.notifications.enabled = notifications.enabled;
      if (notifications.sound !== undefined) settings.notifications.sound = notifications.sound;
    }
    
    if (privacy) {
      if (privacy.saveHistory !== undefined) settings.privacy.saveHistory = privacy.saveHistory;
      if (privacy.shareData !== undefined) settings.privacy.shareData = privacy.shareData;
    }
    
    if (aiSettings) {
      if (aiSettings.model) settings.aiSettings.model = aiSettings.model;
      if (aiSettings.temperature) settings.aiSettings.temperature = aiSettings.temperature;
      if (aiSettings.maxTokens) settings.aiSettings.maxTokens = aiSettings.maxTokens;
    }
    
    await settings.save();
    
    // Update user's preferred language and avatar type in user document too
    if (language || (interfaceSettings && interfaceSettings.avatarType)) {
      const user = await User.findById(req.user.id);
      
      if (user) {
        if (language) user.settings.preferredLanguage = language;
        if (interfaceSettings && interfaceSettings.avatarType) user.settings.avatarType = interfaceSettings.avatarType;
        await user.save();
      }
    }
    
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// Get supported languages
export const getLanguages = async (req, res) => {
  try {
    const languages = await getSupportedLanguages();
    
    res.status(200).json({
      success: true,
      languages
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching supported languages',
      error: error.message
    });
  }
};

// Upload user avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    // Update user's avatar
    const user = await User.findById(req.user.id);
    user.avatar = avatarPath;
    await user.save();
    
    res.status(200).json({
      success: true,
      avatarUrl: avatarPath
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message
    });
  }
};

// Reset settings to default
export const resetSettings = async (req, res) => {
  try {
    await Settings.deleteOne({ userId: req.user.id });
    
    // Create new settings with defaults
    const settings = new Settings({ userId: req.user.id });
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'Settings reset to default',
      settings
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message
    });
  }
};

