import type { PracticeTest } from "./types";

export const LISTENING_PRACTICE_TESTS: PracticeTest[] = [
  {
    id: "listening-test-1",
    module: "listening",
    title: "IELTS Listening — Test 1",
    durationMinutes: 30,
    sections: [
      {
        title: "Part 1: Library Membership Registration",
        instruction: "Listen to the recording (or read the audio script) and answer Questions 1–3.",
        transcript: `Librarian: Good morning, Central City Library. How can I help you?
Student: Hi, I'd like to register for a library card. My name is Daniel Mercer.
Librarian: Could you spell your surname, please?
Student: Yes, it's M-E-R-C-E-R.
Librarian: Thank you. And what is your current postcode?
Student: It's CB4 2QT. Actually, wait—we moved last week, so it's now CB4 9LP.
Librarian: Got it, CB4 9LP. Membership is free for students, though there is a £5 deposit for borrowing audio equipment.`,
        questions: [
          {
            id: "l1-q1",
            number: 1,
            type: "input",
            prompt: "Applicant's surname: Daniel _____",
            answer: "Mercer",
            explanation: "Студент произносит фамилию по буквам: M-E-R-C-E-R.",
          },
          {
            id: "l1-q2",
            number: 2,
            type: "input",
            prompt: "Current postcode: _____",
            answer: "CB4 9LP",
            explanation:
              "Классическая ловушка IELTS: сначала назван старый индекс CB4 2QT, затем исправлен на CB4 9LP.",
          },
          {
            id: "l1-q3",
            number: 3,
            type: "choice",
            prompt: "How much does a standard student membership cost?",
            options: ["Free", "£5", "£15"],
            answer: "Free",
            explanation: "Библиотекарь говорит: 'Membership is free for students'.",
          },
        ],
      },
    ],
  },
];
