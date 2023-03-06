import { createContext, useState, useEffect } from "react";

//game state context
export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [day, setDay] = useState(1);
  const [gameWon, setGameWon] = useState(false);

  const [user, setUser] = useState({
    resources: {},
    tools: {},
    recipes: {},
    technologies: {},
    buildings: {},
    blueprints: {},
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

  //every 10 seconds increment the day
  useEffect(() => {
    const interval = setInterval(() => {
      setDay((prevState) => {
        return prevState + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        day,
        setDay,
        gameWon,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
