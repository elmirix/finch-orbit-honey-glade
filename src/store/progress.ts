import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ExamId } from "@/data/types";

export type TopicRecord = {
  theoryDone: boolean;
  practice: Record<string, string>;
  bestPercent: number | null;
  passed: boolean;
};

export type LastVisit = {
  examId: ExamId;
  subjectId: string;
  topicId: string;
  title: string;
  subjectTitle: string;
};

type ProgressState = {
  topics: Record<string, TopicRecord>;
  last: LastVisit | null;
  sims: Record<string, { bestPercent: number; attempts: number }>;
  markTheory: (key: string) => void;
  markPractice: (key: string, questionId: string, choiceId: string) => void;
  saveQuiz: (key: string, percent: number, passed: boolean) => void;
  saveSim: (examId: string, percent: number) => void;
  setLast: (last: LastVisit) => void;
  resetAll: () => void;
};

export const EMPTY_TOPIC: TopicRecord = {
  theoryDone: false,
  practice: {},
  bestPercent: null,
  passed: false,
};

export function topicKey(examId: string, subjectId: string, topicId: string) {
  return `${examId}:${subjectId}:${topicId}`;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      topics: {},
      last: null,
      sims: {},
      markTheory: (key) =>
        set((state) => {
          const prev = state.topics[key] ?? EMPTY_TOPIC;
          if (prev.theoryDone) return state;
          return {
            topics: { ...state.topics, [key]: { ...prev, theoryDone: true } },
          };
        }),
      markPractice: (key, questionId, choiceId) =>
        set((state) => {
          const prev = state.topics[key] ?? EMPTY_TOPIC;
          if (prev.practice[questionId]) return state;
          return {
            topics: {
              ...state.topics,
              [key]: {
                ...prev,
                practice: { ...prev.practice, [questionId]: choiceId },
              },
            },
          };
        }),
      saveQuiz: (key, score, passed) =>
        set((state) => {
          const prev = state.topics[key] ?? EMPTY_TOPIC;
          const best = prev.bestPercent == null ? score : Math.max(prev.bestPercent, score);
          return {
            topics: {
              ...state.topics,
              [key]: {
                ...prev,
                bestPercent: best,
                passed: prev.passed || passed,
              },
            },
          };
        }),
      saveSim: (examId, score) =>
        set((state) => {
          const prev = state.sims[examId];
          return {
            sims: {
              ...state.sims,
              [examId]: {
                bestPercent: prev ? Math.max(prev.bestPercent, score) : score,
                attempts: (prev?.attempts ?? 0) + 1,
              },
            },
          };
        }),
      setLast: (last) => set({ last }),
      resetAll: () => set({ topics: {}, last: null, sims: {} }),
    }),
    { name: "click-progress-v1", skipHydration: true },
  ),
);
