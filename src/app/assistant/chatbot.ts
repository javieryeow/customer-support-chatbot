"use server";

import OpenAI from "openai";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { updateAssistant } from "./update_assistant";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

let assistantId: string | null = null;

const initialize = async () => {    // initialize assistant 
  if (!assistantId) {
    assistantId = await updateAssistant();    
    console.log("Using Assistant ID:", assistantId);
  }
};

export async function getResponse(userMessage: string) {
  console.log("Received user query");
  if (!assistantId) {
    await initialize();
  }

  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: userMessage,
  });

  console.log("Beginning stream...");
  const stream = openai.beta.threads.runs.stream(thread.id, {   // use streaming for faster performance, output as response is generated
    assistant_id: assistantId!,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      stream
        .on("messageDelta", (delta) => {
          if (delta.content?.[0]?.type === "text") {
            let token = delta.content[0].text?.value || "";
            if (delta.content[0].text?.annotations?.length) {
              for (const annotation of delta.content[0].text.annotations) {
                if (annotation.text) {
                  token = token.replace(annotation.text, "").trim();
                }
              }
            }
            console.log("Streamed token: " + token)
            controller.enqueue(encoder.encode(token)); // send each token as a stream
          }
        })
        .on("end", () => {
          controller.close(); // close the stream when done
        });
    },
  });
};









  


