export type ExamId = "ort" | "sat" | "ielts";

export type IconKey =
  | "sigma"
  | "brain"
  | "book"
  | "spell"
  | "headphones"
  | "pen"
  | "mic"
  | "calculator"
  | "chart"
  | "languages"
  | "graduation"
  | "globe"
  | "landmark";

export type Choice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  prompt: string;
  passage?: string;
  passageTitle?: string;
  choices: Choice[];
  answer: string;
  explanation: string;
};

export type TheoryBlock = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
};

export type Topic = {
  id: string;
  title: string;
  blurb: string;
  minutes: number;
  theory: TheoryBlock[];
  practice: Question[];
  quiz: Question[];
};

export type Subject = {
  id: string;
  title: string;
  official?: string;
  description: string;
  icon: IconKey;
  topics: Topic[];
};

export type Exam = {
  id: ExamId;
  title: string;
  fullName: string;
  description: string;
  icon: IconKey;
  subjects: Subject[];
  simulation: Question[];
};
