import { buildSystemPrompt } from "../prompts/buildSystemPrompt";
import type { Scenario, Message } from "../types";

export async function getTutorResponse(
  scenario: Scenario,
  messages: Message[]
): Promise<string> {
  try {
    const systemPrompt = buildSystemPrompt(scenario);

    const formattedMessages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.map((msg) => ({
        role: msg.role === "tutor" ? "assistant" : "user",
        content: msg.content,
      })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: formattedMessages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI status:", response.status);
      return "Error generating response.";
    }

    const tutorReply = data.choices?.[0]?.message?.content;

    if (!tutorReply) {
      return "Error generating response.";
    }

    return tutorReply;
  } catch (error) {
    console.error("Error in tutorChatService:", error);
    return "There was an error generating the response.";
  }
}
