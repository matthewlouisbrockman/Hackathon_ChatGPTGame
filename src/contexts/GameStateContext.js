import { createContext, useState } from "react";

//game state context
export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [user, setUser] = useState({
    level: 1,
    experience: 0,
    health: 100,
    resources: {},
    tools: {},
    recipes: {},
  });

  const [locationTable, setLocationTable] = useState({
    LovelyWoods: {
      name: "Lovely Woods",
      description: "A light and friendly forest",
      resources: {},
    },
  });

  const [currentLocation, setCurrentLocation] = useState("LovelyWoods");

  const [availableResources, setAvailableResources] = useState({});

  const [messages, setMessages] = useState([]);

  return (
    <GameStateContext.Provider
      value={{
        user,
        setUser,
        availableResources,
        setAvailableResources,
        locationTable,
        setLocationTable,
        currentLocation,
        setCurrentLocation,
        messages,
        setMessages,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
