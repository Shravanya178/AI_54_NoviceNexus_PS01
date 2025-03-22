import styled from "styled-components";

// MainScreen components
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f9fc;
  padding: 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e1e4e8;
  margin-bottom: 20px;
`;

export const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3a86ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

export const SettingsIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const InteractionOptions = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;

export const Option = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  border-radius: 12px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e9ecef;
  }
`;

export const OptionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4dabf7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: white;
  font-size: 24px;
`;

export const OptionText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

export const ChatHistorySection = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #343a40;
  font-size: 18px;
`;

export const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const HistoryItem = styled.li`
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

// SpeechToSpeech components
export const AvatarContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #4dabf7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const ResponseLines = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;

  div {
    width: 60px;
    height: 3px;
    background-color: #adb5bd;
    margin: 3px 0;
    border-radius: 5px;
  }
`;

export const ControlButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${(props) => (props.isActive ? "#fa5252" : "#4dabf7")};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  margin: 0 auto;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// SpeechToText components
export const RandomCode = styled.div`
  font-family: monospace;
  font-size: 12px;
  color: #868e96;
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background-color: ${(props) => (props.isUser ? "#4dabf7" : "#f1f3f5")};
  color: ${(props) => (props.isUser ? "white" : "#343a40")};
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e9ecef;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ced4da;
  border-radius: 24px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #4dabf7;
  }
`;

export const VoiceButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${(props) => (props.isListening ? "#fa5252" : "#f1f3f5")};
  color: ${(props) => (props.isListening ? "white" : "#495057")};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.isListening ? "#fa5252" : "#e9ecef")};
  }
`;

export const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #4dabf7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3b8de3;
  }
`;
