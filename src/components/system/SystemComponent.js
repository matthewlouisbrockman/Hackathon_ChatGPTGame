import styled from "@emotion/styled";
import { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";

export const SystemComponent = () => {
  const { messages } = useContext(GameStateContext);

  return (
    <DisplayWindow>
      {!messages.length && (
        <p>
          Welcome to Hackathon_ChatGPTGame! Start clicking on stuff to get
          started
        </p>
      )}
      {messages.map((message, index) => {
        return <p key={index}>{message}</p>;
      })}
    </DisplayWindow>
  );
};

const DisplayWindow = styled.div`
  display: flex;
  flex-direction: column;
  height: 80px;
  backgroundcolor: white;
  color: black;
`;
