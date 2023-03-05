import styled from "@emotion/styled";
import { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";
import {
  exploreLocation,
  attemptToGatherResource,
} from "../../functions/openaiCalls";

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
  const { currentLocation, locationTable, setLocationTable, setUser } =
    useContext(GameStateContext);

  console.log("location", currentLocation);

  const handleExploreLocation = async () => {
    exploreLocation(currentLocation).then((res) => {
      console.log("res", res);
      //this returns [{"name", "count"}] - update the locationTable[currentLocation].resources with the new resources
      const newResources = res.resources;
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

  const handleGather = (resource) => {
    //gather the resource
    //update the locationTable
    const newLocationTable = { ...locationTable };
    if (newLocationTable[currentLocation].resources[resource]) {
      newLocationTable[currentLocation].resources[resource] -= 1;
    }
    //add to the user's resources
    console.log("handling gather");
    setUser((prevState) => {
      const previousResourceCount = prevState.resources[resource] || 0;
      const newUser = {
        ...prevState,
        resources: {
          ...prevState.resources,
          [resource]: previousResourceCount + 1,
        },
      };

      return newUser;
    });
  };

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
          (resource, idx) => {
            return (
              <div key={idx}>
                {" "}
                <button
                  onClick={() => {
                    attemptToGatherResource(resource);
                  }}
                >
                  Gather
                </button>
                {"  "}
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
