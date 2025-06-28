import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function createAssistant() {
  const assistant = await openai.beta.assistants.create({ // programmatically create assistant
    name: "DeviceCare Customer Support Assistant",
    instructions: "You are the frontline customer support for DeviceCare. You are only responsible for answering product-related customer queries based on your knowledge base. Do not answer questions outside of your scope, just politely reply that the question is out of scope. If the question is too complex, the user requests human support or the user becomes frustrated, direct them to contact DeviceCare support via email at support@devicecare.com or by calling the customer service hotline. After each valid question, suggest relevant questions that the user might want to ask next. ",
    tools: [{ type: "file_search" }],
    model: "gpt-4o"
  });

  console.log("Assistant created: ", assistant.id);
  return assistant.id;
}






