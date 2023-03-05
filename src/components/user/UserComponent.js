import { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";

export const UserComponent = () => {
  const { user } = useContext(GameStateContext);
  console.log("user", user);

  return (
    <div>
      <UserStatusComponent user={user} />
    </div>
  );
};

const UserStatusComponent = ({ user }) => {
  return (
    <div>
      <p>Your Stats</p>
      <p>Resources: {JSON.stringify(user.resources)}</p>
      <p>Tools: {JSON.stringify(user.tools)}</p>
      <div>
        Recipes
        <div></div>
      </div>
      <div>
        <button>Discover New Tools</button>
      </div>
    </div>
  );
};
