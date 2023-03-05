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
  const { currentLocation, locationTable, setLocationTable } =
    useContext(GameStateContext);

  console.log("location", currentLocation);

  const handleExploreLocation = async () => {
    exploreLocation(currentLocation).then((newResources) => {
      console.log("newResources", newResources);
      //this returns [{"name", "count"}] - update the locationTable[currentLocation].resources with the new resources
      newResources.forEach((resource) => {
        const name = resource.name;
        const count = resource.count;
        if (locationTable[currentLocation].resources[name]) {
          locationTable[currentLocation].resources[name] += count;
        } else {
          locationTable[currentLocation].resources[name] = count;
        }
      });
      setLocationTable({ ...locationTable });
    });
  };

  console.log("locationTable[currentLocation]", locationTable[currentLocation]);

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
