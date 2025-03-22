// Speech recognition service

let recognition = null;

// Initialize speech recognition with browser compatibility check
const initSpeechRecognition = () => {
  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    return true;
  } else if ("SpeechRecognition" in window) {
    recognition = new window.SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    return true;
  }
  return false;
};

// Start listening
const startListening = (onResult, onEnd) => {
  if (!recognition && !initSpeechRecognition()) {
    console.error("Speech recognition not supported in this browser");
    return false;
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("");
    onResult(transcript);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return true;
  } catch (error) {
    console.error("Error starting speech recognition:", error);
    return false;
  }
};

// Stop listening
const stopListening = () => {
  if (recognition) {
    recognition.stop();
    return true;
  }
  return false;
};

export { initSpeechRecognition, startListening, stopListening };
