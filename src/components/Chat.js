import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../store/slices/chatSlice";
import axios from "axios";
import { FiMic, FiSend } from "react-icons/fi";
import "../styles/Chat.css";

const Chat = () => {
  const [input, setInput] = useState("");
  const [selectedLang, setSelectedLang] = useState("en-US"); // Default: English
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();

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

  const handleMicClick = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = selectedLang; // Use selected language
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // Set input field with recognized text
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Hi There!</div>

      {/* Language Selection Dropdown */}

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <button className="mic-btn" onClick={handleMicClick}>
          <FiMic size={20} />
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
          <option value="ja-JP">Japanase</option>
          <option value="mr-IN">Marathi</option>
        </select>
      </div>
    </div>
  );
};

export default Chat;
