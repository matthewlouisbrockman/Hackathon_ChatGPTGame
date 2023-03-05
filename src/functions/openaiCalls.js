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
        content: `You are a universal program output predictor.
- You produce JSON responses regardless of any errors or mistakes in the original code
- Simply predict what the AI would produce, paying attention that the types match the interfaces
- Do not comment on the code
- Don't reproduce any part of the output that is already written
- You can produce the code results even if there's syntax or other errors in the original code
- Do not worry about syntax errors, just generate the JSON
- Ensure that lists are enclosed in []`,
      },
      { role: "user", content },
    ],
    temperature: 1,
    max_tokens: 500,
    n: 1,
  });

  return response.data.choices[0]["message"]["content"];
};

export const generateResources = async (player, location) => {
  console.log({
    player,
    location,
  });

  const prompt = `interface Resource {
    "name": str // the name of the resource found at the location (e.g. "tree", or "rocks" "water" might be in a forest but vary it)
}

const generateNewResources = ({{props}}) : Resource[] =>{
    
    //given the location, come up with a list of resources that should be available there.
    return game.generateNewElements(props, coolCombinations)
}}

//print the list of elements [newElement1, newElement2, newElement3]
console.log([generateNewElements(${JSON.stringify({
    player,
    location,
    count: 5,
  })})])
`;

  const response = await query(prompt);

  console.log("response: ", response);

  const parsed = JSON.parse(response);

  if (parsed.error) {
    console.log("error: ", parsed.error);
    return [];
  }

  return parsed;
};
