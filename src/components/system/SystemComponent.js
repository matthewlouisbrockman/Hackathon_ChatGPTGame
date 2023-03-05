import styled from "@emotion/styled";
import { useContext, useRef, useEffect } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";

export const SystemComponent = () => {
  const { messages } = useContext(GameStateContext);

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <DisplayWindow ref={scrollRef}>
      {!messages.length && (
        <p>
          Welcome to Hackathon_ChatGPTGame! Start clicking on stuff to get
          started
        </p>
      )}
      {messages.map((message, index) => {
        return <div key={index}>{message}</div>;
      })}
    </DisplayWindow>
  );
};

const DisplayWindow = styled.div`
  display: flex;
  flex-direction: column;
  height: 70px;
  background: black;
  color: white;
  overflow-y: scroll;
  padding: 5px;
  gap: 10px;
  margin-bottom: 10px;
`;
