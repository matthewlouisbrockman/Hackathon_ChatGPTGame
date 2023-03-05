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

const exploreForResources = ({props}) : Resource[] =>{
    //given the location, come up with a list of resources that should be available there. Should add more resources that haven't been uncovered there yet either.
    return game.detectNewResources(props)
}}

//print the list of resources
console.log('AI:', exploreForResources(${JSON.stringify({
    player,
    location,
    count: 5,
  })}))

  AI: [`;

  const responses = await query(prompt);
  const response = "[" + responses[0];

  console.log("response: ", response);

  const parsed = JSON.parse(response);

  if (parsed.error) {
    console.log("error: ", parsed.error);
    return [];
  }

  return parsed;
};
