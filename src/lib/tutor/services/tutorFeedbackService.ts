import { buildFeedbackPrompt } from "../prompts/buildFeedbackPrompt";
import type { Message, FeedbackResult } from "../types";
import type { TutorScenario } from "../config/scenarios";

export async function getTutorFeedback(
  scenario: TutorScenario,
  messages: Message[]
): Promise<FeedbackResult> {
  try {
    const feedbackPrompt = buildFeedbackPrompt(scenario, messages);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an English tutor that returns only valid JSON with no extra text.",
          },
          {
            role: "user",
            content: feedbackPrompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI feedback status:", response.status);
      throw new Error("Error generating feedback.");
    }

    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No feedback content received.");
    }

    const parsedFeedback: FeedbackResult = JSON.parse(rawContent);

    return {
      positivePoints: parsedFeedback.positivePoints ?? [],
      thingsToImprove: parsedFeedback.thingsToImprove ?? [],
      correctedExamples: parsedFeedback.correctedExamples ?? [],
      finalRecommendation:
        parsedFeedback.finalRecommendation ?? "No recommendation available.",
    };
  } catch (error) {
    console.error("Error in tutorFeedbackService:", error);

    return {
      positivePoints: [],
      thingsToImprove: ["The feedback could not be generated."],
      correctedExamples: [],
      finalRecommendation: "Please try again.",
    };
  }
}
