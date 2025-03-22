import React, { useState } from "react";
import { FiMic, FiVolume2 } from "react-icons/fi";
import "../styles/sts.css";

const SpeechToSpeech = () => {
  const [messages, setMessages] = useState([]); // Store user and bot messages
  const [isRecording, setIsRecording] = useState(false);
  const [waveActive, setWaveActive] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume: 100%

  const handleMicClick = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    setIsRecording(true);
    setWaveActive(true);

    recognition.onresult = (event) => {
      const userText = event.results[0][0].transcript;
      setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
      handleBotResponse(userText);
      setIsRecording(false);
      setWaveActive(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setWaveActive(false);
    };
  };

  const handleBotResponse = (userMessage) => {
    // Simple bot response logic
    const botResponse = `I heard: "${userMessage}". How can I assist you?`;

    setMessages((prev) => [
      ...prev,
      { text: userMessage, sender: "user" },
      { text: botResponse, sender: "bot" },
    ]);

    const utterance = new SpeechSynthesisUtterance(botResponse);
    utterance.lang = "en-US";
    utterance.volume = volume; // Set volume based on user control
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="speech-container">
      {/* Volume Control */}
      <div className="volume-control">
        <FiVolume2 size={24} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>

      <div className="speech-header"> NexusAI</div>

      <div className="speech-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`speech-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="mic-container">
        <button
          className="speech-btn"
          onClick={handleMicClick}
          disabled={isRecording}
        >
          {waveActive && <div className="wave-animation"></div>}
          <FiMic size={80} />
        </button>
      </div>
    </div>
  );
};

export default SpeechToSpeech;
