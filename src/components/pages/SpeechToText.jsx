import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faPaperPlane,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// Import the missing files
import {
  setListening,
  addMessage,
  setCurrentText,
  clearCurrentText,
} from "../store/slices/chatSlice";
import { startListening, stopListening } from "../services/speechRecognition";

// Import styled components
import {
  Container,
  Header,
  ProfileIcon,
  RandomCode,
  SettingsIcon,
  MessagesContainer,
  MessageBubble,
  InputContainer,
  MessageInput,
  VoiceButton,
  SendButton,
} from "../styled";

const SpeechToText = () => {
  const dispatch = useDispatch();
  const { messages, isListening, currentText } = useSelector(
    (state) => state.chat
  );
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input change
  const handleInputChange = (e) => {
    dispatch(setCurrentText(e.target.value));
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      dispatch(setListening(false));
    } else {
      startListening(
        (text) => dispatch(setCurrentText(text)),
        () => dispatch(setListening(false))
      );
      dispatch(setListening(true));
    }
  };

  // Send message
  const sendMessage = () => {
    if (currentText.trim()) {
      dispatch(
        addMessage({
          id: Date.now(),
          text: currentText,
          isUser: true,
          timestamp: new Date().toISOString(),
        })
      );

      // Add simulated AI response
      setTimeout(() => {
        dispatch(
          addMessage({
            id: Date.now(),
            text: "This is a simulated response from the AI assistant.",
            isUser: false,
            timestamp: new Date().toISOString(),
          })
        );
      }, 1000);

      dispatch(clearCurrentText());
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Container>
      <Header>
        <ProfileIcon>
          <FontAwesomeIcon icon={faUser} />
        </ProfileIcon>
        <RandomCode>#NX48291</RandomCode>
        <SettingsIcon>
          <FontAwesomeIcon icon={faCog} />
        </SettingsIcon>
      </Header>

      <MessagesContainer>
        {messages.map((message) => (
          <MessageBubble key={message.id} isUser={message.isUser}>
            {message.text}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          type="text"
          placeholder="Type a message..."
          value={currentText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <VoiceButton isListening={isListening} onClick={toggleListening}>
          <FontAwesomeIcon icon={isListening ? faStop : faMicrophone} />
        </VoiceButton>
        <SendButton onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default SpeechToText;
