import type { Exam, ExamId, Subject, Topic } from "./types";
import { ortMath } from "./ort-math";
import { ortLogic } from "./ort-logic";
import { ortReading } from "./ort-reading";
import { ortGrammar } from "./ort-grammar";
import { ortSimulation } from "./ort-sim";
import { satReading } from "./sat-reading";
import { satWriting } from "./sat-writing";
import { satMathNc } from "./sat-math-nc";
import { satMathC } from "./sat-math-c";
import { satSimulation } from "./sat-sim";
import { ieltsListening } from "./ielts-listening";
import { ieltsReading } from "./ielts-reading";
import { ieltsWriting } from "./ielts-writing";
import { ieltsSpeaking } from "./ielts-speaking";
import { ieltsSimulation } from "./ielts-sim";

export const exams: Record<ExamId, Exam> = {
  ort: {
    id: "ort",
    title: "ОРТ",
    fullName: "Поступление в вузы Кыргызстана",
    description:
      "Все разделы основного теста: от математики и аналогий до чтения и грамматики.",
    icon: "landmark",
    subjects: [ortMath, ortLogic, ortReading, ortGrammar],
    simulation: ortSimulation,
  },
  sat: {
    id: "sat",
    title: "SAT",
    fullName: "Поступление в зарубежные вузы",
    description:
      "Полный разбор американского теста: чтение, письмо и два блока математики.",
    icon: "graduation",
    subjects: [satReading, satWriting, satMathNc, satMathC],
    simulation: satSimulation,
  },
  ielts: {
    id: "ielts",
    title: "IELTS",
    fullName: "Международный экзамен по английскому",
    description:
      "Разбор всех четырёх модулей: Listening, Reading, Writing и Speaking с готовыми стратегиями.",
    icon: "globe",
    subjects: [ieltsListening, ieltsReading, ieltsWriting, ieltsSpeaking],
    simulation: ieltsSimulation,
  },
};

export const examList: Exam[] = [exams.ort, exams.sat, exams.ielts];

export function getSubject(examId: ExamId, subjectId: string): Subject | undefined {
  return exams[examId].subjects.find((subject) => subject.id === subjectId);
}

export function getTopic(
  examId: ExamId,
  subjectId: string,
  topicId: string,
): { subject: Subject; topic: Topic } | undefined {
  const subject = getSubject(examId, subjectId);
  const topic = subject?.topics.find((item) => item.id === topicId);
  if (!subject || !topic) return undefined;
  return { subject, topic };
}
