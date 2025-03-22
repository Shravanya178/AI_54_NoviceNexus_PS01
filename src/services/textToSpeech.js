// Text-to-speech service

let speechSynthesis = window.speechSynthesis;
let utterance = null;

// Initialize TTS
const initTextToSpeech = () => {
  if (!speechSynthesis) {
    console.error("Speech synthesis not supported in this browser");
    return false;
  }
  return true;
};

// Speak text
const speak = (text, onStart, onEnd) => {
  if (!speechSynthesis && !initTextToSpeech()) {
    return false;
  }

  // Cancel any ongoing speech
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  utterance = new SpeechSynthesisUtterance(text);

  // Set voice (optional - can use default)
  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    // You can select a specific voice if needed
    // utterance.voice = voices[0];
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  speechSynthesis.speak(utterance);
  return true;
};

// Stop speaking
const stopSpeaking = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
    return true;
  }
  return false;
};

// Check if currently speaking
const isSpeaking = () => {
  return speechSynthesis ? speechSynthesis.speaking : false;
};

export { initTextToSpeech, speak, stopSpeaking, isSpeaking };
