This is a Generative AI Chatbot for DeviceCare Frontline Customer Support, built using NextJS (React) and OpenAI Assistants API.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How was the DeviceCare FAQ document integrated into the GPT-4o model?

1. First, the FAQ document content was copied onto a txt file (devicecare.txt) and placed in customer-support-chatbot/public folder.

2. Programmatically created an assistant using OpenAI Assistants API with relevant instructions, using the file_search tool.

3. Programatically set up the vector store to store devicecare.txt to allow the assistant to parse and chunk the document to retrieve relevant content to answer user queries.

4. Updated assistant's tool resources to use the vector store containing devicecare.txt

5. Continued to fine-tune and prompt engineer the assistant to give better responses, and to handle questions outside of scope.
