// services/languageService.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Detect language from text
export const detectLanguage = async (text) => {
  try {
    // Default to English if no text is provided
    if (!text || text.trim() === '') {
      return 'en';
    }
    
    // Use Google Cloud Translation API if available
    if (process.env.GOOGLE_CLOUD_API_KEY) {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
        {
          q: text.substring(0, 100) // Use only first 100 chars for detection
        }
      );
      
      if (response.data.data && response.data.data.detections && response.data.data.detections.length > 0) {
        return response.data.data.detections[0][0].language;
      }
    }
    
    // Simple language detection fallback
    // This is a very basic implementation that checks for common words in different languages
    const langPatterns = {
      en: /\b(the|is|in|to|and|a|of|for|that|this)\b/i,
      es: /\b(el|la|en|es|de|por|que|un|una|para)\b/i,
      fr: /\b(le|la|les|est|en|et|un|une|pour|dans)\b/i,
      de: /\b(der|die|das|ist|in|und|ein|eine|für|zu)\b/i,
      it: /\b(il|la|è|in|e|un|una|per|che|di)\b/i,
      // Add more language patterns as needed
    };
    
    // Check text against patterns
    for (const [lang, pattern] of Object.entries(langPatterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }
    
    // Default to English if no match
    return 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English on error
  }
};

// Translate text
export const translateText = async (text, targetLanguage = 'en', sourceLanguage = null) => {
  try {
    // Skip translation if text is empty
    if (!text || text.trim() === '') {
      return '';
    }
    
    // If source language is same as target, no need to translate
    if (sourceLanguage === targetLanguage) {
      return text;
    }
    
    // Use Google Cloud Translation API if available
    if (process.env.GOOGLE_CLOUD_API_KEY) {
      const payload = {
        q: text,
        target: targetLanguage
      };
      
      // Add source language if provided
      if (sourceLanguage) {
        payload.source = sourceLanguage;
      }
      
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
        payload
      );
      
      if (response.data.data && response.data.data.translations && response.data.data.translations.length > 0) {
        return response.data.data.translations[0].translatedText;
      }
    }
    
    // Return original text if translation failed or API not available
    console.log('Translation not available (no Google Cloud API key found)');
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
};

// Get supported languages
export const getSupportedLanguages = async () => {
  try {
    // Use Google Cloud Translation API if available
    if (process.env.GOOGLE_CLOUD_API_KEY) {
      const response = await axios.get(
        `https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.GOOGLE_CLOUD_API_KEY}`
      );
      
      if (response.data.data && response.data.data.languages) {
        return response.data.data.languages;
      }
    }
    
    // Return a basic set of languages if API not available
    return [
      { language: 'en', name: 'English' },
      { language: 'es', name: 'Spanish' },
      { language: 'fr', name: 'French' },
      { language: 'de', name: 'German' },
      { language: 'it', name: 'Italian' },
      { language: 'ja', name: 'Japanese' },
      { language: 'ko', name: 'Korean' },
      { language: 'pt', name: 'Portuguese' },
      { language: 'ru', name: 'Russian' },
      { language: 'zh', name: 'Chinese' }
    ];
  } catch (error) {
    console.error('Supported languages error:', error);
    // Return basic languages on error
    return [
      { language: 'en', name: 'English' },
      { language: 'es', name: 'Spanish' },
      { language: 'fr', name: 'French' }
    ];
  }
};