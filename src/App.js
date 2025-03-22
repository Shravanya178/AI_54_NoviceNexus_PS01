import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import SpeechToSpeech from "./components/SpeechToSpeech.js";
import Home from "./components/Home.js";
import Profile from "./components/Profile.js";
import Settings from "./components/Settings.js";
import Sidebar from "./components/Sidebar.js";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // ✅ User state to track logged-in user

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />{" "}
        {/* ✅ Pass setUser */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/speech-to-speech" element={<SpeechToSpeech />} />
        <Route path="/home" element={<Home user={user} />} />{" "}
        {/* ✅ Pass user */}
        <Route path="/profile" element={<Profile user={user} />} />{" "}
        {/* ✅ Pass user */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
