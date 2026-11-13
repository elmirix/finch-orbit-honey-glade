import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import type { ExamId, Subject, Topic } from "@/data/types";
import { PASS_RATIO, percent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { QuestionBlock } from "@/components/question-block";
import { SubjectLink, TopicLink } from "@/components/links";
import { Trail } from "@/components/trail";
import { Button, Page } from "@/components/ui";
import { useProgressHydrated } from "@/components/use-hydrated";
import { EMPTY_TOPIC, topicKey, useProgress } from "@/store/progress";

type Stage = "theory" | "practice" | "quiz";

const STAGES: { id: Stage; label: string }[] = [
  { id: "theory", label: "Теория" },
  { id: "practice", label: "Практика" },
  { id: "quiz", label: "Проверка темы" },
];

export function TopicView({
  examId,
  subject,
  topic,
}: {
  examId: ExamId;
  subject: Subject;
  topic: Topic;
}) {
  const key = topicKey(examId, subject.id, topic.id);
  const hydrated = useProgressHydrated();
  const record = useProgress((state) => state.topics[key] ?? EMPTY_TOPIC);
  const setLast = useProgress((state) => state.setLast);
  const markTheory = useProgress((state) => state.markTheory);
  const markPractice = useProgress((state) => state.markPractice);
  const saveQuiz = useProgress((state) => state.saveQuiz);
  const rec = hydrated ? record : EMPTY_TOPIC;

  const practiceDone = topic.practice.every((question) => rec.practice[question.id]) || rec.passed;
  const practiceUnlocked = rec.theoryDone || rec.passed;
  const quizUnlocked = (rec.theoryDone && practiceDone) || rec.passed;

  const [stage, setStage] = useState<Stage>("theory");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    setLast({
      examId,
      subjectId: subject.id,
      topicId: topic.id,
      title: topic.title,
      subjectTitle: subject.title,
    });
  }, [examId, setLast, subject.id, subject.title, topic.id, topic.title]);

  useEffect(() => {
    if (!hydrated) return;
    if (rec.passed) return;
    if (quizUnlocked) setStage("quiz");
    else if (rec.theoryDone) setStage("practice");
  }, [hydrated, quizUnlocked, rec.passed, rec.theoryDone]);

  const topicIndex = subject.topics.findIndex((item) => item.id === topic.id);
  const nextTopic = subject.topics[topicIndex + 1];

  function unlocked(id: Stage) {
    if (id === "theory") return true;
    if (id === "practice") return practiceUnlocked;
    return quizUnlocked;
  }

  function finishQuiz() {
    const answered = topic.quiz.filter((question) => quizAnswers[question.id]).length;
    if (answered < topic.quiz.length) {
      const ok = window.confirm(
        `Отвечено ${answered} из ${topic.quiz.length}. Пустые ответы засчитаются как ошибки. Завершить проверку?`,
      );
      if (!ok) return;
    }
    const correct = topic.quiz.filter((question) => quizAnswers[question.id] === question.answer).length;
    const score = percent(correct, topic.quiz.length);
    const passed = correct / topic.quiz.length >= PASS_RATIO;
    saveQuiz(key, score, passed);
    setQuizResult({ correct, total: topic.quiz.length });
  }

  return (
    <Page>
      <Trail examId={examId} subject={subject} topic={topic} />
      <div className="grid gap-6 lg:grid-cols-4 lg:items-start">
        <div className="min-w-0 lg:col-span-3">
          <h1 className="text-3xl font-semibold text-mist md:text-4xl">{topic.title}</h1>
          <p className="mt-3 max-w-2xl text-slate">{topic.blurb}</p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row" role="tablist" aria-label="Этапы темы">
            {STAGES.map((item, index) => {
              const open = unlocked(item.id);
              const current = stage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={current}
                  disabled={!open}
                  onClick={() => setStage(item.id)}
                  className={cn(
                    "tap flex h-12 flex-1 items-center gap-2 rounded-full border px-4 text-left text-sm font-medium",
                    current ? "border-teal bg-navy-3 text-teal" : "border-line-dark text-mist",
                  )}
                >
                  <span className="text-xs">{String(index + 1).padStart(2, "0")}</span>
                  <span className="truncate">{item.label}</span>
                  {!open ? <Lock className="ml-auto size-3.5 shrink-0" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>

          <div className="card mt-4 p-5 md:p-8">
            {stage === "theory" ? (
              <div>
                {topic.theory.map((block) => (
                  <section key={block.title} className="mt-8 first:mt-0">
                    <h2 className="text-xl font-semibold">{block.title}</h2>
                    {block.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="mt-3 text-sm leading-relaxed text-ink md:text-base">
                        {paragraph}
                      </p>
                    ))}
                    {block.bullets ? (
                      <ul className="mt-3 grid gap-2">
                        {block.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-ink">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {block.note ? (
                      <p className="mt-3 rounded-xl bg-teal-soft px-4 py-3 text-sm text-ink">{block.note}</p>
                    ) : null}
                  </section>
                ))}
                <Button
                  className="mt-8"
                  onClick={() => {
                    markTheory(key);
                    setStage("practice");
                  }}
                >
                  Перейти к практике
                </Button>
              </div>
            ) : null}

            {stage === "practice" ? (
              <div>
                <p className="text-sm text-muted">
                  Ответ фиксируется сразу. Рядом — верно это или нет и короткий разбор.
                </p>
                <div className="mt-5 grid gap-6">
                  {topic.practice.map((question, index) => (
                    <QuestionBlock
                      key={question.id}
                      index={index + 1}
                      question={question}
                      selected={rec.practice[question.id]}
                      reveal={Boolean(rec.practice[question.id])}
                      onSelect={
                        rec.practice[question.id]
                          ? undefined
                          : (choiceId) => markPractice(key, question.id, choiceId)
                      }
                    />
                  ))}
                </div>
                <Button className="mt-8" disabled={!practiceDone} onClick={() => setStage("quiz")}>
                  {practiceDone ? "К проверке темы" : "Ответьте на все вопросы практики"}
                </Button>
              </div>
            ) : null}

            {stage === "quiz" ? (
              <div>
                {quizResult ? (
                  <div>
                    <p className="text-sm font-semibold text-ok">Результат проверки</p>
                    <p className="mt-2 text-4xl font-semibold text-ink">
                      {quizResult.correct}
                      <span className="text-xl text-muted"> / {quizResult.total}</span>
                    </p>
                    <p className="mt-3 text-sm text-muted">
                      {rec.passed
                        ? "Тема зачтена: набрано не меньше 75%."
                        : "Порог — 75%. Вернитесь к теории и попробуйте ещё раз."}
                      {rec.bestPercent != null ? ` Лучший результат: ${rec.bestPercent}%.` : ""}
                    </p>
                    <div className="mt-6 grid gap-6">
                      {topic.quiz.map((question, index) => (
                        <QuestionBlock
                          key={question.id}
                          index={index + 1}
                          question={question}
                          selected={quizAnswers[question.id]}
                          reveal
                        />
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizResult(null);
                        }}
                      >
                        Пройти ещё раз
                      </Button>
                      {nextTopic ? (
                        <TopicLink
                          examId={examId}
                          subjectId={subject.id}
                          topicId={nextTopic.id}
                          className="tap inline-flex h-11 items-center rounded-full bg-teal px-5 text-sm font-semibold text-ink"
                        >
                          Следующая тема
                        </TopicLink>
                      ) : (
                        <SubjectLink
                          examId={examId}
                          subjectId={subject.id}
                          className="tap inline-flex h-11 items-center rounded-full bg-navy px-5 text-sm font-semibold text-mist"
                        >
                          К списку тем
                        </SubjectLink>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted">
                      Ответы скрыты до конца проверки. Нужно набрать не меньше 75%, чтобы тема считалась
                      пройденной.
                    </p>
                    <div className="mt-5 grid gap-6">
                      {topic.quiz.map((question, index) => (
                        <QuestionBlock
                          key={question.id}
                          index={index + 1}
                          question={question}
                          selected={quizAnswers[question.id]}
                          reveal={false}
                          onSelect={(choiceId) =>
                            setQuizAnswers((current) => ({ ...current, [question.id]: choiceId }))
                          }
                        />
                      ))}
                    </div>
                    <Button className="mt-8" onClick={finishQuiz}>
                      Завершить проверку
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="card h-fit p-5">
          <p className="text-xs font-semibold tracking-wide text-muted">СТАТУС ТЕМЫ</p>
          <p className="mt-2 text-lg font-semibold">{rec.passed ? "Завершено" : practiceUnlocked ? "В процессе" : "Не начато"}</p>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Теория</dt>
              <dd>{rec.theoryDone || rec.passed ? "изучена" : "ещё нет"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Практика</dt>
              <dd>
                {topic.practice.filter((question) => rec.practice[question.id]).length}/{topic.practice.length}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Проверка</dt>
              <dd>{rec.bestPercent == null ? "—" : `${rec.bestPercent}%`}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Время</dt>
              <dd>{topic.minutes} мин</dd>
            </div>
          </dl>
          <SubjectLink
            examId={examId}
            subjectId={subject.id}
            className="mt-5 inline-flex text-sm font-medium text-ok hover:text-ink"
          >
            Все темы предмета
          </SubjectLink>
        </aside>
      </div>
    </Page>
  );
}
