// services/ttsService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
import { dirname } from 'path';
const uploadsDir = path.join(__dirname, '..', 'uploads', 'audio');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Map language codes to voice IDs
const getVoiceId = (languageCode) => {
  const voiceMap = {
    'en': 'en-US-Standard-B',
    'es': 'es-ES-Standard-A',
    'fr': 'fr-FR-Standard-A',
    'de': 'de-DE-Standard-A',
    'it': 'it-IT-Standard-A',
    'ja': 'ja-JP-Standard-A',
    'ko': 'ko-KR-Standard-A',
    'pt': 'pt-BR-Standard-A',
    'ru': 'ru-RU-Standard-A',
    'zh': 'cmn-CN-Standard-A',
    // Add more language mappings as needed
  };
  
  return voiceMap[languageCode] || 'en-US-Standard-B';
};

// Generate speech from text
export const generateSpeech = async (text, languageCode = 'en') => {
  try {
    // If TTS is disabled, return null
    if (process.env.TEXT_TO_SPEECH_ENABLED !== 'true') {
      return null;
    }

    // Generate unique filename
    const filename = `${uuidv4()}.mp3`;
    const filepath = path.join(uploadsDir, filename);
    
    // Use Google Text-to-Speech if API key is available
    if (process.env.GOOGLE_CLOUD_API_KEY) {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
        {
          input: { text },
          voice: {
            languageCode: languageCode.substring(0, 2),
            name: getVoiceId(languageCode.substring(0, 2)),
            ssmlGender: 'NEUTRAL'
          },
          audioConfig: { audioEncoding: 'MP3' }
        }
      );
      
      // Decode base64 audio content
      const audioContent = Buffer.from(response.data.audioContent, 'base64');
      
      // Write to file
      fs.writeFileSync(filepath, audioContent);
      
      // Return relative path to audio file
      return `/uploads/audio/${filename}`;
    } 
    // Alternative: Use a simple mock implementation
    else {
      console.log('Using mock TTS implementation (no Google Cloud API key found)');
      
      // Create an empty file to simulate speech generation
      fs.writeFileSync(filepath, 'Mock TTS audio content');
      
      // Return relative path to audio file
      return `/uploads/audio/${filename}`;
    }
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return null;
  }
};

// Convert speech to text (STT)
export const speechToText = async (audioFile, languageCode = 'en-US') => {
  try {
    // If API key is not available, return empty text
    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      console.log('No Google Cloud API key found for speech-to-text');
      return '';
    }
    
    // Read audio file
    const audioContent = fs.readFileSync(audioFile).toString('base64');
    
    // Call Google Speech-to-Text API
    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        config: {
          encoding: 'MP3',
          sampleRateHertz: 16000,
          languageCode
        },
        audio: {
          content: audioContent
        }
      }
    );
    
    // Extract transcription
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].alternatives[0].transcript;
    }
    
    return '';
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return '';
  }
};