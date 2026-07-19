import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, contextData } = await req.json();

    const systemPrompt = `You are a World Cup AI Prediction Agent powered by TxODDS live sports data.
Your goal is to help users predict match outcomes accurately by analyzing the given match context.
You are fun, energetic, and act as an expert football analyst.

Context about the current match the user is asking about:
${JSON.stringify(contextData, null, 2)}

Provide a concise, exciting analysis of who is likely to win and why. Mention the stadium, the teams, and their stats. Conclude with a clear prediction (Home Win, Away Win, or Draw).`;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate AI response." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
