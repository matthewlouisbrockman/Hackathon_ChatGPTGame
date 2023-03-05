import { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";

export const WorldComponent = () => {
  const { currentLocation, locationTable, setLocationTable } =
    useContext(GameStateContext);

  console.log("locationTable", locationTable);
  console.log("currentLocation", currentLocation);
  console.log("locationTable[currentLocation]", locationTable[currentLocation]);

  return (
    <div>
      <LocationDisplayComponent
        location={currentLocation}
        locationTable={locationTable}
      />
    </div>
  );
};

const LocationDisplayComponent = ({ location, locationTable }) => {
  return (
    <div>
      <p>Location: {location}</p>
      <p>Location Info: {JSON.stringify(locationTable[location])}</p>
    </div>
  );
};
