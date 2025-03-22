import { useState } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [speechToText, setSpeechToText] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);

  return (
    <div className={`settings-container ${darkMode ? "dark" : ""}`}>
      <h1>Settings</h1>

      {/* ✅ Speech & Voice Settings */}
      <div className="setting-option">
        <label>Speech-to-Text</label>
        <div
          className={`toggle-switch ${speechToText ? "active" : ""}`}
          onClick={() => setSpeechToText(!speechToText)}
        >
          <div className="toggle-knob"></div>
        </div>
      </div>

      <div className="setting-option">
        <label>Text-to-Speech</label>
        <div
          className={`toggle-switch ${textToSpeech ? "active" : ""}`}
          onClick={() => setTextToSpeech(!textToSpeech)}
        >
          <div className="toggle-knob"></div>
        </div>
      </div>

      <div className="setting-option">
        <label>Dark Mode</label>
        <div
          className={`toggle-switch ${darkMode ? "active" : ""}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <div className="toggle-knob"></div>
        </div>
      </div>

      {/* ✅ Privacy Section */}
      <div className="section">
        <h3>Privacy Policy</h3>
        <p>
          Your data is protected and stored securely. We comply with industry
          standards for data privacy.
        </p>
        <a
          href="https://firebase.google.com/support/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Firebase Privacy Policy
        </a>
      </div>

      {/* ✅ Security Section */}
      <div className="section">
        <h3>Security</h3>
        <p>
          We use industry-standard security measures to protect your data.
          Always enable two-factor authentication for better security.
        </p>
        <a
          href="https://cloud.google.com/security"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Cloud Security
        </a>
      </div>

      {/* ✅ Terms & Conditions */}
      <div className="section">
        <h3>Terms & Conditions</h3>
        <p>
          By using this app, you agree to our terms, including data collection
          policies and responsible usage.
        </p>
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Terms of Service
        </a>
      </div>
    </div>
  );
};

export default Settings;
