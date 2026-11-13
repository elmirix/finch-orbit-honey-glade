import type { PracticeTest } from "./types";

export const READING_PRACTICE_TESTS: PracticeTest[] = [
  {
    id: "reading-test-1",
    module: "reading",
    title: "Academic Reading — Test 1",
    durationMinutes: 60,
    sections: [
      {
        title: "Passage 1: Urban Vertical Farming",
        instruction: "Read the text below and answer Questions 1–4.",
        passage: `Vertical farming is the practice of growing crops in vertically stacked layers. It often incorporates controlled-environment agriculture, which aims to optimize plant growth, and soilless farming techniques such as hydroponics, aquaponics, and aeroponics.

Proponents argue that vertical farms can produce food year-round regardless of weather conditions, use up to 95% less water than traditional agriculture, and reduce transportation emissions because facilities are located inside or near major cities. However, critics point out that high initial construction costs and substantial electricity consumption for artificial LED lighting remain major economic hurdles.`,
        questions: [
          {
            id: "r1-q1",
            number: 1,
            type: "choice",
            prompt: "Vertical farms rely exclusively on natural sunlight to grow crops.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "FALSE",
            explanation:
              "В тексте указано, что используется искусственное светодиодное освещение (artificial LED lighting).",
          },
          {
            id: "r1-q2",
            number: 2,
            type: "choice",
            prompt: "Vertical farming uses significantly less water than conventional farming.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "TRUE",
            explanation:
              "Второй абзац подтверждает: 'use up to 95% less water than traditional agriculture'.",
          },
          {
            id: "r1-q3",
            number: 3,
            type: "choice",
            prompt:
              "Most consumers prefer vegetables grown in vertical farms over organic soil crops.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "NOT GIVEN",
            explanation: "В тексте ничего не говорится о предпочтениях покупателей.",
          },
          {
            id: "r1-q4",
            number: 4,
            type: "input",
            prompt:
              "Complete the sentence with ONE WORD from the passage: High energy use for _____ lighting is a major financial challenge.",
            answer: "LED",
            explanation:
              "В последнем предложении сказано: 'electricity consumption for artificial LED lighting'.",
          },
        ],
      },
    ],
  },
];
