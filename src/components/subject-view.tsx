import type { ExamId, Subject } from "@/data/types";
import { TopicLink } from "@/components/links";
import { Trail } from "@/components/trail";
import { Page } from "@/components/ui";
import { useProgressHydrated } from "@/components/use-hydrated";
import { EMPTY_TOPIC, topicKey, useProgress } from "@/store/progress";
import { cn } from "@/lib/cn";

export function SubjectView({ examId, subject }: { examId: ExamId; subject: Subject }) {
  const hydrated = useProgressHydrated();
  const topics = useProgress((state) => state.topics);

  return (
    <Page>
      <Trail examId={examId} subject={subject} />
      <div className="max-w-2xl">
        {subject.official ? <p className="text-sm font-medium text-teal">{subject.official}</p> : null}
        <h1 className="mt-2 text-4xl font-semibold text-mist">{subject.title}</h1>
        <p className="mt-4 text-slate">{subject.description}</p>
      </div>
      <ol className="mt-8 grid gap-3">
        {subject.topics.map((topic, index) => {
          const record = hydrated ? (topics[topicKey(examId, subject.id, topic.id)] ?? EMPTY_TOPIC) : EMPTY_TOPIC;
          const started =
            record.theoryDone || Object.keys(record.practice).length > 0 || record.bestPercent != null;
          const label = record.passed ? "Завершено" : started ? "В процессе" : "Не начато";
          const action = record.passed ? "Повторить" : started ? "Продолжить" : "Открыть тему";
          return (
            <li key={topic.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-teal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{topic.title}</h2>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        record.passed && "bg-teal-soft text-ink",
                        !record.passed && started && "bg-navy text-teal",
                        !record.passed && !started && "bg-line text-muted",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{topic.blurb}</p>
                  <p className="mt-2 text-xs text-muted">
                    {topic.minutes} мин · практика {topic.practice.length} · проверка {topic.quiz.length}
                    {record.bestPercent != null ? ` · лучший результат ${record.bestPercent}%` : ""}
                  </p>
                </div>
              </div>
              <TopicLink
                examId={examId}
                subjectId={subject.id}
                topicId={topic.id}
                className="tap inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-teal px-5 text-sm font-semibold text-ink"
              >
                {action}
              </TopicLink>
            </li>
          );
        })}
      </ol>
    </Page>
  );
}
