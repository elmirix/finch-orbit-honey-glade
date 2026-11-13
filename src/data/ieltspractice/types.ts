export type PracticeModule = "listening" | "reading" | "writing" | "speaking";

export interface PracticeQuestion {
  id: string;
  number: number;
  type: "choice" | "input";
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface PracticeSection {
  title: string;
  instruction: string;
  passage?: string;
  audioUrl?: string;
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
