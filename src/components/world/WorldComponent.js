import { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";
import { exploreLocation } from "../../functions/openaiCalls";

export const WorldComponent = () => {
  return (
    <div>
      <LocationDisplayComponent />
    </div>
  );
};

const LocationDisplayComponent = () => {
  const { currentLocation, locationTable } = useContext(GameStateContext);

  console.log("location", currentLocation);

  const handleExploreLocation = () => {
    exploreLocation(currentLocation);
  };

  return (
    <div>
      <p>Location: {currentLocation}</p>
      <p>Location Info: {JSON.stringify(locationTable[currentLocation])}</p>
      <button
        onClick={() => {
          handleExploreLocation();
        }}
      >
        Explore
      </button>
    </div>
  );
};
