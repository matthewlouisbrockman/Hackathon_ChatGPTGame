import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const query = async (content) => {
  //using the gpt-3.5-turbo model as text-davinci-003 but faster and cheaper lol. is this defeating the purpose of the hackathon?
  console.log("prompt: ", content);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `- You produce JSON responses regardless of any errors or mistakes in the original code
- Simply predict what the AI would produce, paying attention that the types match the interfaces. You do not comment on the code. You do not output errors.
- Don't reproduce any part of the output that is already written
- You can produce the code results even if there's syntax or other  errors in the original code
- Ensure that lists are enclosed in []
- Do not include results in backticks`,
      },
      { role: "user", content },
    ],
    temperature: 0.7,
    max_tokens: 500,
    n: 1,
  });

  const texts = response.data.choices.map(
    (choice) => choice["message"]["content"]
  );
  return texts;
};

export const exploreLocation = async (player, location) => {
  console.log({
    player,
    location,
  });
  /*  
  Explore the current location and find more resources
  */

  const prompt = `from advancedAI import game //this is an advanced module that can do various AI tasks
  
interface Resource {
    "name": str // the name of the resource found at the location (e.g. "tree", or "rocks" "water" might be in a forest but vary it)
    "count" : int // the number of this resource found at the location
}

interface exploreForResourcesResult {
    "resources": Resource[] //the list of resources found at the location
    "message": str //a message to the user about what they found and some information about it (e.g. you found blah at the blah)
}

const exploreForResources = ({props}) : exploreForResourcesResult =>{
    //given the location, come up with a list of resources that should be available there. Should add more resources that haven't been uncovered there yet either.
    return game.detectNewResources(props)
}}

//print the exploreForResourcesResult
console.log(exploreForResources(${JSON.stringify({
    player,
    location,
    count: 5,
  })}))

  AI:`;

  const responses = await query(prompt);
  console.log("responses", responses);
  const response = responses[0];
  const parsed = JSON.parse(response);

  if (parsed.error) {
    console.log("error: ", parsed.error);
    return [];
  }

  console.log("got resources, returning");
  return parsed;
};

export const attemptToGatherResource = async (player, resource) => {
  const prompt = `from advancedAI import game //this is an advanced module that can do various AI tasks

interface Resource {
  "name": str // the name of the resource gathered (e.g. "wood", or "food")
  "count" : int // the count
}

interface GatherResult {
  "success": bool // whether the player was successful in gathering the resource
  "loot": Resource[] // the resources gathered
  "depletion": int // the amount of the resource that was depleted
  "message": str // a message to display to the user in a story format about what happened involving the depleted resources and tools used. Make the story descriptive.
}

const attemptToGatherResource = ({props}) : GatherResult = >{
  //given the user's skills and tools, determine whether the player can gather the resource given their tools.
  //if they can, return the resource and a success message
  //if they can't, return a failure message 
  
  return game.attemptToGatherResource(props)
}

//print the result
console.log('AI:', attemptToGatherResource(${JSON.stringify({
    player,
    resource,
  })}))
AI:`;
  const responses = await query(prompt);
  console.log("responses", responses);
  const parsed = JSON.parse(responses[0]);

  if (parsed.error) {
    console.log("error: ", parsed.error);
    return [];
  }

  console.log("Resource gathered, returning", parsed);
  return parsed;
};

export const createTool = async (player, tool) => {
  const prompt = `from advancedAI import game //this is an advanced module that can do various AI tasks

interface Resource {
  "name": str // the name of the resource used to create the tool (e.g. "wood", or "rocks")
  "count" : int // the count
}

interface Tool {
  "name": str // the name of the tool (e.g. "axe", or "hammer")
  "count" : int // the count
}

interface CreateToolResult {
  "success": bool // whether the player was successful in creating the tool
  "resourcesUsed": Resource[] // the resources used to create the tool
  "tool": Tool // the tool created
  "message": str // a message to display to the user in a story format about what happened involving the depleted resources and tools used. Make the story descriptive.
}

const createTool = ({props}) : CreateToolResult = >{
  const availableResources = props.player.resources
  const availableTools = props.player.tools

  //given the user's skills and tools, determine whether the player can create the tool given their tools.
  if (game.canCreateTool(props.tool, availableResources, availableTools)){
    //if they can, return the tool and a success message
    return game.createTool(props.tool, availableResources, availableTools)
  } else {
    //if they can't, return a failure message
    return {
      success: false,
      message: "You don't have the resources to create this tool " + game.getMissingResources(props.tool, availableResources, availableTools)
    }
  }
}

//print the result
console.log('AI:', createTool(${JSON.stringify({
    player,
    tool,
  })}))
AI:`;
  const responses = await query(prompt);
  console.log("responses", responses);
  const parsed = JSON.parse(responses[0]);

  if (parsed.error) {
    console.log("error: ", parsed.error);
    return [];
  }

  console.log("Tool created, returning", parsed);
  return parsed;
};

