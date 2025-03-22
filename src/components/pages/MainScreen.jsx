import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faKeyboard,
  faHistory,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// Import styled components
import {
  Container,
  Header,
  ProfileIcon,
  SettingsIcon,
  InteractionOptions,
  Option,
  OptionIcon,
  OptionText,
  ChatHistorySection,
  SectionTitle,
  HistoryList,
  HistoryItem,
} from "../styled";

const MainScreen = () => {
  return (
    <Container>
      <Header>
        <ProfileIcon>
          <FontAwesomeIcon icon={faUser} />
        </ProfileIcon>
        <SettingsIcon>
          <FontAwesomeIcon icon={faCog} />
        </SettingsIcon>
      </Header>

      <InteractionOptions>
        <Link
          to="/speech-to-speech"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Option>
            <OptionIcon>
              <FontAwesomeIcon icon={faMicrophone} />
            </OptionIcon>
            <OptionText>Speech to Speech</OptionText>
          </Option>
        </Link>

        <Link
          to="/speech-to-text"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Option>
            <OptionIcon>
              <FontAwesomeIcon icon={faKeyboard} />
            </OptionIcon>
            <OptionText>Speech to Text</OptionText>
          </Option>
        </Link>
      </InteractionOptions>

      <ChatHistorySection>
        <SectionTitle>Recent Conversations</SectionTitle>
        <HistoryList>
          {/* Example history items */}
          <HistoryItem>
            Conversation about project timeline - 2 hours ago
          </HistoryItem>
          <HistoryItem>Questions about React hooks - Yesterday</HistoryItem>
          <HistoryItem>Planning for the team meeting - 2 days ago</HistoryItem>
        </HistoryList>
      </ChatHistorySection>
    </Container>
  );
};

export default MainScreen;
