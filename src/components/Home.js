import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiMenu,
  FiSettings,
  FiMessageCircle,
  FiMic,
  FiX,
} from "react-icons/fi";
import "../styles/Home.css";

const Home = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Chat history (Only user messages)
  const messages = useSelector((state) => state.chat.messages).filter(
    (msg) => msg.sender === "user"
  );

  return (
    <div className="home-container">
      {/* ✅ Top Bar */}
      <div className="top-bar">
        {/* ☰ Menu Icon */}
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          <FiMenu size={28} />
        </button>

        {/* Welcome Text */}
        <h1 className="welcome-text">Welcome, {user ? user.name : "User"}!</h1>

        {/* ⚙ Settings Icon */}
        <button className="settings-btn" onClick={() => navigate("/settings")}>
          <FiSettings size={28} />
        </button>
      </div>

      {/* ✅ Sidebar (Opens when ☰ is clicked) */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          <FiX size={32} />
        </button>
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={() => navigate("/chat")}>Chat</button>
        <button onClick={() => navigate("/speech-to-speech")}>
          Talk to AI
        </button>
        <button onClick={() => navigate("/settings")}>Settings</button>
        <button onClick={() => navigate("/")}>Sign Out</button>
      </div>

      {/* ✅ Main Section */}
      <div className="main-options">
        <button className="big-btn chat-btn" onClick={() => navigate("/chat")}>
          <FiMessageCircle size={40} />
          <span>Chat</span>
        </button>
        <button
          className="big-btn talk-btn"
          onClick={() => navigate("/speech-to-speech")}
        >
          <FiMic size={40} />
          <span>Talk to AI</span>
        </button>
      </div>

      {/* ✅ Chat History (Centered in the middle) */}
      <div className="chat-history">
        <h3>Chat History</h3>
        {messages.length === 0 ? (
          <p>No previous chats</p>
        ) : (
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <span className="history-time">
                  {new Date().toLocaleTimeString()}
                </span>
                {" " + msg.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
