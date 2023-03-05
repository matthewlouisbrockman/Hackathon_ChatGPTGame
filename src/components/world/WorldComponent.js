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
  const {
    currentLocation,
    locationTable,
    setLocationTable,
    setUser,
    setMessages,
  } = useContext(GameStateContext);

  console.log("location", currentLocation);

  const handleExploreLocation = async () => {
    exploreLocation(currentLocation).then((res) => {
      console.log("res", res);
      //this returns [{"name", "count"}] - update the locationTable[currentLocation].resources with the new resources
      const newResources = res.resources;
      const newMessage = res.message;
      if (newMessage) {
        setMessages((prevState) => {
          return [...prevState, newMessage];
        });
      }
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

  const addResourceToUser = (loot) => {
    //take an array of loot [{name, count}] and update the user's resources
    loot.forEach((resource) => {
      const name = resource.name;
      const count = resource.count;
      setUser((prevState) => {
        const previousResourceCount = prevState.resources[name] || 0;
        const newUser = {
          ...prevState,
          resources: {
            ...prevState.resources,
            [name]: previousResourceCount + count,
          },
        };

        return newUser;
      });
    });
  };

  const handleAttemptToGatherResource = (resource) => {
    attemptToGatherResource(resource).then((res) => {
      console.log("res", res);
      const newMessage = res.message;
      if (newMessage) {
        setMessages((prevState) => {
          return [...prevState, newMessage];
        });
      }
      if (res.success) {
        console.log("wooo");
        addResourceToUser(res.loot);
        //remove the count of deployed resources from the location
        const newLocationTable = { ...locationTable };
        if (newLocationTable[currentLocation].resources[resource]) {
          //no less than 0 though
          newLocationTable[currentLocation].resources[resource] = Math.max(
            0,
            newLocationTable[currentLocation].resources[resource] -
              (res.depletion || 0)
          );
        }
      }
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
                    handleAttemptToGatherResource(resource);
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
