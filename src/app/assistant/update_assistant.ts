import OpenAI from "openai";
import fs from "fs";
import { createAssistant } from "./createAssistant";
import { createVectorStore } from "./vector_store";


const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
});

const assistant_id = "/Users/javieryeow/Desktop/customer-support-chatbot/public/assistant_id.txt";

export async function updateAssistant() {
    if (fs.existsSync(assistant_id)) {      // retrieve existing assistant, else create a new one
      const assistantId = fs.readFileSync(assistant_id, "utf-8");
      console.log("Assistant retrieved: ", assistant_id);
      return assistantId;
    } else {
      const assistantId = await createAssistant();   
      const vectorStoreId = await createVectorStore();
      await openai.beta.assistants.update(assistantId, { // connect assistant to vector store to use faq
          tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } },
      });
      fs.writeFileSync(assistant_id, assistantId);    // save assistant id for storage
      console.log("Assistant ID saved for persistence")
      console.log("Assistant updated with vector store: ", vectorStoreId);
      return assistantId;
    }
};


