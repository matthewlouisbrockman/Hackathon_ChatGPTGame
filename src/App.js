import styled from "@emotion/styled";
import { UserComponent } from "./components/user/UserComponent";
import { WorldComponent } from "./components/world/WorldComponent";
import { SystemComponent } from "./components/system/SystemComponent";
import { GameStateContext } from "./contexts/GameStateContext";
import { useContext } from "react";
import { Victory } from "./components/system/Victory";
function App() {
  const { gameWon } = useContext(GameStateContext);

  if (gameWon) {
    return (
      <MainPage>
        <Victory />
      </MainPage>
    );
  }

  return (
    <MainPage>
      <SystemComponent />

      <GameDisplayRow>
        <GameDisplayPanel>
          <UserComponent />
        </GameDisplayPanel>
        <GameDisplayPanel>
          <WorldComponent />
        </GameDisplayPanel>
      </GameDisplayRow>
    </MainPage>
  );
}

export default App;

const MainPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  //tan background
  background-color: #f5f5dc;
  height: calc(100vh - 10px);
  width: calc(100vw - 10px);
  overflow: hidden;
`;

const GameDisplayRow = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(100% - 30px);
  height: calc(100% - 130px);
  gap: 5px;
`;

const GameDisplayPanel = styled.div`
  //this should take up half the width of the parent, which is the GameDisplayRow
  padding: 5px;
  height: 100%;
  width: 50%;
  //brown border shading
  border: 1px solid #8b4513;
`;
