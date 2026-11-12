import { Clock } from "lucide-react";
import { exams } from "@/data/catalog";
import type { ExamId } from "@/data/types";
import { questionsLabel, topicsLabel } from "@/lib/format";
import { Icon } from "@/components/icons";
import { SimLink, SubjectLink } from "@/components/links";
import { Trail } from "@/components/trail";
import { Meter, Page } from "@/components/ui";
import { useProgressHydrated } from "@/components/use-hydrated";
import { topicKey, useProgress } from "@/store/progress";

export function ExamView({ examId }: { examId: ExamId }) {
  const exam = exams[examId];
  const hydrated = useProgressHydrated();
  const topics = useProgress((state) => state.topics);
  const sim = useProgress((state) => state.sims[examId]);

  let done = 0;
  let total = 0;
  for (const subject of exam.subjects) {
    for (const topic of subject.topics) {
      total += 1;
      if (hydrated && topics[topicKey(examId, subject.id, topic.id)]?.passed) done += 1;
    }
  }

  return (
    <Page>
      <Trail examId={examId} />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-teal">{exam.fullName}</p>
          <h1 className="mt-2 text-4xl font-semibold text-mist">{exam.title}</h1>
          <p className="mt-4 text-slate">{exam.description}</p>
        </div>
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between text-sm text-slate">
            <span>Темы</span>
            <span>
              {hydrated ? done : 0} / {total}
            </span>
          </div>
          <div className="mt-2">
            <Meter value={hydrated ? done : 0} max={total} tone="navy" />
          </div>
        </div>
      </div>

      <SimLink
        examId={examId}
        className="card card-hover mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-navy text-teal">
            <Clock className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Пробный экзамен</h2>
            <p className="mt-1 text-sm text-muted">
              {questionsLabel(exam.simulation.length)} · 15 минут · разбор ошибок в конце
              {hydrated && sim ? ` · лучший результат ${sim.bestPercent}%` : ""}
            </p>
          </div>
        </div>
        <span className="tap inline-flex h-11 items-center justify-center rounded-full bg-teal px-5 text-sm font-semibold text-ink">
          Начать пробный
        </span>
      </SimLink>

      <h2 className="mt-10 text-xl font-semibold text-mist">Предметы</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {exam.subjects.map((subject) => {
          const subjectDone = hydrated
            ? subject.topics.filter((topic) => topics[topicKey(examId, subject.id, topic.id)]?.passed)
                .length
            : 0;
          return (
            <article key={subject.id} className="card flex flex-col p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-navy text-teal">
                  <Icon name={subject.icon} className="size-5" />
                </span>
                <div>
                  {subject.official ? (
                    <p className="text-xs font-medium tracking-wide text-muted">{subject.official}</p>
                  ) : null}
                  <h3 className="text-xl font-semibold">{subject.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{subject.description}</p>
              <p className="mt-4 text-sm text-ink">
                {topicsLabel(subject.topics.length)}
                {hydrated && subjectDone > 0 ? ` · пройдено ${subjectDone}` : ""}
              </p>
              <div className="mt-3">
                <Meter value={subjectDone} max={subject.topics.length} />
              </div>
              <SubjectLink
                examId={examId}
                subjectId={subject.id}
                className="tap mt-5 inline-flex h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-semibold text-mist"
              >
                Начать изучение
              </SubjectLink>
            </article>
          );
        })}
      </div>
    </Page>
  );
}
