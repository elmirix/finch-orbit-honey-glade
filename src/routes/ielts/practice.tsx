import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { createFileRoute, Link } from "@tanstack/react-router";

import {

  ArrowLeft,

  ArrowRight,

  CheckCircle2,

  Clock,

  RotateCcw,

  Send,

  Shuffle,

  Volume2,

  XCircle,

  Sparkles,

  Trophy,

} from "lucide-react";

import { LISTENING_PRACTICE_TESTS } from "@/data/ieltspractice/listening";

import { READING_PRACTICE_TESTS } from "@/data/ieltspractice/reading";

import type {

  PracticeModule,

  PracticeQuestion,

  PracticeSection,

  PracticeTest,

} from "@/data/ieltspractice/types";

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


const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const TWO_ANSWER_QUESTION_PAIRS = [[21, 22], [23, 24]] as const;

type ChoiceRenderItem =
  | { kind: "single"; question: PracticeQuestion }
  | { kind: "pair"; questions: [PracticeQuestion, PracticeQuestion] };


// Перевод сырых баллов (из 40) в IELTS Band Score

function getIELTSBand(correct: number): string {

  if (correct >= 39) return "9.0";

  if (correct >= 37) return "8.5";

  if (correct >= 35) return "8.0";

  if (correct >= 32) return "7.5";

  if (correct >= 30) return "7.0";

  if (correct >= 26) return "6.5";

  if (correct >= 23) return "6.0";

  if (correct >= 18) return "5.5";

  if (correct >= 16) return "5.0";

  return "4.5 или ниже";

}


type PracticeTimerProps = {
  initialSeconds: number;
  resetKey: number;
  paused: boolean;
  onExpire: () => void;
};

/** Keeps the one-second countdown isolated so the entire test does not rerender every second. */
function PracticeTimer({ initialSeconds, resetKey, paused, onExpire }: PracticeTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    expiredRef.current = false;
  }, [initialSeconds, resetKey]);

  useEffect(() => {
    if (paused) return;
    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [paused, resetKey]);

  useEffect(() => {
    if (secondsLeft === 0 && !paused && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current();
    }
  }, [secondsLeft, paused]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <span className={`practice-timer inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold text-white shadow-lg ${secondsLeft <= 300 ? "practice-timer-critical" : "border-white/10 bg-white/5"}`}>
      <Clock className="size-4 text-teal" />
      <span className="mr-1 text-[9px] font-black tracking-[0.18em] text-slate-400">TIME</span>
      <span className="tracking-widest tabular-nums">{formattedTime}</span>
    </span>
  );
}


