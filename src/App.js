import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";
import SpeechToText from "./components/SpeechToText";
import SpeechToSpeech from "./components/SpeechToSpeech";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/speech-to-text" element={<SpeechToText />} />
        <Route path="/speech-to-speech" element={<SpeechToSpeech />} />
      </Routes>
    </Router>
  );
}

export default App;
