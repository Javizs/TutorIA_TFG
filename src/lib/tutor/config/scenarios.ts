export type TutorQuestionSet = {
  subtopic: string;
  questions: string[];
};

export type TutorScenario = {
  id: string;
  level: "A2" | "B1" | "B2";
  title: string;
  description: string;
  topic: string;
  questionSets: TutorQuestionSet[];
};

export const scenarios: TutorScenario[] = [
  {
    id: "a2-home",
    level: "A2",
    title: "Vida cotidiana",
    description: "Práctica de situaciones simples relacionadas con casa y rutinas.",
    topic: "home and daily life",
    questionSets: [
      {
        subtopic: "daily routine",
        questions: [
          "What time do you usually wake up?",
          "What do you do in the morning?",
          "Do you have breakfast at home?",
          "What do you usually do in the evening?",
        ],
      },
      {
        subtopic: "your house",
        questions: [
          "Can you describe your house?",
          "What is your favourite room in your house?",
          "Do you live in a house or in a flat?",
          "What do you usually do at home?",
        ],
      },
      {
        subtopic: "household tasks",
        questions: [
          "Do you help with housework?",
          "What household tasks do you usually do?",
          "Do you like cleaning your room?",
          "Who cooks at home?",
        ],
      },
    ],
  },
  {
    id: "b1-daily",
    level: "B1",
    title: "Situaciones diarias",
    description: "Práctica de viajes, compras e interacción básica.",
    topic: "daily situations",
    questionSets: [
      {
        subtopic: "shopping",
        questions: [
          "How often do you go shopping?",
          "Do you prefer shopping online or in physical stores?",
          "What do you usually buy when you go shopping?",
          "Have you ever had a bad experience in a shop?",
        ],
      },
      {
        subtopic: "travel",
        questions: [
          "Do you enjoy travelling?",
          "What was your last trip like?",
          "What do you usually pack for a trip?",
          "Do you prefer travelling alone or with other people?",
        ],
      },
      {
        subtopic: "asking for information",
        questions: [
          "What would you say if you were lost in a city?",
          "How would you ask for directions in English?",
          "Have you ever needed help while travelling?",
          "Do you think it is important to speak English when travelling?",
        ],
      },
    ],
  },
  {
    id: "b2-job-interview",
    level: "B2",
    title: "Entorno profesional",
    description: "Práctica de entrevistas de trabajo y conversación más avanzada.",
    topic: "job interview",
    questionSets: [
      {
        subtopic: "personal introduction",
        questions: [
          "Can you introduce yourself briefly?",
          "How would you describe yourself as a professional?",
          "Why are you interested in this position?",
          "What makes you a good candidate for this job?",
        ],
      },
      {
        subtopic: "experience and skills",
        questions: [
          "Can you talk about your previous experience?",
          "What are your main strengths?",
          "What technical or personal skills would you highlight?",
          "Can you describe a challenge you faced and how you solved it?",
        ],
      },
      {
        subtopic: "future goals",
        questions: [
          "Where do you see yourself in a few years?",
          "What are your professional goals?",
          "Why do you want to improve your English?",
          "How do you think this job could help your development?",
        ],
      },
    ],
  },
];