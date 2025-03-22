import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../store/slices/chatSlice";
import axios from "axios";

const Chat = () => {
  const [input, setInput] = useState("");
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();

  const sendMessage = async () => {
    if (!input.trim()) return;

    dispatch(addMessage({ text: input, sender: "user" }));

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        query: input,
      });

      // Check if the response is valid before dispatching
      if (response.data && response.data.answer) {
        dispatch(addMessage({ text: response.data.answer, sender: "bot" }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput(""); // Clear input after sending
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "20px auto", textAlign: "center" }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          minHeight: "200px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              color: msg.sender === "user" ? "blue" : "green",
              padding: "5px",
              margin: "5px 0",
              background: msg.sender === "user" ? "#e6f2ff" : "#e6ffe6",
              borderRadius: "5px",
            }}
          >
            {msg.text}
          </p>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "5px", width: "70%" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "5px 10px", marginLeft: "5px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