export const discoverTool = async (player) => {
  console.log("player: ", player);
  const prompt = `from advancedAI import game //this is an advanced module that can do various AI tasks

interface Tool {
  "name": str // the name of the tool (e.g. "stone axe", or "steel hammer", but should be variable like "fishing net" or "rope")
  "resources": {[name: str]: int]} // the ingrediants required to create the tool (e.g. stone axe requires 1 stone and 1 wood, so ingrediants would be {"stone": 1, "wood": 1})
  "description": str // a description of the tool and how it can be used
}

interface DiscoverToolResult {
  "process": str //list a few of the users' resources and think about how they could be used to make a tool
  "tool": Tool // the tool discovered
  "success": bool // whether the user has the resources to make the tool
  "message": str // a message to display to the user in a story format about their resources could be used to make a tool (but they haven't made it yet)
}

const discoverToolRecipe = ({props}) : DiscoverToolResult = >{
  // given the user's resources and tools, determine a new tool the user might want to make (it shouldn't be in the user recipes already)
  const availableResources = props.resources
  const existingTools = props.tools
  const existingRecipes = props.recipes

  const thingsToDoWithResrouces = game.getThingsToDoWithResources(availableResources, existingTools, existingRecipes) //just evaluate what the avaialbleResources can be used for and use that to determine what the user might want to make

  return game.discoverToolRecipe(availableResources, availableTools, existingRecipes)
}

//print the result
console.log(discoverToolRecipe(${JSON.stringify({
    resources: player.resources,
    tools: player.tools,
    recipes: player.recipes,
  })}))
AI:`;
  const responses = await query(prompt);
  console.log("responses", responses);
  const parsed = JSON.parse(responses[0]);

  if (parsed.error) {
    console.log("error: ", parsed.error);
    return [];
  }

  console.log("Tool discovered, returning", parsed);
  return parsed;
};

export const discoverTechnology = async (player) => {
  const prompt = `from advancedAI import game //this is an advanced module that can do various AI tasks

interface Technology {
  "name": str // the name of the technology (e.g. "fire", or "fishing")
  "description": str // a description of the technology and how it can be used
}

interface DiscoverTechnologyResult {
  "process": str //list a few of the users' resources and think about how they could be used to make a tool
  "technology": Technology // the technology discovered
  "success": bool // whether the user has the resources to make the tool
  "message": str // a message to display to the user in a story format about their resources could be used to make a tool (but they haven't made it yet)
}

const discoverTechnology = ({props}) : DiscoverTechnologyResult = >{
  // given the user's resources and tools, determine a new technology that will enable the user to develop new tools and recipes
  const availableResources = props.resources
  const existingTools = props.tools
  const existingRecipes = props.recipes
  const existingTechnology = props.technology

  const thingsToDoWithResrouces = game.getThingsToDoWithResources(availableResources, existingTools, existingRecipes) //just evaluate what the avaialbleResources can be used for and use that to determine what the user might want to make

  return game.discoverTechnology(availableResources, availableTools, existingRecipes)
}

//print the result
console.log(discoverTechnology(${JSON.stringify({
    resources: player.resources,
    tools: player.tools,
    recipes: player.recipes,
    technology: player.technologies,
  })}))
AI:`;

  const responses = await query(prompt);
  console.log("responses", responses);
  const parsed = JSON.parse(responses[0]);

  if (parsed.error) {
    console.log("error: ", parsed.error);
    return [];
  }

  console.log("Technology discovered, returning", parsed);
  return parsed;
};

export const createBuildingBlueprint = async (player) => {
  const prompt = `from advancedAI import game //this is an advanced module that can do various AI tasks

interface BuildingBlueprint {
  "name": str // the name of the building (e.g. "house", or "fishing hut")
  "description": str // a description of the building and how it can be used
  "resources": {[name: str]: int]} // the ingrediants required to create the building (e.g. house requires 1 stone and 1 wood, so ingrediants would be {"stone": 1, "wood": 1})
}

interface CreateBuildingBlueprintResult {
  "success": bool // whether the user has the resources to make the building
  "building": BuildingBlueprint // the building blueprint created
  "message": str // a message to display to the user in a story format about what happened involving the depleted resources and tools used. Make the story descriptive.
}

const createBuildingBlueprint = ({props}) : CreateBuildingBlueprintResult = >{
  // given the user's resources and tools, determine whether the user can create a building blueprint
  const availableResources = props.resources
  const availableTools = props.tools
  const existingTechnology = props.technology
  const existingBuildings = props.buildings
  const existingBluePrints = props.blueprints

  const newBuildingBlueprint = game.discoverBuildingBlueprint(availableResources, availableTools, existingTechnology, existingBuildings, existingBluePrints)
}

//print the result
console.log(createBuildingBlueprint(${JSON.stringify({
    resources: player.resources,
    tools: player.tools,
    technologies: player.technologies,
    buildings: player.buildings,
    blueprints: player.blueprints,
  })}))
AI:`;

  const responses = await query(prompt);
  console.log("responses", responses);
  const parsed = JSON.parse(responses[0]);

  if (parsed.error) {
    console.log("error: ", parsed.error);
    return [];
  }

  console.log("Building blueprint created, returning", parsed);
  return parsed;
};
