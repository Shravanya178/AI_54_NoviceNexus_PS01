import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// Import the missing files
import {
  setListening,
  addMessage,
  setSpeaking,
} from "../store/slices/chatSlice";
import { startListening, stopListening } from "../services/speechRecognition";
import { speak, stopSpeaking } from "../services/textToSpeech";

// Import styled components
import {
  Container,
  AvatarContainer,
  ResponseLines,
  ControlButton,
} from "../styled";

const SpeechToSpeech = () => {
  const dispatch = useDispatch();
  const { isListening, isSpeaking } = useSelector((state) => state.chat);
  const [transcript, setTranscript] = useState("");

  // Handle listening state
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      dispatch(setListening(false));

      // Process the transcript
      if (transcript) {
        dispatch(
          addMessage({
            id: Date.now(),
            text: transcript,
            isUser: true,
            timestamp: new Date().toISOString(),
          })
        );

        // Get AI response (simulate for now)
        const aiResponse =
          "This is a simulated response from the AI assistant.";
        handleAIResponse(aiResponse);
      }
    } else {
      startListening(
        (text) => setTranscript(text),
        () => dispatch(setListening(false))
      );
      dispatch(setListening(true));
      setTranscript("");
    }
  };

  // Handle AI response
  const handleAIResponse = (response) => {
    dispatch(
      addMessage({
        id: Date.now(),
        text: response,
        isUser: false,
        timestamp: new Date().toISOString(),
      })
    );

    speak(
      response,
      () => dispatch(setSpeaking(true)),
      () => dispatch(setSpeaking(false))
    );
  };

  return (
    <Container>
      <AvatarContainer>
        <FontAwesomeIcon icon={faArrowLeft} size="2x" color="white" />
      </AvatarContainer>
      <ResponseLines>
        <div />
        <div />
        <div />
      </ResponseLines>
      <ControlButton isActive={isListening} onClick={toggleListening}>
        <FontAwesomeIcon icon={isListening ? faStop : faMicrophone} />
      </ControlButton>
    </Container>
  );
};

export default SpeechToSpeech;
