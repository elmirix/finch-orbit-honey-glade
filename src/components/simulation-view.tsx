import { useCallback, useEffect, useRef, useState } from "react";
import { exams } from "@/data/catalog";
import type { ExamId } from "@/data/types";
import { formatClock, percent, questionsLabel, SIM_SECONDS } from "@/lib/format";
import { cn } from "@/lib/cn";
import { QuestionBlock } from "@/components/question-block";
import { ExamLink } from "@/components/links";
import { Trail } from "@/components/trail";
import { Button, Page } from "@/components/ui";
import { useProgressHydrated } from "@/components/use-hydrated";
import { useProgress } from "@/store/progress";

export function SimulationView({ examId }: { examId: ExamId }) {
  const exam = exams[examId];
  const questions = exam.simulation;
  const saveSim = useProgress((state) => state.saveSim);
  const best = useProgress((state) => state.sims[examId]);
  const hydrated = useProgressHydrated();

  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [left, setLeft] = useState(SIM_SECONDS);
  const [used, setUsed] = useState(0);

  const answersRef = useRef(answers);
  const leftRef = useRef(left);
  const phaseRef = useRef(phase);
  answersRef.current = answers;
  leftRef.current = left;
  phaseRef.current = phase;

  const finish = useCallback(() => {
    if (phaseRef.current === "done") return;
    phaseRef.current = "done";
    setUsed(SIM_SECONDS - leftRef.current);
    setPhase("done");
    const correct = questions.filter(
      (question) => answersRef.current[question.id] === question.answer,
    ).length;
    saveSim(examId, percent(correct, questions.length));
  }, [examId, questions, saveSim]);

  useEffect(() => {
    if (phase !== "run") return;
    const timer = window.setInterval(() => {
      setLeft((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "run" && left === 0) finish();
  }, [finish, left, phase]);

  const current = questions[index];
  const correctCount = questions.filter((question) => answers[question.id] === question.answer).length;
  const wrong = questions.filter((question) => answers[question.id] !== question.answer);
  const right = questions.filter((question) => answers[question.id] === question.answer);
  const lowTime = left <= 60;

  return (
    <Page>
      <Trail examId={examId} leaf="Пробный экзамен" />
      <p className="text-sm font-medium text-teal">{exam.title}</p>
      <h1 className="mt-2 text-3xl font-semibold text-mist md:text-4xl">Пробный экзамен</h1>

      {phase === "intro" ? (
        <div className="card mt-6 max-w-2xl p-6 md:p-8">
          <p className="text-sm leading-relaxed text-ink">
            {questionsLabel(questions.length)} только по программе {exam.title}. На всё даётся 15 минут.
            Можно сдать работу раньше. Вопросы без ответа считаются ошибками. Это учебный пробник, не
            официальный бланк.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-muted">
            <li>Таймер запускается после кнопки «Начать».</li>
            <li>Между вопросами можно переключаться свободно.</li>
            <li>В конце откроется балл и разбор каждой ошибки.</li>
          </ul>
          {hydrated && best ? (
            <p className="mt-4 text-sm text-ink">
              Лучший результат на этом устройстве: {best.bestPercent}% · попыток: {best.attempts}
            </p>
          ) : null}
          <Button
            className="mt-6"
            onClick={() => {
              setAnswers({});
              setIndex(0);
              setLeft(SIM_SECONDS);
              setPhase("run");
            }}
          >
            Начать
          </Button>
        </div>
      ) : null}

      {phase === "run" && current ? (
        <div className="mt-6">
          <div className="sticky top-16 z-30 -mx-4 border-b border-line-dark bg-navy px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={cn("text-lg font-semibold tabular-nums", lowTime ? "text-bad" : "text-teal")}>
                <span className="sr-only">Осталось времени </span>
                {formatClock(left)}
              </p>
              <p className="text-sm text-slate">
                Вопрос {index + 1} из {questions.length}
              </p>
              <Button variant="outline-light" onClick={finish}>
                Завершить
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {questions.map((question, questionIndex) => {
                const answered = Boolean(answers[question.id]);
                const active = questionIndex === index;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setIndex(questionIndex)}
                    className={cn(
                      "tap size-9 rounded-full text-sm font-semibold",
                      active && "bg-teal text-ink",
                      !active && answered && "bg-navy-3 text-teal",
                      !active && !answered && "border border-line-dark text-mist",
                    )}
                    aria-label={`Вопрос ${questionIndex + 1}`}
                    aria-current={active ? "true" : undefined}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card mt-4 p-5 md:p-8">
            <QuestionBlock
              index={index + 1}
              question={current}
              selected={answers[current.id]}
              reveal={false}
              onSelect={(choiceId) =>
                setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: choiceId }))
              }
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>
                Назад
              </Button>
              {index < questions.length - 1 ? (
                <Button onClick={() => setIndex((value) => value + 1)}>Дальше</Button>
              ) : (
                <Button onClick={finish}>Сдать работу</Button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="mt-6 grid gap-4">
          <section className="card p-6 md:p-8">
            <p className="text-sm font-semibold text-ok">Результат</p>
            <p className="mt-2 text-5xl font-semibold text-ink">
              {correctCount}
              <span className="text-2xl text-muted"> / {questions.length}</span>
            </p>
            <p className="mt-3 text-sm text-muted">
              {percent(correctCount, questions.length)}% · время {formatClock(used)} из {formatClock(SIM_SECONDS)}.
              Это учебный ориентир, не официальный балл {exam.title}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setPhase("intro");
                  setAnswers({});
                  setIndex(0);
                  setLeft(SIM_SECONDS);
                }}
              >
                Ещё попытка
              </Button>
              <ExamLink
                examId={examId}
                className="tap inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-ink"
              >
                К предметам
              </ExamLink>
            </div>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="text-xl font-semibold">Разбор ошибок</h2>
            {wrong.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Ошибок нет — все ответы совпали с ключом.</p>
            ) : (
              <div className="mt-5 grid gap-6">
                {wrong.map((question) => (
                  <QuestionBlock
                    key={question.id}
                    index={questions.indexOf(question) + 1}
                    question={question}
                    selected={answers[question.id]}
                    reveal
                  />
                ))}
              </div>
            )}
            {right.length > 0 ? (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm font-semibold text-ink">
                  Верные ответы ({right.length})
                </summary>
                <div className="mt-5 grid gap-6">
                  {right.map((question) => (
                    <QuestionBlock
                      key={question.id}
                      index={questions.indexOf(question) + 1}
                      question={question}
                      selected={answers[question.id]}
                      reveal
                    />
                  ))}
                </div>
              </details>
            ) : null}
          </section>
        </div>
      ) : null}
    </Page>
  );
}
