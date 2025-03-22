import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../store/slices/chatSlice.js";
import axios from "axios";
import { FiMic, FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../styles/Chat.css";

const Chat = () => {
  const [input, setInput] = useState("");
  const [selectedLang, setSelectedLang] = useState("en-US");
  const [isListening, setIsListening] = useState(false);
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let recognition = null;

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
    }
  }, [selectedLang]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    dispatch(addMessage({ text: input, sender: "user" }));

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        query: input,
      });
      dispatch(addMessage({ text: response.data.answer, sender: "bot" }));
    } catch (error) {
      dispatch(addMessage({ text: "Error connecting to AI", sender: "bot" }));
    }

    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Hi There!</div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Language Selection Dropdown */}
      <div className="lang-container">
        <select
          className="lang-select"
          onChange={(e) => setSelectedLang(e.target.value)}
          value={selectedLang}
        >
          <option value="en-US">English</option>
          <option value="hi-IN">Hindi</option>
          <option value="es-ES">Spanish</option>
          <option value="ko-KR">Korean</option>
          <option value="fr-FR">French</option>
          <option value="zh-CN">Chinese</option>
          <option value="ja-JP">Japanese</option>
          <option value="mr-IN">Marathi</option>
        </select>
      </div>

      {/* Input and Buttons */}
      <div className="chat-input-container">
        <button className="mic-btn" onClick={startListening}>
          <FiMic size={20} color={isListening ? "red" : "black"} />
        </button>
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="send-btn" onClick={sendMessage}>
          <FiSend size={20} />
        </button>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => navigate("/speech-to-speech")}
        className="floating-button"
      >
        <FiMic size={20} style={{ marginRight: "8px" }} />
        Talk to NexusAI!
      </button>
    </div>
  );
};

export default Chat;
