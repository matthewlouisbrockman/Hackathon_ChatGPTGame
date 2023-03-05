import styled from "@emotion/styled";
import { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";
import { exploreLocation } from "../../functions/openaiCalls";

export const WorldComponent = () => {
  return (
    <WorldComponentContainer>
      <LocationDisplayComponent />
    </WorldComponentContainer>
  );
};

const WorldComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

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
    <LocationDisplayComponentWindow>
      <div>
        Location:
        {locationTable[currentLocation]?.name}
      </div>
      <div>
        Description
        {locationTable[currentLocation]?.description}
      </div>
      <div>
        Resources:
        {Object.keys(locationTable[currentLocation]?.resources).map(
          (resource) => {
            return (
              <div>
                {resource}: {locationTable[currentLocation].resources[resource]}
              </div>
            );
          }
        )}
      </div>

      <button
        onClick={() => {
          handleExploreLocation();
        }}
      >
        Explore
      </button>
    </LocationDisplayComponentWindow>
  );
};

const LocationDisplayComponentWindow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  overflow-y: scroll;
  overlay-x: hidden;
  //wrap the text
`;
