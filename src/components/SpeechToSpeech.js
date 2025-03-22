import { useState } from "react";
import { useSelector } from "react-redux";

const SpeechToSpeech = () => {
  const messages = useSelector((state) => state.chat.messages);
  const [speaking, setSpeaking] = useState(false);

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <button
        disabled={speaking}
        onClick={() =>
          speakText(messages[messages.length - 1]?.text || "No message")
        }
      >
        Speak Last Message
      </button>
    </div>
  );
};

export default SpeechToSpeech;