export function IeltsPracticePage() {

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

  const [activePartIndex, setActivePartIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [submitted, setSubmitted] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [showScript, setShowScript] = useState(false);

  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const partNavigationRef = useRef<HTMLElement | null>(null);
  const activePartButtonRef = useRef<HTMLButtonElement | null>(null);

  const totalMinutes = tests.reduce((acc, t) => acc + t.durationMinutes, 0);


  useEffect(() => {
    setActiveTestIndex(0);
    setActivePartIndex(0);
    setAnswers({});
    setSubmitted(false);
    setShowModal(false);
    setTimerResetKey((key) => key + 1);
  }, [tests, totalMinutes]);

  // When a part changes, bring its content into view instead of leaving the user
  // at the old scroll position (especially important with the mobile bottom dock).
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

    // Keep the selected Part tab visible when navigating with the arrow buttons.
    const navigation = partNavigationRef.current;
    const activeButton = activePartButtonRef.current;
    if (navigation && activeButton) {
      const navRect = navigation.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      if (buttonRect.left < navRect.left) {
        navigation.scrollBy({ left: buttonRect.left - navRect.left - 12, behavior: reduceMotion ? "auto" : "smooth" });
      } else if (buttonRect.right > navRect.right) {
        navigation.scrollBy({ left: buttonRect.right - navRect.right + 12, behavior: reduceMotion ? "auto" : "smooth" });
      }
    }
    setShowScript(false);
  }, [activeTestIndex, activePartIndex]);

  useEffect(() => {
    if (!showModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showModal]);


  const currentTest = tests[activeTestIndex];

  const currentSection = currentTest.sections[activePartIndex] ?? currentTest.sections[0];

  const totalQuestions = tests.reduce(
    (total, test) => total + test.sections.reduce((partTotal, section) => partTotal + section.questions.length, 0),
    0,
  );
  const answeredCount = tests.reduce(
    (total, test) =>
      total + test.sections.reduce(
        (partTotal, section) =>
          partTotal + section.questions.filter((question) => Boolean((answers[question.id] ?? "").trim())).length,
        0,
      ),
    0,
  );
  const completion = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;




  const getTwoAnswerPair = (question: PracticeQuestion, section: PracticeSection) => {
    const pairNumbers = TWO_ANSWER_QUESTION_PAIRS.find(([first, second]) =>
      question.number === first || question.number === second,
    );
    if (!pairNumbers) return null;

    const first = section.questions.find((item) => item.number === pairNumbers[0]);
    const second = section.questions.find((item) => item.number === pairNumbers[1]);
    if (!first || !second || first.type !== "choice" || second.type !== "choice") return null;
    return [first, second] as [PracticeQuestion, PracticeQuestion];
  };

  const checkAnswer = (q: PracticeQuestion, section: PracticeSection) => {
    const rightAns = q.answer.trim().toUpperCase();
    const pair = getTwoAnswerPair(q, section);

    // Questions 21–22 and 23–24 are one shared "choose TWO" task.
    // Each selected letter earns the point for the matching question number.
    if (pair) {
      const selected = pair
        .map((item) => (answers[item.id] ?? "").trim().toUpperCase())
        .filter(Boolean);
      return selected.includes(rightAns);
    }

    const userAns = (answers[q.id] ?? "").trim().toUpperCase();
    return Boolean(userAns) && userAns === rightAns;
  };

  const scoreSummary = useMemo(() => {

    let correct = 0;

    let total = 0;

    for (const test of tests) {

      for (const section of test.sections) {

        for (const q of section.questions) {

          total += 1;

          if (checkAnswer(q, section)) correct += 1;

        }

      }

    }

    return { correct, total };

  }, [tests, answers]);


  const handleFinish = () => {

    setSubmitted(true);

    setShowModal(true);

  };


  const renderNotesWithInputs = (section: PracticeSection) => {

    if (!section.passage) return null;

    const lines = section.passage.split("\n");


    return (

      <div className="practice-notes-card space-y-3.5 rounded-3xl border border-teal/20 p-8 text-[15px] leading-relaxed shadow-xl transition-all">

        {lines.map((line, idx) => {

          if (line.startsWith("### ")) {

            return (

              <h3 key={idx} className="text-center text-xl font-extrabold text-white pt-2 pb-3 tracking-tight">

                {line.replace("### ", "")}

              </h3>

            );

          }

          if (line.startsWith("**") && line.endsWith("**")) {

            return (

              <h4 key={idx} className="pt-4 text-base font-bold text-teal tracking-wide uppercase text-xs">

                {line.replace(/\*\*/g, "")}

              </h4>

            );

          }

          if (!line.trim()) return <div key={idx} className="h-1.5" />;


          const parts = line.split(/(\{\{\d+\}\})/g);

          return (

            <div key={idx} className="flex flex-wrap items-center gap-y-2.5">

              {parts.map((part, pIdx) => {

                const match = part.match(/^\{\{(\d+)\}\}$/);

                if (!match) {

                  return (

                    <span key={pIdx} className="whitespace-pre-wrap font-medium">

                      {part}

                    </span>

                  );

                }


                const qNum = Number(match[1]);

                const q = section.questions.find((item) => item.number === qNum);

                if (!q) return null;


                const val = answers[q.id] ?? "";

                const isCorrect = checkAnswer(q, section);


                return (

                  <span key={pIdx} className="mx-2 inline-flex items-center gap-1.5">

                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-xl bg-navy text-xs font-bold text-teal shadow-sm">

                      {q.number}

                    </span>

                    <input

                      type="text"

                      disabled={submitted}

                      value={val}

                      onChange={(e) =>

                        setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))

                      }

                      placeholder="..."

                      className={`h-9 w-40 rounded-xl border px-3 text-sm font-semibold outline-none transition-all duration-300 shadow-inner ${

                        submitted

                          ? isCorrect

                            ? "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-emerald-200"

                            : "border-rose-500 bg-rose-50 text-rose-950 shadow-rose-200"

                          : "border-teal/30 bg-white/90 text-ink focus:border-teal focus:ring-4 focus:ring-teal/20"

                      }`}

                    />

                    {submitted && !isCorrect && (

                      <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-800">

                        ✓ {q.answer}

                      </span>

                    )}

                  </span>

                );

              })}

            </div>

          );

        })}


        {submitted && (

          <div className="mt-8 border-t border-teal/20 pt-6">

            <p className="mb-4 text-sm font-bold text-teal-200 flex items-center gap-2">

              <Sparkles className="size-4 text-teal" /> Разбор и цитаты из аудио:

            </p>

            <div className="space-y-3">

              {section.questions.map((q) => {

                const isCorrect = checkAnswer(q, section);

                return (

                  <div

                    key={q.id}

                    className={`rounded-2xl p-3.5 text-xs transition-all duration-300 ${

                      isCorrect

                        ? "bg-emerald-500/10 text-emerald-100 border border-emerald-400/20"

                        : "bg-rose-500/10 text-rose-100 border border-rose-400/20"

                    }`}

                  >

                    <span className="font-extrabold text-sm mr-2">

                      Q{q.number} <span className="text-xs font-semibold opacity-75">(верно: {q.answer})</span>:

                    </span>

                    <p className="mt-1 opacity-90 leading-relaxed">{q.explanation}</p>

                  </div>

                );

              })}

            </div>

          </div>

        )}

      </div>

    );

  };


  const choiceQuestions = currentSection.questions.filter((q) => q.type === "choice");

  const matrixQuestions = currentSection.questions.filter((q) => q.type === "matrix");

  const matchingQuestions = currentSection.questions.filter((q) => q.type === "matching");

  const choiceRenderItems: ChoiceRenderItem[] = (() => {
    const renderedNumbers = new Set<number>();
    const items: ChoiceRenderItem[] = [];

    for (const question of choiceQuestions) {
      if (renderedNumbers.has(question.number)) continue;
      const pairNumbers = TWO_ANSWER_QUESTION_PAIRS.find(([first, second]) =>
        question.number === first || question.number === second,
      );
      const pair = pairNumbers?.map((number) => choiceQuestions.find((item) => item.number === number));

      if (pairNumbers && pair?.[0] && pair[1]) {
        items.push({ kind: "pair", questions: [pair[0], pair[1]] });
        renderedNumbers.add(pairNumbers[0]);
        renderedNumbers.add(pairNumbers[1]);
      } else {
        items.push({ kind: "single", question });
        renderedNumbers.add(question.number);
      }
    }

    return items;
  })();

  const toggleTwoAnswerOption = (pair: [PracticeQuestion, PracticeQuestion], letter: string) => {
    setAnswers((previous) => {
      const selectedQuestion = pair.find(
        (question) => (previous[question.id] ?? "").trim().toUpperCase() === letter,
      );

      if (selectedQuestion) {
        const next = { ...previous };
        delete next[selectedQuestion.id];
        return next;
      }

      const selectedCount = pair.filter((question) => Boolean((previous[question.id] ?? "").trim())).length;
      if (selectedCount >= 2) return previous;

      const emptyQuestion = pair.find((question) => !(previous[question.id] ?? "").trim());
      if (!emptyQuestion) return previous;
      return { ...previous, [emptyQuestion.id]: letter };
    });
  };

  const isMatchingOptionUsed = (letter: string, exceptQuestionId?: string) =>
    matchingQuestions.some(
      (question) =>
        question.id !== exceptQuestionId &&
        (answers[question.id] ?? "").trim().toUpperCase() === letter.toUpperCase(),
    );

  const assignMatchingAnswer = (questionId: string, letter: string) => {
    setAnswers((previous) => {
      const normalizedLetter = letter.trim().toUpperCase();
      const alreadyUsed = matchingQuestions.some(
        (question) =>
          question.id !== questionId &&
          (previous[question.id] ?? "").trim().toUpperCase() === normalizedLetter,
      );
      if (normalizedLetter && alreadyUsed) return previous;

      const next = { ...previous };
      if (normalizedLetter) next[questionId] = normalizedLetter;
      else delete next[questionId];
      return next;
    });
  };

  const hasInlineNotes = Boolean(currentSection.passage && /\{\{\d+\}\}/.test(currentSection.passage));


  return (

    <Page className="ielts-practice-page relative isolate min-h-screen pb-56 text-mist sm:pb-40">

      <style>{`
        .ielts-practice-page {
          color: #edf5ff;
          background: radial-gradient(ellipse at 12% 0%, rgba(20, 184, 166, .13), transparent 34%), radial-gradient(ellipse at 88% 16%, rgba(56, 189, 248, .12), transparent 30%), linear-gradient(145deg, #070b16 0%, #0b1222 48%, #080d19 100%);
        }
        .ielts-practice-page::before {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; content: ""; opacity: .2;
          background-image: linear-gradient(rgba(148,163,184,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.10) 1px, transparent 1px);
          background-size: 54px 54px; mask-image: linear-gradient(to bottom, black, transparent 88%);
        }
        .ielts-practice-page > *:not(.practice-modal-backdrop) { position: relative; z-index: 1; }
        .practice-header, .practice-section-card, .practice-question-panel {
          box-shadow: 0 16px 44px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.045);
          animation: practice-rise .38s cubic-bezier(.2,.75,.25,1) both;
        }
        .practice-header { background: linear-gradient(135deg, rgba(17,28,49,.88), rgba(12,20,37,.78)); }
        .practice-header::after {
          position: absolute; inset: 0; content: ""; pointer-events: none; opacity: .45;
          background: linear-gradient(112deg, transparent 18%, rgba(255,255,255,.055) 38%, transparent 58%); transform: translateX(-100%);
        }
        .practice-orb { pointer-events: none; filter: blur(38px); opacity: .55; animation: none; }
        .practice-orb-two { animation: none; }
        .practice-eyebrow, .practice-overview-kicker { display: inline-flex; align-items: center; gap: 9px; color: #75e7d8; font-size: 9px; font-weight: 900; letter-spacing: .22em; }
        .practice-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #5eead4; box-shadow: 0 0 0 4px rgba(94,234,212,.12), 0 0 18px rgba(94,234,212,.8); animation: none; }
        .practice-back-icon { box-shadow: inset 0 1px 0 rgba(255,255,255,.08); }
        .practice-back-link:hover .practice-back-icon { transform: translateX(-3px); background: rgba(45,212,191,.12); }
        .practice-timer { min-width: 116px; justify-content: center; border-color: rgba(45,212,191,.22); background: rgba(5,12,25,.76); box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 8px 24px rgba(0,0,0,.22); font-variant-numeric: tabular-nums; }
        .practice-timer-critical { border-color: rgba(251,113,133,.48); background: rgba(136,19,55,.2); color: #fecdd3; animation: none; }
        .practice-random-badge { box-shadow: inset 0 1px 0 rgba(255,255,255,.08); }
        .practice-test-tab { border-color: rgba(148,163,184,.13); background: rgba(15,23,42,.68); color: #cbd5e1; box-shadow: 0 8px 24px rgba(0,0,0,.12); }
        .practice-test-tab:hover { transform: translateY(-2px); border-color: rgba(45,212,191,.45); background: rgba(20,184,166,.09); }
        .practice-overview { position: relative; display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 22px 28px; align-items: end; overflow: hidden; padding: 26px 28px 22px; border: 1px solid rgba(148,163,184,.13); border-radius: 28px; background: linear-gradient(120deg, rgba(18,31,53,.94), rgba(12,22,40,.82)); box-shadow: 0 22px 60px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.05); animation: practice-rise .72s .06s cubic-bezier(.2,.75,.25,1) both; }
        .practice-overview::before { position:absolute; right:-70px; top:-130px; width:300px; height:300px; border-radius:50%; content:""; background: radial-gradient(circle, rgba(45,212,191,.18), transparent 68%); pointer-events:none; }
        .practice-overview-copy, .practice-overview-stats { position: relative; z-index: 1; }
        .practice-overview-kicker { color: #7ddfd1; letter-spacing: .18em; }
        .practice-overview-copy h2 { margin-top: 10px; color:#f8fafc; font-size: clamp(1.45rem, 3vw, 2.15rem); line-height:1.1; font-weight:900; letter-spacing:-.045em; }
        .practice-overview-copy h2 span { color:#5eead4; }
        .practice-overview-copy p { max-width: 570px; margin-top: 9px; color:#93a4bd; font-size:13px; line-height:1.65; }
        .practice-overview-stats { display:flex; gap: clamp(18px, 4vw, 42px); align-items:flex-end; }
        .practice-stat { display:flex; flex-direction:column; gap:7px; }
        .practice-stat > span { color:#71839d; font-size:8px; font-weight:900; letter-spacing:.16em; white-space:nowrap; }
        .practice-stat strong { color:#f8fafc; font-size:26px; line-height:1; font-weight:900; letter-spacing:-.04em; font-variant-numeric:tabular-nums; }
        .practice-stat small { color:#8294ad; font-size:13px; font-weight:700; letter-spacing:0; }
        .practice-progress-track { position:relative; z-index:1; grid-column:1/-1; height:6px; overflow:hidden; border-radius:99px; background:rgba(148,163,184,.13); }
        .practice-progress-track span { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,#2dd4bf,#38bdf8 65%,#a78bfa); box-shadow:0 0 18px rgba(45,212,191,.55); transition:width .55s cubic-bezier(.2,.8,.2,1); }
        .practice-section-card { border-color:rgba(148,163,184,.13); background:linear-gradient(145deg,rgba(18,29,50,.9),rgba(12,21,39,.82)); }
        .practice-audio-card { background:rgba(3,9,20,.48); }
        .practice-audio-card audio { filter: saturate(.9); }
        .practice-passage-card { box-shadow:0 24px 60px rgba(0,0,0,.16); }
        .practice-notes-card {
          position:relative;
          isolation:isolate;
          overflow:hidden;
          color:#e7eef9;
          border-color:rgba(94,234,212,.22);
          background:
            radial-gradient(ellipse at 100% 0%, rgba(45,212,191,.13), transparent 38%),
            radial-gradient(ellipse at 0% 100%, rgba(56,189,248,.09), transparent 42%),
            linear-gradient(145deg, rgba(17,28,49,.98) 0%, rgba(10,18,33,.98) 62%, rgba(11,31,42,.98) 100%);
          box-shadow:0 24px 60px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.055), 0 0 32px rgba(45,212,191,.045);
        }
        .practice-notes-card::before {
          position:absolute;
          inset:0;
          z-index:-1;
          content:"";
          pointer-events:none;
          opacity:.55;
          background:linear-gradient(115deg, transparent 15%, rgba(255,255,255,.035) 46%, transparent 70%);
        }
        .practice-question-panel { border-color:rgba(148,163,184,.13); background:linear-gradient(145deg,rgba(18,29,50,.88),rgba(12,21,39,.82)); }
        .practice-question-item { border-color:rgba(148,163,184,.12); }
        .practice-option { background:rgba(6,14,28,.42); border-color:rgba(148,163,184,.15); }
        .practice-option:hover { transform:translateX(4px); border-color:rgba(45,212,191,.48); background:rgba(20,184,166,.07); box-shadow:0 10px 24px rgba(0,0,0,.14); }
        .practice-option:has(input:checked) { border-color:rgba(45,212,191,.72); background:linear-gradient(100deg,rgba(20,184,166,.16),rgba(56,189,248,.07)); box-shadow:0 0 0 1px rgba(45,212,191,.12),0 12px 28px rgba(20,184,166,.08); }
        .practice-option:focus-within { outline:2px solid rgba(94,234,212,.65); outline-offset:3px; }
        .practice-map-image { box-shadow:0 14px 36px rgba(0,0,0,.2); }
        .practice-match-question { background:rgba(5,12,24,.5); }
        .practice-dropzone { min-width:min(12rem,100%); }
        .practice-match-option { background:linear-gradient(110deg,rgba(30,41,59,.84),rgba(15,23,42,.84)); }
        .practice-match-option:hover { transform:translateY(-2px); box-shadow:0 12px 24px rgba(0,0,0,.2); }
        .practice-transcript { background:rgba(12,21,39,.9); }
        .practice-dock { box-shadow:0 -14px 38px rgba(0,0,0,.34); padding-bottom:calc(12px + env(safe-area-inset-bottom)); }
        .practice-dock-inner { display:flex; align-items:center; gap:18px; }
        .practice-part-navigation { display:flex; flex:1 1 auto; min-width:0; align-items:center; gap:8px; overflow-x:auto; overscroll-behavior-x:contain; -webkit-overflow-scrolling:touch; touch-action:pan-x; scrollbar-width:thin; scrollbar-color:rgba(45,212,191,.3) transparent; padding:3px 2px 6px; }
        .practice-part-tab { flex:0 0 auto; display:inline-flex; align-items:center; justify-content:space-between; gap:12px; min-height:42px; border:1px solid rgba(148,163,184,.14); border-radius:14px; background:rgba(15,23,42,.68); padding:9px 13px; color:#e2e8f0; font-size:12px; font-weight:800; transition:border-color .18s ease,background .18s ease,color .18s ease; }
        .practice-part-tab[aria-current="step"] { border-color:rgba(45,212,191,.65); background:rgba(20,184,166,.16); color:#fff; box-shadow:inset 0 0 0 1px rgba(45,212,191,.1); }
        .practice-part-tab:hover { border-color:rgba(45,212,191,.4); }
        .practice-part-count { color:#94a3b8; font-size:10px; font-weight:700; white-space:nowrap; }
        .practice-dock-actions { display:flex; flex:0 0 auto; align-items:center; gap:12px; }
        .practice-dock-stepper { display:flex; align-items:center; gap:7px; }
        .practice-dock-current { min-width:58px; color:#94a3b8; font-size:10px; font-weight:800; text-align:center; white-space:nowrap; }
        .practice-match-select { width:100%; min-width:0; min-height:42px; appearance:auto; border:1px solid rgba(45,212,191,.35); border-radius:12px; background:#0b1729; padding:9px 11px; color:#ecfeff; font-size:13px; }
        .practice-match-select:focus { outline:2px solid rgba(94,234,212,.55); outline-offset:2px; }
        .practice-submit-button { position:relative; overflow:hidden; box-shadow:0 8px 28px rgba(45,212,191,.2); transition:transform .25s ease, box-shadow .25s ease, filter .25s ease; }
        .practice-submit-button::before { position:absolute; inset:0; content:""; background:linear-gradient(110deg,transparent 20%,rgba(255,255,255,.32) 48%,transparent 72%); transform:translateX(-130%); transition:transform .65s ease; }
        .practice-submit-button:hover { transform:translateY(-2px); box-shadow:0 14px 34px rgba(45,212,191,.3); filter:saturate(1.12); }
        .practice-submit-button:hover::before { transform:translateX(130%); }
        .practice-modal-backdrop { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; overflow-y:auto; padding:calc(16px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom)); background:rgba(1,5,14,.84); backdrop-filter:blur(8px); animation:practice-fade .18s ease both; }
        .practice-modal-card { width:100%; max-width:32rem; max-height:calc(100dvh - 32px - env(safe-area-inset-top) - env(safe-area-inset-bottom)); overflow-y:auto; margin:auto; background:radial-gradient(circle at 50% 0%,rgba(20,184,166,.16),transparent 42%),linear-gradient(150deg,rgba(15,27,48,.98),rgba(4,9,19,.99)); box-shadow:0 28px 70px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.08); animation:practice-pop .28s cubic-bezier(.16,1,.3,1) both; }
        .practice-trophy { animation:none; }
        .practice-confetti-piece { animation:practice-confetti-fall 2.6s ease-in calc(var(--i, 0) * 18ms) 1 both; }
        .practice-confetti-piece:nth-child(3n) { border-radius:2px; }
        @keyframes practice-rise { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes practice-fade { from { opacity:0; } to { opacity:1; } }
        @keyframes practice-pop { from { opacity:0; transform:translateY(18px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes practice-float { from { transform:translate3d(0,0,0) scale(.94); } to { transform:translate3d(-22px,18px,0) scale(1.08); } }
        @keyframes practice-pulse { 0%,100% { opacity:1; box-shadow:0 0 0 4px rgba(94,234,212,.1),0 0 18px rgba(94,234,212,.7); } 50% { opacity:.65; box-shadow:0 0 0 7px rgba(94,234,212,.03),0 0 8px rgba(94,234,212,.35); } }
        @keyframes practice-sheen { 0%,62%,100% { transform:translateX(-120%); } 82% { transform:translateX(120%); } }
        @keyframes practice-timer-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(251,113,133,.0); } 50% { box-shadow:0 0 0 5px rgba(251,113,133,.09); } }
        @keyframes practice-trophy-float { 0%,100% { transform:translateY(0) rotate(-2deg); } 50% { transform:translateY(-6px) rotate(2deg); } }
        @keyframes practice-confetti-fall { 0% { transform:translate3d(0,-5vh,0) rotate(0); opacity:0; } 12% { opacity:1; } 100% { transform:translate3d(22px,110vh,0) rotate(540deg); opacity:0; } }
        @media (max-width: 767px) {
          .practice-overview { grid-template-columns:1fr; gap:18px; padding:22px 20px 18px; }
          .practice-overview-stats { justify-content:space-between; }
          .practice-stat strong { font-size:23px; }
          .practice-eyebrow { font-size:8px; }
          .practice-overview-copy p { font-size:12px; }
          .practice-dock { padding:9px 12px calc(9px + env(safe-area-inset-bottom)); }
          .practice-dock-inner { display:grid; grid-template-columns:minmax(0,1fr); gap:8px; }
          .practice-part-navigation { width:100%; gap:7px; padding:1px 1px 5px; scroll-snap-type:x proximity; }
          .practice-part-tab { min-width:100px; min-height:40px; padding:8px 11px; scroll-snap-align:start; }
          .practice-part-count { font-size:9px; }
          .practice-dock-actions { width:100%; justify-content:space-between; gap:8px; }
          .practice-dock-stepper { gap:6px; }
          .practice-dock-stepper button { width:38px; height:38px; }
          .practice-dock-current { font-size:9px; min-width:52px; }
          .practice-submit-button, .practice-dock-result { min-height:40px; padding-left:15px; padding-right:15px; font-size:12px; }
          .practice-confetti-piece { display:none; }
          .practice-modal-backdrop { align-items:flex-start; padding-top:max(14px, env(safe-area-inset-top)); }
          .practice-modal-card { margin:auto 0; padding:22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ielts-practice-page *, .ielts-practice-page *::before, .ielts-practice-page *::after,
          .practice-modal-backdrop, .practice-modal-backdrop * { animation:none !important; scroll-behavior:auto !important; transition:none !important; }
        }
      `}</style>

      {/* Верхняя анимированная плавная панель волн */}

      <div className="practice-header relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-2xl sm:p-7">

        <div className="practice-orb practice-orb-one absolute -right-16 -top-16 size-64 rounded-full bg-teal/15 blur-3xl" />

        <div className="practice-orb practice-orb-two absolute -bottom-20 -left-16 size-72 rounded-full bg-sky-500/15 blur-3xl" />


        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="mb-1 flex w-full items-center justify-between gap-3">
            <span className="practice-eyebrow"><span className="practice-live-dot" /> IELTS PRACTICE STUDIO</span>
            <span className="hidden text-[10px] font-bold tracking-[0.24em] text-slate-500 sm:block">FOCUS MODE · {mode === "full" ? "FULL MOCK" : "SINGLE MODULE"}</span>
          </div>

          <Link

            to="/ielts"

            className="practice-back-link group inline-flex items-center gap-2.5 text-sm font-semibold text-mist transition-colors duration-300 hover:text-teal"

          >

            <span className="practice-back-icon flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all group-hover:border-teal/50">

              <ArrowLeft className="size-4 text-teal" />

            </span>

            Назад к IELTS

          </Link>


          <div className="flex items-center gap-4">

            {random && (

              <span className="practice-random-badge inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3.5 py-2 text-xs font-bold text-teal shadow-inner">

                <Shuffle className="size-3.5" />

                Случайный вариант

              </span>

            )}

            <PracticeTimer
              initialSeconds={totalMinutes * 60}
              resetKey={timerResetKey}
              paused={submitted}
              onExpire={() => {
                setSubmitted(true);
                setShowModal(true);
              }}
            />

          </div>

        </div>

      </div>


      {tests.length > 1 && (

        <div className="practice-test-tabs mb-6 flex flex-wrap gap-2.5">

          {tests.map((t, idx) => (

            <button

              key={t.id}

              type="button"

              onClick={() => {

                setActiveTestIndex(idx);

                setActivePartIndex(0);

              }}

              className={`practice-test-tab rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-300 shadow-lg ${

                activeTestIndex === idx

                  ? "bg-teal text-ink shadow-teal/30 scale-105"

                  : "bg-navy-3 border border-teal/20 text-mist hover:text-teal hover:border-teal/50"

              }`}

            >

              {idx + 1}. {t.title}

            </button>

          ))}

        </div>

      )}


      {/* Practice progress overview */}

      <section className="practice-overview mb-6" aria-label="Practice progress">
        <div className="practice-overview-copy">
          <span className="practice-overview-kicker"><Sparkles className="size-3.5" /> YOUR NEXT BAND STARTS HERE</span>
          <h2>Make every answer count<span>.</span></h2>
          <p>Stay focused, track your progress, and turn every practice session into measurable improvement.</p>
        </div>
        <div className="practice-overview-stats">
          <div className="practice-stat">
            <span>ANSWERS COMPLETED</span>
            <strong>{answeredCount}<small> / {totalQuestions}</small></strong>
          </div>
          <div className="practice-stat">
            <span>YOUR PROGRESS</span>
            <strong>{completion}<small>%</small></strong>
          </div>
        </div>
        <div className="practice-progress-track" role="progressbar" aria-label="Question completion" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${completion}%` }} />
        </div>
      </section>

      {showModal && typeof document !== "undefined" && createPortal(

        <div className="practice-modal-backdrop" role="presentation">

          <div className="practice-confetti pointer-events-none fixed inset-0 overflow-hidden">

            {Array.from({ length: 24 }).map((_, i) => (

              <span

                key={i}

                style={{

                  left: `${(i * 17) % 100}%`,

                  animationDelay: `${(i % 15) * -0.23}s`,

                  backgroundColor: ["#2dd4bf", "#38bdf8", "#facc15", "#f472b6", "#4ade80"][

                    i % 5

                  ],

                }}

                className="practice-confetti-piece absolute -top-6 h-3.5 w-2.5 rounded-full opacity-95 shadow-lg"

              />

            ))}

          </div>


          <div className="practice-modal-card relative z-10 rounded-[2rem] border border-teal/30 bg-slate-950/95 p-7 text-mist shadow-2xl sm:p-9" role="dialog" aria-modal="true" aria-labelledby="practice-result-title">

            <div className="text-center">

              <span className="practice-trophy mx-auto mb-4 inline-flex size-20 items-center justify-center rounded-[1.7rem] border border-teal/30 bg-teal/10 text-teal shadow-xl shadow-teal/10">

                <Trophy className="size-10" />

              </span>

              <p id="practice-result-title" className="text-xs font-black uppercase tracking-widest text-teal">
                РЕЗУЛЬТАТ ТРЕНИРОВКИ
              </p>


              <div className="mt-4 flex items-center justify-center gap-3">

                <span className="text-5xl font-black text-white tracking-tight">

                  Band {getIELTSBand(scoreSummary.correct)}

                </span>

              </div>

              <p className="mt-2 text-sm font-semibold text-mist/90">

                Правильных ответов: <span className="text-teal font-bold">{scoreSummary.correct}</span> из {scoreSummary.total}

              </p>


              <p className="mt-3 text-xs text-mist/70 bg-navy-3/60 border border-teal/10 p-3 rounded-2xl">

                {scoreSummary.correct >= 35

                  ? "🔥 Феноменальный уровень! Вы готовы сдавать экзамен на самый высокий балл."

                  : scoreSummary.correct >= 26

                  ? "💪 Отличный результат! Проработайте ошибки, чтобы закрепить успех."

                  : "📚 Хорошая тренировка. Внимательно изучите разбор и попробуйте улучшить результат."}

              </p>

            </div>


            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

              <button

                type="button"

                onClick={() => setShowModal(false)}

                className="tap inline-flex h-13 flex-1 items-center justify-center rounded-2xl bg-teal px-6 text-sm font-bold text-ink transition-all hover:bg-teal/90 hover:scale-[1.02] shadow-lg shadow-teal/20"

              >

                Разобрать ответы

              </button>

              <button

                type="button"

                onClick={() => {

                  setAnswers({});

                  setSubmitted(false);

                  setShowModal(false);

                  setActivePartIndex(0);
                  setTimerResetKey((key) => key + 1);

                }}

                className="tap inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-navy-3 border border-teal/30 px-6 text-sm font-bold text-mist transition-all hover:text-teal hover:border-teal"

              >

                <RotateCcw className="size-4 text-teal" />

                Заново

              </button>

            </div>

          </div>

        </div>,
        document.body,
      )}


      {/* Карточка текущей части */}

      <div className="practice-section-card rounded-[2rem] border border-white/10 bg-slate-900/65 p-6 shadow-xl sm:p-8">

        <div className="flex flex-wrap items-center justify-between gap-2">

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal">

              {currentTest.title}

            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{currentSection.title}</h1>

          </div>

          <span className="rounded-xl bg-teal/10 border border-teal/30 px-3.5 py-1.5 text-xs font-bold text-teal">

            Часть {activePartIndex + 1} из {currentTest.sections.length}

          </span>

        </div>


        <p className="mt-3 whitespace-pre-line text-sm text-mist/80 font-medium">

          {currentSection.instruction}

        </p>


        {currentSection.audioUrl && (

          <div className="practice-audio-card mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-inner">

            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-teal">

              <Volume2 className="size-4" />

              Аудиодорожка к заданию

            </div>

            <audio

              key={currentSection.audioUrl}

              controls

              src={currentSection.audioUrl}

              className="w-full rounded-xl accent-teal"

            />

          </div>

        )}

      </div>


      {/* КОНТЕНТ */}

      <div className="mt-6 space-y-6">

        {currentSection.passage && !hasInlineNotes && (

          <div className="practice-passage-card rounded-[1.7rem] border border-white/70 bg-white p-7 text-sm font-medium leading-relaxed text-slate-800 shadow-2xl shadow-black/10">

            {currentSection.passage}

          </div>

        )}


        {hasInlineNotes && renderNotesWithInputs(currentSection)}


        {/* Single-choice questions and shared two-answer groups */}
        {choiceQuestions.length > 0 && (
          <div className="practice-question-panel space-y-5 rounded-[2rem] border border-white/10 bg-slate-900/65 p-6 shadow-xl sm:p-7">
            {choiceRenderItems.map((item) => {
              if (item.kind === "pair") {
                const pair = item.questions;
                const [firstQuestion, secondQuestion] = pair;
                const selectedLetters = new Set(
                  pair
                    .map((question) => (answers[question.id] ?? "").trim().toUpperCase())
                    .filter(Boolean),
                );
                const options = firstQuestion.options?.length
                  ? firstQuestion.options
                  : secondQuestion.options ?? [];
                const pairIsCorrect = pair.every((question) => checkAnswer(question, currentSection));

                return (
                  <section
                    key={`multi-${firstQuestion.number}-${secondQuestion.number}`}
                    className="practice-question-item rounded-2xl border border-teal/20 bg-slate-950/35 p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex min-h-8 items-center justify-center rounded-xl border border-teal/40 bg-navy px-3 text-xs font-black text-teal">
                          {firstQuestion.number}–{secondQuestion.number}
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.12em] text-teal">
                          Выберите два варианта
                        </span>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${selectedLetters.size === 2 ? "border-teal/50 bg-teal/10 text-teal" : "border-white/10 bg-white/5 text-slate-400"}`}>
                        {selectedLetters.size} / 2 выбрано
                      </span>
                    </div>

                    <p className="mt-4 text-base font-bold leading-relaxed text-white">
                      {firstQuestion.prompt}
                    </p>
                    {secondQuestion.prompt !== firstQuestion.prompt && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {secondQuestion.prompt}
                      </p>
                    )}

                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {options.map((option, index) => {
                        const letter = LETTERS[index];
                        const isSelected = selectedLetters.has(letter);
                        const isLocked = submitted || (!isSelected && selectedLetters.size >= 2);
                        const cleanText = option.replace(/^[A-H]\.\s*/, "");

                        return (
                          <label
                            key={letter}
                            className={`practice-option flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                              isSelected
                                ? "border-teal bg-teal/10 font-bold text-white shadow-md shadow-teal/10"
                                : "border-white/10 bg-slate-950/50 text-slate-200"
                            } ${isLocked ? "cursor-not-allowed opacity-65" : "cursor-pointer"}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isLocked}
                              onChange={() => toggleTwoAnswerOption(pair, letter)}
                              className="size-4 shrink-0 accent-teal"
                              aria-label={`Вариант ${letter}`}
                            />
                            <span className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${isSelected ? "bg-teal text-ink" : "border border-teal/30 bg-navy text-teal"}`}>
                              {letter}
                            </span>
                            <span className="flex-1">{cleanText}</span>
                          </label>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className={`mt-4 space-y-3 rounded-xl border p-4 text-xs ${pairIsCorrect ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100" : "border-rose-500/25 bg-rose-500/10 text-rose-100"}`}>
                        <p className="font-extrabold text-sm">
                          {pairIsCorrect ? "Верно! Оба ответа правильные." : `Правильные варианты: ${pair.map((question) => question.answer).join(", ")}`}
                        </p>
                        {pair.map((question) => (
                          <p key={question.id} className="leading-relaxed">
                            <strong>Q{question.number}:</strong> {question.explanation}
                          </p>
                        ))}
                      </div>
                    )}
                  </section>
                );
              }

              const question = item.question;
              const userVal = answers[question.id] ?? "";
              const isCorrect = checkAnswer(question, currentSection);

              return (
                <div key={question.id} className="practice-question-item border-b border-white/8 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-3 text-base font-bold text-white">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-xl bg-navy border border-teal/40 text-xs font-extrabold text-teal">
                      {question.number}
                    </span>
                    <span className="leading-snug">{question.prompt}</span>
                  </div>

                  <div className="mt-4 space-y-2.5 pl-10">
                    {(question.options ?? []).map((option, optionIndex) => {
                      const letter = LETTERS[optionIndex];
                      const cleanText = option.replace(/^[A-E]\.\s*/, "");
                      const isSelected = userVal.toUpperCase() === letter;

                      return (
                        <label
                          key={letter}
                          className={`practice-option flex cursor-pointer items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-sm transition-all duration-300 ${
                            isSelected
                              ? "border-teal bg-teal/10 text-white font-bold shadow-md shadow-teal/10"
                              : "border-teal/15 bg-navy/40 text-mist hover:border-teal/40 hover:bg-navy/70"
                          }`}
                        >
                          <span className={`inline-flex size-7 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${isSelected ? "bg-teal text-ink shadow-sm" : "bg-navy-3 text-teal border border-teal/30"}`}>
                            {letter}
                          </span>
                          <input
                            type="radio"
                            name={question.id}
                            disabled={submitted}
                            checked={isSelected}
                            onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: letter }))}
                            className="sr-only"
                          />
                          <span className="flex-1">{cleanText}</span>
                        </label>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className={`mt-4 ml-10 rounded-2xl p-4 text-xs ${isCorrect ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30" : "bg-rose-500/15 text-rose-200 border border-rose-500/30"}`}>
                      {isCorrect ? (
                        <span className="mb-1 flex items-center gap-1.5 text-sm font-extrabold text-emerald-300">
                          <CheckCircle2 className="size-4" /> Верно!
                        </span>
                      ) : (
                        <span className="mb-1 flex items-center gap-1.5 text-sm font-extrabold text-rose-300">
                          <XCircle className="size-4" /> Ошибка. Правильный ответ: {question.answer}
                        </span>
                      )}
                      <p className="mt-1 leading-relaxed opacity-90">{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Matrix Q16-20 (Farley House Map) */}

        {matrixQuestions.length > 0 && (

          <div className="practice-question-panel rounded-[2rem] border border-white/10 bg-slate-900/65 p-6 shadow-xl sm:p-7">

            <h3 className="mb-5 text-lg font-black text-white">Farley House Map Matrix</h3>

            <div className="grid items-start gap-6 lg:grid-cols-12">

              {currentSection.imageUrl && (

                <div className="practice-map-image lg:col-span-6 overflow-hidden rounded-2xl border border-white/10 bg-white p-3 shadow-lg">

                  <img

                    src={currentSection.imageUrl}

                    alt="Farley House Map"

                    className="h-auto w-full object-contain rounded-xl"

                  />

                </div>

              )}


              <div className={currentSection.imageUrl ? "lg:col-span-6 overflow-x-auto" : "lg:col-span-12 overflow-x-auto"}>

                <table className="w-full border-collapse border border-teal/20 text-sm">

                  <thead>

                    <tr className="bg-navy border-b border-teal/30">

                      <th className="border border-teal/20 p-3 text-left font-bold text-teal">Вопрос</th>

                      {(currentSection.sharedOptions ?? LETTERS).map((colLetter) => (

                        <th

                          key={colLetter}

                          className="border border-teal/20 p-2 text-center font-black text-white"

                        >

                          {colLetter}

                        </th>

                      ))}

                    </tr>

                  </thead>

                  <tbody>

                    {matrixQuestions.map((q) => {

                      const userVal = (answers[q.id] ?? "").toUpperCase();

                      const isCorrect = checkAnswer(q, currentSection);


                      return (

                        <tr key={q.id} className="hover:bg-navy/50 transition-colors">

                          <td className="border border-teal/20 p-3 font-semibold text-white">

                            <span className="mr-2 inline-flex h-6 min-w-6 items-center justify-center rounded-lg bg-navy border border-teal/40 text-xs font-bold text-teal">

                              {q.number}

                            </span>

                            {q.prompt}

                          </td>

                          {(currentSection.sharedOptions ?? LETTERS).map((colLetter) => {

                            const checked = userVal === colLetter;

                            return (

                              <td

                                key={colLetter}

                                onClick={() => {

                                  if (!submitted) {

                                    setAnswers((prev) => ({ ...prev, [q.id]: colLetter }));

                                  }

                                }}

                                className={`cursor-pointer border border-teal/20 p-2 text-center transition-all ${

                                  submitted && colLetter === q.answer

                                    ? "bg-emerald-500/20"

                                    : submitted && checked && !isCorrect

                                    ? "bg-rose-500/20"

                                    : checked

                                    ? "bg-teal/20"

                                    : ""

                                }`}

                              >

                                <input

                                  type="radio"

                                  name={q.id}

                                  disabled={submitted}

                                  checked={checked}

                                  onChange={() =>

                                    setAnswers((prev) => ({ ...prev, [q.id]: colLetter }))

                                  }

                                  className="size-4 accent-teal cursor-pointer"

                                />

                              </td>

                            );

                          })}

                        </tr>

                      );

                    })}

                  </tbody>

                </table>


                {submitted && (

                  <div className="mt-5 space-y-3">

                    {matrixQuestions.map((q) => {

                      const isCorrect = checkAnswer(q, currentSection);

                      return (

                        <div

                          key={q.id}

                          className={`rounded-2xl p-3 text-xs ${

                            isCorrect

                              ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"

                              : "bg-rose-500/10 text-rose-200 border border-rose-500/20"

                          }`}

                        >

                          <span className="font-extrabold text-sm mr-2">

                            Q{q.number} <span className="opacity-75">(ответ: {q.answer})</span>:

                          </span>

                          {q.explanation}

                        </div>

                      );

                    })}

                  </div>

                )}

              </div>

            </div>

          </div>

        )}


        {/* Matching Q25-30 Opinions */}

        {matchingQuestions.length > 0 && (

          <div className="practice-question-panel rounded-[2rem] border border-white/10 bg-slate-900/65 p-6 shadow-xl sm:p-7">

            <h3 className="mb-5 text-lg font-black text-white">

              {currentSection.sharedOptionsTitle ?? "Opinions Match"}

            </h3>


            <div className="grid items-start gap-8 lg:grid-cols-12">

              <div className="space-y-4 lg:col-span-6">

                {matchingQuestions.map((q) => {

                  const userVal = (answers[q.id] ?? "").toUpperCase();

                  const isCorrect = checkAnswer(q, currentSection);

                  const matchedFullOption = (currentSection.sharedOptions ?? []).find((opt) =>

                    opt.startsWith(`${userVal}.`)

                  );


                  return (

                    <div key={q.id} className="space-y-2">

                      <div className="practice-match-question flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-white/10 bg-slate-950/55 p-3.5 text-sm font-semibold text-white">

                        <span>• {q.prompt}</span>

                        <div className="flex w-full flex-col gap-2 sm:w-auto">
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (!submitted && draggedLetter) {
                                assignMatchingAnswer(q.id, draggedLetter);
                                setDraggedLetter(null);
                              }
                            }}
                            className={`practice-dropzone hidden min-h-10 min-w-48 items-center gap-2 rounded-xl border border-dashed px-3 py-1 text-xs transition-all md:inline-flex ${
                              submitted
                                ? isCorrect
                                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-200"
                                  : "border-rose-500 bg-rose-500/20 text-rose-200"
                                : userVal
                                  ? "border-teal bg-teal/20 font-bold text-teal"
                                  : "border-teal/30 bg-navy text-mist/60"
                            }`}
                          >
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-lg bg-navy border border-teal/40 text-[10px] font-black text-teal">
                              {q.number}
                            </span>
                            <span className="flex-1 truncate">{matchedFullOption || "Drop answer here"}</span>
                            {!submitted && userVal && (
                              <button
                                type="button"
                                aria-label={`Очистить ответ ${q.number}`}
                                onClick={() => setAnswers((prev) => {
                                  const copy = { ...prev };
                                  delete copy[q.id];
                                  return copy;
                                })}
                                className="ml-auto text-mist/50 hover:text-rose-400 font-bold"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          <select
                            className={`practice-match-select md:hidden ${submitted ? (isCorrect ? "border-emerald-500 text-emerald-200" : "border-rose-500 text-rose-200") : ""}`}
                            value={userVal}
                            disabled={submitted}
                            aria-label={`Ответ для вопроса ${q.number}`}
                            onChange={(event) => assignMatchingAnswer(q.id, event.target.value)}
                          >
                            <option value="">Выберите вариант для вопроса {q.number}</option>
                            {(currentSection.sharedOptions ?? []).map((option) => (
                              <option
                                key={option}
                                value={option.charAt(0)}
                                disabled={isMatchingOptionUsed(option.charAt(0), q.id)}
                              >
                                {option}{isMatchingOptionUsed(option.charAt(0), q.id) ? " · уже использован" : ""}
                              </option>
                            ))}
                          </select>
                        </div>

                      </div>


                      {submitted && (

                        <div

                          className={`rounded-xl p-2.5 text-xs ${

                            isCorrect

                              ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"

                              : "bg-rose-500/10 text-rose-200 border border-rose-500/20"

                          }`}

                        >

                          <span className="font-extrabold">Ответ: {q.answer}. </span>

                          {q.explanation}

                        </div>

                      )}

                    </div>

                  );

                })}

              </div>


              <div className="hidden rounded-2xl border border-teal/20 bg-navy/80 p-5 shadow-inner md:block lg:col-span-6">

                <p className="mb-4 text-xs italic text-teal/80">
                  💡 Каждый вариант можно использовать только один раз. На телефоне выберите ответ в меню под вопросом; на компьютере перетащите вариант в нужный блок.
                </p>

                <div className="space-y-2.5">

                  {(currentSection.sharedOptions ?? []).map((opt) => {

                    const letter = opt.charAt(0);
                    const isUsed = isMatchingOptionUsed(letter);
                    const usedQuestion = matchingQuestions.find(
                      (question) => (answers[question.id] ?? "").trim().toUpperCase() === letter,
                    );

                    return (
                      <div
                        key={opt}
                        draggable={!submitted && !isUsed}
                        aria-disabled={submitted || isUsed}
                        onDragStart={(event) => {
                          if (submitted || isUsed) {
                            event.preventDefault();
                            return;
                          }
                          setDraggedLetter(letter);
                        }}
                        onClick={() => {
                          if (submitted || isUsed) return;
                          const nextEmpty = matchingQuestions.find((question) => !answers[question.id]);
                          if (nextEmpty) assignMatchingAnswer(nextEmpty.id, letter);
                        }}
                        className={`practice-match-option rounded-xl border px-4 py-3.5 text-sm font-semibold text-white shadow-md transition-all ${
                          isUsed
                            ? "cursor-not-allowed border-teal/20 bg-teal/5 opacity-45"
                            : "cursor-grab border-white/10 bg-white/5 hover:border-teal/50 active:cursor-grabbing"
                        }`}
                      >
                        <span className="mr-2 font-black text-teal">{letter}.</span>
                        {opt.replace(/^[A-H]\.\s*/, "")}
                        {isUsed && <span className="ml-2 text-[10px] font-bold text-teal">Использован в Q{usedQuestion?.number}</span>}
                      </div>
                    );

                  })}

                </div>

              </div>

            </div>

          </div>

        )}


        {currentSection.transcript && (

          <div>

            <button

              type="button"

              onClick={() => setShowScript((prev) => !prev)}

              className="text-xs font-bold text-teal underline underline-offset-4 hover:text-white transition-colors"

            >

              {showScript ? "Скрыть скрипт аудио" : "Показать скрипт аудио"}

            </button>

            {showScript && (

              <div className="practice-transcript mt-3 whitespace-pre-line rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-sm leading-relaxed text-mist shadow-xl">

                {currentSection.transcript}

              </div>

            )}

          </div>

        )}

      </div>


      {/* Responsive part navigation and test controls */}
      <div className="practice-dock fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 px-4 py-3 text-mist shadow-2xl sm:px-5 sm:py-3.5">
        <div className="practice-dock-inner mx-auto max-w-7xl">
          <nav ref={partNavigationRef} className="practice-part-navigation" aria-label="Переход между частями теста">
            {currentTest.sections.map((sec, sIdx) => {
              const isActive = sIdx === activePartIndex;
              const sectionAnswered = sec.questions.filter((question) => Boolean((answers[question.id] ?? "").trim())).length;

              return (
                <button
                  key={`${currentTest.id}-${sIdx}`}
                  ref={isActive ? activePartButtonRef : undefined}
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  aria-pressed={isActive}
                  onClick={() => setActivePartIndex(sIdx)}
                  className="practice-part-tab"
                >
                  <span>Part {sIdx + 1}</span>
                  <span className="practice-part-count">{sectionAnswered}/{sec.questions.length}</span>
                </button>
              );
            })}
          </nav>

          <div className="practice-dock-actions">
            <div className="practice-dock-stepper">
              <button
                type="button"
                aria-label="Предыдущая часть"
                disabled={activePartIndex === 0}
                onClick={() => setActivePartIndex((index) => Math.max(0, index - 1))}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-teal/30 bg-navy-3 text-white transition-colors hover:border-teal disabled:opacity-30"
              >
                <ArrowLeft className="size-4 text-teal" />
              </button>
              <span className="practice-dock-current">{activePartIndex + 1} / {currentTest.sections.length}</span>
              <button
                type="button"
                aria-label="Следующая часть"
                disabled={activePartIndex === currentTest.sections.length - 1}
                onClick={() => setActivePartIndex((index) => Math.min(currentTest.sections.length - 1, index + 1))}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-teal/30 bg-navy-3 text-white transition-colors hover:border-teal disabled:opacity-30"
              >
                <ArrowRight className="size-4 text-teal" />
              </button>
            </div>

            {!submitted ? (
              <button
                type="button"
                onClick={handleFinish}
                className="practice-submit-button tap group relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-sky-400 px-6 text-sm font-extrabold text-ink shadow-lg shadow-teal/20"
              >
                <span>Submit Test</span>
                <Send className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="practice-dock-result tap inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-teal px-6 text-sm font-extrabold text-ink shadow-lg shadow-teal/20 transition-transform hover:scale-[1.02]"
              >
                <Trophy className="size-4" />
                Band {getIELTSBand(scoreSummary.correct)} ({scoreSummary.correct}/{scoreSummary.total})
              </button>
            )}
          </div>
        </div>
      </div>

    </Page>

  );

}
