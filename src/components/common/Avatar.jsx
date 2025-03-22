import React from "react";
import styled from "styled-components";

const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e1e1e1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.isAnimating &&
    `
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.3);
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 0.3; }
      50% { opacity: 0.8; }
      100% { opacity: 0.3; }
    }
  `}
`;

const AvatarIcon = styled.div`
  font-size: 48px;
`;

const Avatar = ({ isAnimating }) => {
  return (
    <AvatarContainer isAnimating={isAnimating}>
      <AvatarIcon>🎤</AvatarIcon>
    </AvatarContainer>
  );
};

export default Avatar;
