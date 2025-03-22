import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

// Import pages
import Login from "./components/pages/Login";
import MainScreen from "./components/pages/MainScreen";
import SpeechToSpeech from "./components/pages/SpeechToSpeech";
import SpeechToText from "./components/pages/SpeechToText";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainScreen />} />
          <Route path="/speech-to-speech" element={<SpeechToSpeech />} />
          <Route path="/speech-to-text" element={<SpeechToText />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
