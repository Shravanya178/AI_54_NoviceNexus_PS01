import { useState } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`settings-container ${darkMode ? "dark" : ""}`}>
      <h2>Settings</h2>
      <div className="setting-option">
        <label>Enable Speech-to-Text</label>
        <input type="checkbox" />
      </div>
      <div className="setting-option">
        <label>Enable Text-to-Speech</label>
        <input type="checkbox" />
      </div>
      <div className="setting-option">
        <label>Dark Mode</label>
        <input type="checkbox" onChange={() => setDarkMode(!darkMode)} />
      </div>
    </div>
  );
};

export default Settings;
