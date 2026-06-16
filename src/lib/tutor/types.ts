// Basic types for the tutor module.
// Keep them small and easy to reuse.

export type Level = "A2" | "B1" | "B2";

export type Scenario = {
  id: string;
  level: Level;
  title: string;
  description: string;
  topic: string;
};

export type Message = {
  role: "user" | "tutor";
  content: string;
};

export type FeedbackResult = {
  positivePoints: string[];
  thingsToImprove: string[];
  correctedExamples: string[];
  finalRecommendation: string;
};