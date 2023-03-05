import { createContext, useState } from "react";

//game state context
export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [user, setUser] = useState({
    level: 1,
    experience: 0,
    health: 100,
    resources: {
      food: 0,
      water: 0,
      wood: 0,
    },
    tools: {},
  });

  const [availableLocations, setAvailableLocations] = useState({
    LovelyWoods: {
      name: "Lovely Woods",
      description: "A light and friendly forest",
    },
  });

  const [currentLocation, setCurrentLocation] = useState("LovelyWoods");

  const [availableResources, setAvailableResources] = useState({});

  return (
    <GameStateContext.Provider
      value={{
        user,
        setUser,
        availableResources,
        setAvailableResources,
        availableLocations,
        setAvailableLocations,
        currentLocation,
        setCurrentLocation,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
