import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { exams } from "@/data/catalog";
import type { ExamId, Subject, Topic } from "@/data/types";
import { ExamLink, SubjectLink } from "@/components/links";

function Sep() {
  return <ChevronRight className="size-3.5 shrink-0 text-slate" aria-hidden="true" />;
}

export function Trail({
  examId,
  subject,
  topic,
  leaf,
}: {
  examId: ExamId;
  subject?: Subject;
  topic?: Topic;
  leaf?: string;
}) {
  const exam = exams[examId];
  const examCurrent = !subject && !leaf;
  const subjectCurrent = Boolean(subject) && !topic && !leaf;

  return (
    <nav aria-label="Навигация по разделам" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate">
      <Link to="/" className="hover:text-teal">
        Главная
      </Link>
      <Sep />
      {examCurrent ? (
        <span className="text-mist">{exam.title}</span>
      ) : (
        <ExamLink examId={examId} className="hover:text-teal">
          {exam.title}
        </ExamLink>
      )}
      {subject ? (
        <>
          <Sep />
          {subjectCurrent ? (
            <span className="text-mist">{subject.title}</span>
          ) : (
            <SubjectLink examId={examId} subjectId={subject.id} className="hover:text-teal">
              {subject.title}
            </SubjectLink>
          )}
        </>
      ) : null}
      {topic ? (
        <>
          <Sep />
          <span className="text-mist">{topic.title}</span>
        </>
      ) : null}
      {leaf ? (
        <>
          <Sep />
          <span className="text-mist">{leaf}</span>
        </>
      ) : null}
    </nav>
  );
}

export function CrumbCurrent({ children }: { children: ReactNode }) {
  return <span className="text-mist">{children}</span>;
}
