import { cn } from "@/lib/cn";
import type { Question } from "@/data/types";

export function QuestionBlock({
  index,
  question,
  selected,
  reveal,
  onSelect,
}: {
  index: number;
  question: Question;
  selected?: string;
  reveal: boolean;
  onSelect?: (choiceId: string) => void;
}) {
  const correctChoice = question.choices.find((choice) => choice.id === question.answer);
  const isCorrect = Boolean(selected) && selected === question.answer;

  return (
    <article className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold tracking-wide text-muted">Вопрос {index}</p>
      {question.passage ? (
        <div className="mt-3 rounded-xl border border-line bg-teal-soft/40 px-4 py-3">
          <p className="text-xs font-semibold text-ok">{question.passageTitle ?? "Текст"}</p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-ink">{question.passage}</p>
        </div>
      ) : null}
      <h3 className="mt-3 text-base font-semibold leading-snug text-ink">{question.prompt}</h3>
      <div role="radiogroup" aria-label={`Вопрос ${index}`} className="mt-3 grid gap-2">
        {question.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const showOk = reveal && choice.id === question.answer;
          const showBad = reveal && isSelected && choice.id !== question.answer;
          return (
            <button
              key={choice.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={reveal || !onSelect}
              onClick={() => onSelect?.(choice.id)}
              className={cn(
                "tap flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left text-sm leading-snug disabled:opacity-100",
                showOk && "border-ok bg-ok-soft",
                showBad && "border-bad bg-bad-soft",
                !showOk && !showBad && isSelected && "border-teal bg-teal-soft",
                !showOk && !showBad && !isSelected && "border-line bg-card hover:border-navy",
                reveal && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  showOk && "bg-ok text-card",
                  showBad && "bg-bad text-card",
                  !showOk && !showBad && isSelected && "bg-teal text-ink",
                  !showOk && !showBad && !isSelected && "bg-line text-ink",
                )}
              >
                {choice.id.toUpperCase()}
              </span>
              <span className="text-ink">{choice.text}</span>
            </button>
          );
        })}
      </div>
      {reveal ? (
        <div className={cn("mt-3 rounded-xl px-4 py-3 text-sm", isCorrect ? "bg-ok-soft" : "bg-bad-soft")}>
          <p className="font-semibold text-ink">
            {isCorrect ? "Верно" : selected ? "Неверно" : "Нет ответа"}
          </p>
          {!isCorrect && correctChoice ? (
            <p className="mt-1 text-ink">Правильный ответ: {correctChoice.text}</p>
          ) : null}
          <p className="mt-1 text-muted">{question.explanation}</p>
        </div>
      ) : null}
    </article>
  );
}
