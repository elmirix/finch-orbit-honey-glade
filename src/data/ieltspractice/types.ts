export type PracticeModule = "listening" | "reading" | "writing" | "speaking";

export interface PracticeQuestion {
  id: string;
  number: number;
  type: "choice" | "input" | "matrix" | "matching";
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface PracticeSection {
  title: string;
  instruction: string;
  passage?: string; // Используем для конспекта с пропусками {{1}}, {{2}}...
  audioUrl?: string;
  imageUrl?: string;
  sharedOptions?: string[]; // Общие варианты A-H для карты или Opinions
  sharedOptionsTitle?: string;
  transcript?: string;
  questions: PracticeQuestion[];
}

export interface PracticeTest {
  id: string;
  module: PracticeModule;
  title: string;
  durationMinutes: number;
  sections: PracticeSection[];
}