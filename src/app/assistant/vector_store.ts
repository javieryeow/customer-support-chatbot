"use server";

import OpenAI from "openai";
import fs from "fs";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function createVectorStore() {
    const filePath = "/Users/javieryeow/Desktop/customer-support-chatbot/public/devicecare.txt";
    const fileStream = fs.createReadStream(filePath);
    let vectorStore = await openai.beta.vectorStores.create({
        name: "DeviceCare FAQ",
    });

    await openai.beta.vectorStores.files.uploadAndPoll(vectorStore.id, fileStream);
    console.log("Vector store created: ", vectorStore.id);
    return vectorStore.id;
}

