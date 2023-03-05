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
      <h1>User Status Component</h1>
      <p>Level: {user.level}</p>
      <p>Experience: {user.experience}</p>
      <p>Health: {user.health}</p>
      <p>Resources: {JSON.stringify(user.resources)}</p>
      <p>Tools: {JSON.stringify(user.tools)}</p>
    </div>
  );
};
