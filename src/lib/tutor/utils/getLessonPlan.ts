import type { TutorScenario } from "../config/scenarios";

export type LessonPlan = {
  topic: string;
  subtopic: string;
  questions: string[];
  introduction: string;
};

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomQuestions(questions: string[], count: number): string[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getLessonPlan(scenario: TutorScenario): LessonPlan {
  // 1. Elegir subtema aleatorio
  const selectedSet = getRandomItem(scenario.questionSets);

  // 2. Elegir 3 preguntas aleatorias
  const selectedQuestions = getRandomQuestions(selectedSet.questions, 3);

  // 3. Crear introducción del tutor
  const introduction = `Hello! Today we are going to practice ${scenario.topic}.
We will focus on ${selectedSet.subtopic}.
Let's start with a few questions.`;

  return {
    topic: scenario.topic,
    subtopic: selectedSet.subtopic,
    questions: selectedQuestions,
    introduction,
  };
}