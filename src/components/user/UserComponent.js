import { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";

export const UserComponent = () => {
  const { user } = useContext(GameStateContext);
  console.log("user", user);

  return (
    <div>
      <h1>User Component</h1>
    </div>
  );
};
