import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
  Shuffle,
  Volume2,
  XCircle,
} from "lucide-react";
import { LISTENING_PRACTICE_TESTS } from "@/data/ieltspractice/listening";
import { READING_PRACTICE_TESTS } from "@/data/ieltspractice/reading";
import type { PracticeModule, PracticeTest } from "@/data/ieltspractice/types";
import { Page } from "@/components/ui";

type PracticeSearch = {
  mode?: "single" | "full";
  module?: string;
  random?: boolean;
};

export const Route = createFileRoute("/ielts/practice")({
  validateSearch: (search: Record<string, unknown>): PracticeSearch => ({
    mode: search.mode === "full" ? "full" : "single",
    module: typeof search.module === "string" ? search.module : "reading",
    random: Boolean(search.random),
  }),
  component: IeltsPracticePage,
});

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function IeltsPracticePage() {
  const { mode = "single", module = "reading", random = false } = Route.useSearch();

  const tests: PracticeTest[] = useMemo(() => {
    if (mode === "full") {
      return [pickRandom(LISTENING_PRACTICE_TESTS), pickRandom(READING_PRACTICE_TESTS)];
    }
    const targetModule = module as PracticeModule;
    if (targetModule === "listening") {
      return [
        random ? pickRandom(LISTENING_PRACTICE_TESTS) : LISTENING_PRACTICE_TESTS[0],
      ];
    }
    return [random ? pickRandom(READING_PRACTICE_TESTS) : READING_PRACTICE_TESTS[0]];
  }, [mode, module, random]);

  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showScript, setShowScript] = useState(true);

  const totalMinutes = tests.reduce((acc, t) => acc + t.durationMinutes, 0);
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60);

  useEffect(() => {
    setActiveTestIndex(0);
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(totalMinutes * 60);
  }, [tests, totalMinutes]);

  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);

  const currentTest = tests[activeTestIndex];

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const scoreSummary = useMemo(() => {
    let correct = 0;
    let total = 0;
    for (const test of tests) {
      for (const section of test.sections) {
        for (const q of section.questions) {
          total += 1;
          const userAns = (answers[q.id] ?? "").trim().toLowerCase();
          const rightAns = q.answer.trim().toLowerCase();
          if (userAns === rightAns) correct += 1;
        }
      }
    }
    return { correct, total };
  }, [tests, answers]);

  return (
    <Page>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-dark pb-4">
        <Link
          to="/ielts"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate hover:text-teal"
        >
          <ArrowLeft className="size-4" />
          Назад к IELTS
        </Link>

        <div className="flex items-center gap-3">
          {random && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-3 px-3 py-1 text-xs font-medium text-teal">
              <Shuffle className="size-3.5" />
              Случайный вариант
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-3 px-3.5 py-1.5 text-sm font-semibold text-mist">
            <Clock className="size-4 text-teal" />
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      {tests.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tests.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTestIndex(idx)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTestIndex === idx
                  ? "bg-teal text-ink"
                  : "bg-navy-3 text-mist hover:text-teal"
              }`}
            >
              {idx + 1}. {t.title}
            </button>
          ))}
        </div>
      )}

      {submitted && (
        <div className="card mt-6 border-2 border-teal p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                Результат практики
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Правильных ответов: {scoreSummary.correct} из {scoreSummary.total}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Ниже под каждым вопросом показан правильный ответ и пояснение.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setSecondsLeft(totalMinutes * 60);
              }}
              className="tap inline-flex h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-mist"
            >
              <RotateCcw className="size-4 text-teal" />
              Пройти заново
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {currentTest.sections.map((section, sIdx) => (
          <div key={sIdx} className="grid gap-6 lg:grid-cols-2">
            <div className="card h-fit p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                {currentTest.title}
              </p>
              <h2 className="mt-1 text-xl font-semibold">{section.title}</h2>
              <p className="mt-1 text-sm text-muted">{section.instruction}</p>

              {section.audioUrl && (
                <div className="mt-4 rounded-2xl bg-navy p-4 text-mist">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-teal">
                    <Volume2 className="size-4" />
                    Аудиозапись
                  </div>
                  <audio controls src={section.audioUrl} className="w-full" />
                </div>
              )}

              {section.transcript && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowScript((prev) => !prev)}
                    className="text-xs font-semibold text-navy underline"
                  >
                    {showScript ? "Скрыть скрипт аудио" : "Показать скрипт аудио"}
                  </button>
                  {showScript && (
                    <div className="mt-2 whitespace-pre-line rounded-2xl bg-black/5 p-4 text-sm leading-relaxed text-ink">
                      {section.transcript}
                    </div>
                  )}
                </div>
              )}

              {section.passage && (
                <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink">
                  {section.passage}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {section.questions.map((q) => {
                const userVal = answers[q.id] ?? "";
                const isCorrect =
                  userVal.trim().toLowerCase() === q.answer.trim().toLowerCase();

                return (
                  <div key={q.id} className="card p-5">
                    <p className="text-sm font-semibold text-ink">
                      <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-navy text-xs text-teal">
                        {q.number}
                      </span>
                      {q.prompt}
                    </p>

                    {q.type === "choice" && q.options ? (
                      <div className="mt-3 space-y-2">
                        {q.options.map((opt) => (
                          <label
                            key={opt}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                              userVal === opt
                                ? "border-navy bg-navy/5 font-medium"
                                : "border-black/10 hover:border-navy/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              disabled={submitted}
                              checked={userVal === opt}
                              onChange={() =>
                                setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                              }
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        disabled={submitted}
                        value={userVal}
                        placeholder="Введите ответ..."
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        className="mt-3 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-navy"
                      />
                    )}

                    {submitted && (
                      <div
                        className={`mt-3 rounded-xl p-3 text-xs ${
                          isCorrect
                            ? "bg-emerald-500/10 text-emerald-900"
                            : "bg-rose-500/10 text-rose-900"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="mr-1 inline size-4" />
                            Верно!
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 inline size-4" />
                            Ошибка. Правильный ответ: {q.answer}
                          </>
                        )}
                        <p className="mt-1">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="tap inline-flex h-12 items-center justify-center rounded-full bg-teal px-8 text-sm font-semibold text-ink"
        >
          Завершить и проверить ответы
        </button>
      )}
    </Page>
  );
}