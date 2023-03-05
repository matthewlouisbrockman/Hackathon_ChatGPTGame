import styled from "@emotion/styled";

import { useContext, useState } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";

import { discoverTool } from "../../functions/openaiCalls";

export const UserComponent = () => {
  const { user } = useContext(GameStateContext);
  console.log("user", user);

  return (
    <div>
      <UserStatusComponent user={user} />
    </div>
  );
};

const UserStatusComponent = ({ user }) => {
  return (
    <div>
      <p>Your Stats</p>
      <p>Resources: {JSON.stringify(user.resources)}</p>
      <p>Tools: {JSON.stringify(user.tools)}</p>
      <div>
        <RecipeDisplay />
      </div>
      <div></div>
    </div>
  );
};

const RecipeDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setMessages } = useContext(GameStateContext);
  const recipes = user.recipes;
  const handleDiscoverTool = () => {
    discoverTool(user).then((res) => {
      console.log("res", res);
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
    console.log("making tool", recipe);
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
      //add the tool
      user.tools[recipe] = recipes[recipe].description;
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

  //recipe is {[name]: count]}
  return (
    <div>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        style={{ cursor: "pointer" }}
      >
        Recipes
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
              handleDiscoverTool();
            }}
          >
            Discover New Recipes
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
