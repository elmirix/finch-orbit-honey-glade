import type { Question } from "./types";

const LETTERS = ["a", "b", "c", "d"] as const;

export function q(
  id: string,
  prompt: string,
  choices: readonly [string, string, string, string],
  answer: 0 | 1 | 2 | 3,
  explanation: string,
  passage?: string,
  passageTitle?: string,
): Question {
  return {
    id,
    prompt,
    passage,
    passageTitle,
    choices: choices.map((text, index) => ({ id: LETTERS[index], text })),
    answer: LETTERS[answer],
    explanation,
  };
}
