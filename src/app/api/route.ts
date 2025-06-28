import { NextResponse } from "next/server";
import { getResponse } from "../assistant/chatbot"; 

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json(); // get user message from request
    const stream = await getResponse(userMessage); // call getResponse from chatbot.ts to retrieve stream

    return new NextResponse(stream, {   // return stream to frontend for processing
      headers: { "Content-Type": "text/plain" }, 
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
