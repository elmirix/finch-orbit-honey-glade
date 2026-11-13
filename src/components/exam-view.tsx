import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Clock,
  Headphones,
  Mic,
  PenLine,
  PlayCircle,
  Shuffle,
} from "lucide-react";
import { exams } from "@/data/catalog";
import type { ExamId } from "@/data/types";
import { questionsLabel, topicsLabel } from "@/lib/format";
import { Icon } from "@/components/icons";
import { SimLink, SubjectLink } from "@/components/links";
import { Trail } from "@/components/trail";
import { Meter, Page } from "@/components/ui";
import { useProgressHydrated } from "@/components/use-hydrated";
import { topicKey, useProgress } from "@/store/progress";

const IELTS_PRACTICE_MODULES = [
  {
    id: "listening",
    title: "Listening",
    subtitle: "4 части · 40 вопросов",
    icon: Headphones,
    ready: true,
  },
  {
    id: "reading",
    title: "Reading",
    subtitle: "3 текста · 40 вопросов",
    icon: BookOpen,
    ready: true,
  },
  {
    id: "writing",
    title: "Writing",
    subtitle: "Task 1 & Task 2",
    icon: PenLine,
    ready: false,
  },
  {
    id: "speaking",
    title: "Speaking",
    subtitle: "Parts 1–3",
    icon: Mic,
    ready: false,
  },
] as const;

export function ExamView({ examId }: { examId: ExamId }) {
  const exam = exams[examId];
  const navigate = useNavigate();
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

  const handleRandomIelts = () => {
    const available = IELTS_PRACTICE_MODULES.filter((m) => m.ready);
    const chosen = available[Math.floor(Math.random() * available.length)];
    navigate({
      to: "/ielts/practice",
      search: { mode: "single", module: chosen.id, random: true },
    });
  };

  const handleFullIelts = () => {
    navigate({
      to: "/ielts/practice",
      search: { mode: "full", module: "all", random: false },
    });
  };

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

      {examId === "ielts" && (
        <section className="card mt-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                Практика модулей
              </p>
              <h2 className="mt-1 text-xl font-semibold">Пройти практис IELTS</h2>
              <p className="mt-1 text-sm text-muted">
                Выберите отдельный модуль, случайный вариант или запустите полный тест.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleRandomIelts}
                className="tap inline-flex h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-mist"
              >
                <Shuffle className="size-4 text-teal" aria-hidden="true" />
                Рандомно
              </button>

              <button
                type="button"
                onClick={handleFullIelts}
                className="tap inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal px-5 text-sm font-semibold text-ink"
              >
                <PlayCircle className="size-4" aria-hidden="true" />
                Полный тест
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {IELTS_PRACTICE_MODULES.map((mod) => {
              const ModuleIcon = mod.icon;
              return (
                <button
                  key={mod.id}
                  type="button"
                  disabled={!mod.ready}
                  onClick={() =>
                    navigate({
                      to: "/ielts/practice",
                      search: { mode: "single", module: mod.id, random: false },
                    })
                  }
                  className="tap flex flex-col items-start rounded-2xl border border-black/10 bg-white/60 p-4 text-left transition hover:border-navy/40 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-navy text-teal">
                      <ModuleIcon className="size-5" aria-hidden="true" />
                    </span>
                    {!mod.ready && (
                      <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-muted">
                        Скоро
                      </span>
                    )}
                  </div>
                  <span className="mt-3 text-base font-semibold text-ink">{mod.title}</span>
                  <span className="mt-0.5 text-xs text-muted">{mod.subtitle}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

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
