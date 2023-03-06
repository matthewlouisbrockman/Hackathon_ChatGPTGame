import styled from "@emotion/styled";
import { useContext, useRef, useEffect } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";

export const SystemComponent = () => {
  const { messages, day } = useContext(GameStateContext);

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <AdminSection>
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
      <GameData>
        Day:{" "}
        <div
          style={{
            fontSize: "30px",
          }}
        >
          {day}
        </div>
      </GameData>
    </AdminSection>
  );
};

const AdminSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 110px;
  background: black;
  color: white;
`;

const DisplayWindow = styled.div`
  display: flex;
  flex-direction: column;
  height: 100px;
  width: calc(100% - 100px);
  background: black;
  overflow-y: scroll;
  padding: 5px;
  gap: 10px;
  margin-bottom: 10px;
`;

const GameData = styled.div`
  display: flex;
  flex-direction: column;
  width: 50px;
  text-align: center;
  margin: auto 0;
`;
