import styled from "@emotion/styled";

import { useContext, useState } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";

import {
  discoverTool,
  discoverTechnology,
  createBuildingBlueprint,
} from "../../functions/openaiCalls";

export const UserComponent = () => {
  const { user } = useContext(GameStateContext);

  return (
    <div>
      <UserStatusComponent user={user} />
    </div>
  );
};

const UserStatusComponent = ({ user }) => {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "max-height": "calc(100vh - 140px)",
        "overflow-y": "scroll",
      }}
    >
      <p>Your Stats</p>
      <p>Resources: {JSON.stringify(user.resources)}</p>

      {!!Object.keys(user.resources || {})?.length && <RecipeDisplay />}
      {!!Object.keys(user.recipes || {})?.length && <BluePrintsDisplay />}
      {!!Object.keys(user.buildings || {})?.length && <BuildingsDisplay />}
      <div></div>
    </div>
  );
};

const RecipeDisplay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, setMessages, setGameWon } = useContext(GameStateContext);
  const recipes = user.recipes;
  const handleDiscoverTool = (name) => {
    discoverTool(user, name).then((res) => {
      const newRecipe = res.tool;
      const newMessage = res.message;
      if (newMessage) {
        setMessages((prevState) => {
          return [...prevState, newMessage];
        });
      }
      if (newRecipe) {
        user.recipes[newRecipe.name] = {
          resources: newRecipe.resources,
          description: newRecipe.description,
        };
      }
    });
  };

  const handleCreateTool = (recipe) => {
    //create the tool

    //check if the user has the resources
    const recipeResources = recipes[recipe].resources;
    const userResources = user.resources;
    let hasResources = true;

    Object.keys(recipeResources).forEach((resource) => {
      if ((userResources[resource] || 0) < recipeResources[resource]) {
        hasResources = false;
      }
    });
    if (hasResources) {
      //subtract the resources
      Object.keys(recipeResources).forEach((resource) => {
        user.resources[resource] -= recipeResources[resource];
      });
      //add the tool to resources

      user.resources[recipe] = (user.resources[recipe] || 0) + 1;

      if (recipe === "paperclip") {
        setGameWon(true);
      }
      setMessages((prevState) => {
        return [...prevState, `You have created a ${recipe}`];
      });
    } else {
      setMessages((prevState) => {
        return [
          ...prevState,
          "You do not have the resources to make this tool",
        ];
      });
    }
  };

  const [newToolName, setNewToolName] = useState("");

  //recipe is {[name]: count]}
  return (
    <div>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        style={{ cursor: "pointer" }}
      >
        Tool Recipes
        {isOpen ? " [-]" : " [+]"}
      </div>
      {isOpen && (
        <>
          {Object.keys(recipes).length === 0 && <p>No Recipes</p>}
          {Object.keys(recipes).map((recipe) => {
            return (
              <RecipeRow>
                <button
                  onClick={() => {
                    handleCreateTool(recipe);
                  }}
                >
                  Create
                </button>
                <div>{recipe}:</div>
                {Object.keys(recipes[recipe]?.resources || {}).map(
                  (ingredient) => {
                    return (
                      <RecipeIngredient>
                        <div>{ingredient}: </div>
                        <div>{recipes[recipe].resources[ingredient]}</div>
                      </RecipeIngredient>
                    );
                  }
                )}
              </RecipeRow>
            );
          })}
          <button
            onClick={() => {
              handleDiscoverTool(newToolName);
            }}
          >
            Discover New Recipes
            <input
              value={newToolName}
              onChange={(e) => {
                setNewToolName(e.target.value);
              }}
            ></input>
          </button>
        </>
      )}
    </div>
  );
};

const RecipeRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const RecipeIngredient = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const BluePrintsDisplay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, setUser, setMessages, day } = useContext(GameStateContext);

  const blueprints = user.blueprints;

  const handleDiscoverNewBuilding = () => {
    createBuildingBlueprint(user).then((res) => {
      const newBluePrint = res.blueprint;
      const newMessage = res.message;
      if (newMessage) {
        setMessages((prevState) => {
          return [...prevState, newMessage];
        });
      }
      if (newBluePrint) {
        user.blueprints[newBluePrint.name] = {
          description: newBluePrint.description,
          resources: newBluePrint.resources,
          dailyResources: newBluePrint.dailyResources,
        };
        setUser({ ...user });
      }
    });
  };

  const handleCreateBuilding = (blueprint) => {
    //check the resources against hte user
    const blueprintResources = blueprints[blueprint].resources;
    const userResources = user.resources;
    let hasResources = true;

    Object.keys(blueprintResources).forEach((resource) => {
      if ((userResources[resource] || 0) < blueprintResources[resource]) {
        hasResources = false;
      }
    });
    if (hasResources) {
      //subtract the resources
      Object.keys(blueprintResources).forEach((resource) => {
        user.resources[resource] -= blueprintResources[resource];
      });
      //add the building
      user.buildings[blueprint] = {
        description: blueprints[blueprint].description,
        count: user.buildings[blueprint]?.count + 1 || 1,
      };
      setMessages((prevState) => {
        return [...prevState, `You have created a ${blueprint}`];
      });
    } else {
      setMessages((prevState) => {
        return [
          ...prevState,
          "You do not have the resources to make this building",
        ];
      });
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        style={{ cursor: "pointer" }}
      >
        Buildings
        {isOpen ? " [-]" : " [+]"}
      </div>
      {isOpen && (
        <>
          {Object.keys(blueprints || {}).length === 0 && <p>No blueprints</p>}
          {Object.keys(blueprints || {}).map((blueprint) => {
            return (
              <RecipeOutline>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => {
                      handleCreateBuilding(blueprint);
                    }}
                  >
                    Create
                  </button>
                  <div>{blueprint}:</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
                  <div>Requires: </div>
                  {Object.keys(blueprints[blueprint]?.resources || {}).map(
                    (ingredient, idx) => {
                      return (
                        <RecipeIngredient key={idx}>
                          <div>{ingredient}: </div>
                          <div>
                            {blueprints[blueprint].resources[ingredient]}
                          </div>
                        </RecipeIngredient>
                      );
                    }
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
                  <div>Produces: </div>
                  {Object.keys(blueprints[blueprint]?.dailyResources || {}).map(
                    (ingredient, idx) => {
                      return (
                        <RecipeIngredient key={idx}>
                          <div>{ingredient}: </div>
                          <div>
                            {blueprints[blueprint].dailyResources[ingredient]}
                          </div>
                        </RecipeIngredient>
                      );
                    }
                  )}
                </div>
              </RecipeOutline>
            );
          })}
          {day > 10 && (
            <button onClick={handleDiscoverNewBuilding}>
              Discover New Blueprint
            </button>
          )}
        </>
      )}
    </div>
  );
};

const RecipeOutline = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 5px;
`;

const BuildingsDisplay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useContext(GameStateContext);

  const buildings = user.buildings;
  const bluePrints = user.blueprints;

  return (
    <div style={{ marginTop: "10px" }}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        style={{ cursor: "pointer" }}
      >
        Buildings
        {isOpen ? " [-]" : " [+]"}
      </div>
      {isOpen && (
        <>
          {Object.keys(buildings || {}).length === 0 && <p>No buildings</p>}
          {Object.keys(buildings || {}).map((building) => {
            return (
              <div>
                <div>
                  {building} ({buildings[building].count}):
                </div>
                <div>{buildings[building].description}</div>
                <div>Daily Gain: </div>
                {Object.keys(bluePrints[building]?.dailyResources || {}).map(
                  (ingredient, idx) => {
                    return (
                      <div key={idx}>
                        {ingredient}:{" "}
                        {bluePrints[building].dailyResources[ingredient] *
                          buildings[building].count}
                      </div>
                    );
                  }
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
