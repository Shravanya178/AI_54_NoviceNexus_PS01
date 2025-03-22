import "../styles/ChatHistory.css";

const ChatHistory = () => {
  const chatData = [
    { text: "Hello!", time: "10:00 AM" },
    { text: "How are you?", time: "10:05 AM" },
  ];

  return (
    <div className="chat-history">
      <h3>Chat History</h3>
      {chatData.map((msg, index) => (
        <div key={index} className="chat-message">
          <span className="chat-time">{msg.time}</span> - {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
