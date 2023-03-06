import { createContext, useState, useEffect } from "react";

//game state context
export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [day, setDay] = useState(1);
  const [gameWon, setGameWon] = useState(false);

  const [user, setUser] = useState({
    resources: {},
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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateResourcesFromBuildings();
  }, [day]);

  const updateResourcesFromBuildings = () => {
    console.log("updating resources from buildings");
    const buildings = user.buildings;
    const blueprints = user.blueprints;
    const currentResources = user.resources;
    console.log("currentResources: ", currentResources);

    for (const building in buildings) {
      console.log("building: ", building);
      const countModifier = buildings[building].count;
      const dailyResrouces = blueprints[building].dailyResources;
      for (const resource in dailyResrouces) {
        const resourceAmount = dailyResrouces[resource] || 0;
        currentResources[resource] =
          (currentResources[resource] || 0) + resourceAmount * countModifier;
      }
    }
    setUser((prevState) => {
      return {
        ...prevState,
        resources: currentResources,
      };
    });
  };

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
        setGameWon,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
