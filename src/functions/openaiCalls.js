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
  "message": str // a message to display to the user based on if they were successful or not with information on why they were successful or not
}

const attemptToGatherResource = ({props}) : GatherResult = >{
  //given the user's skills and tools, determine whether the player can gather the resource.
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
