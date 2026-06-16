import type { Message, FeedbackResult } from "../types";
import type { TutorScenario } from "../config/scenarios";

export function buildFeedbackPrompt(
  scenario: TutorScenario,
  messages: Message[]
): string {
  const conversationText = messages
    .map((message) => {
      const speaker = message.role === "user" ? "Student" : "Tutor";
      return `${speaker}: ${message.content}`;
    })
    .join("\n");

  return `
You are an English tutor evaluating a student's session.

The session level is ${scenario.level}.
The session topic is ${scenario.topic}.
The goal is to provide feedback adapted to the student's level and the selected topic.

Analyze the student's English based only on their messages during this session.

Return the result in valid JSON with this exact structure:
{
  "positivePoints": ["point 1", "point 2"],
  "thingsToImprove": ["point 1", "point 2"],
  "correctedExamples": ["example 1", "example 2"],
  "finalRecommendation": "short recommendation"
}

Rules:
- Write everything in English.
- Keep the feedback clear and useful.
- Focus on grammar, vocabulary, clarity and adequacy to the topic.
- Do not include markdown.
- Do not add extra text outside the JSON.

Conversation:
${conversationText}
`;
}