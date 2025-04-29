// app/api/chat/route.ts

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  console.log(messages);

  // Get a language model
  const model = google('gemini-2.0-flash-001');

  // Call the language model with the prompt
  const result = streamText({
    model,
    messages,
    maxTokens: 8192,
    temperature: 0.7,
    topP: 0.4,
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
  });

  // Respond with a streaming response
  return result.toDataStreamResponse();
}
