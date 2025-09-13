import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Question,
  UserAnswer,
  QuizState,
  QuizResult,
} from "../types/quiz.ts";
import { questions } from "../data/questions.ts";

interface QuizStore extends QuizState {
  startQuiz: () => void;
  answerQuestion: (questionId: string, selectedOption: number) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;

  getCurrentQuestion: () => Question | null;
  getProgress: () => { current: number; total: number; percentage: number };
  getResult: () => QuizResult | null;
  isAllQuestionsAnswered: () => boolean;
}

const initialState: QuizState = {
  questions,
  currentQuestionIndex: 0,
  userAnswers: [],
  isSubmitted: false,
  isStarted: false,
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startQuiz: () => {
        set({
          isStarted: true,
          currentQuestionIndex: 0,
          userAnswers: [],
          isSubmitted: false,
        });
      },

      answerQuestion: (questionId: string, selectedOption: number) => {
        const state = get();
        const question = state.questions.find((q) => q.id === questionId);

        if (!question) return;

        const isCorrect = selectedOption === question.correctAnswer;
        const pointsEarned = isCorrect ? question.points : 0;

        const userAnswer: UserAnswer = {
          questionId,
          selectedOption,
          isCorrect,
          pointsEarned,
        };

        const existingAnswerIndex = state.userAnswers.findIndex(
          (answer) => answer.questionId === questionId
        );

        let updatedAnswers: UserAnswer[];
        if (existingAnswerIndex >= 0) {
          updatedAnswers = [...state.userAnswers];
          updatedAnswers[existingAnswerIndex] = userAnswer;
        } else {
          updatedAnswers = [...state.userAnswers, userAnswer];
        }

        set({ userAnswers: updatedAnswers });
      },

      submitQuiz: () => {
        set({ isSubmitted: true });
      },

      resetQuiz: () => {
        set(initialState);
      },

      getCurrentQuestion: () => {
        const state = get();
        return state.questions[state.currentQuestionIndex] || null;
      },

      getProgress: () => {
        const state = get();
        const answered = state.userAnswers.length;
        const total = state.questions.length;
        return {
          current: answered,
          total,
          percentage: total > 0 ? (answered / total) * 100 : 0,
        };
      },

      getResult: () => {
        const state = get();
        if (!state.isSubmitted) return null;

        const totalQuestions = state.questions.length;
        const totalPoints = state.questions.reduce(
          (sum, q) => sum + q.points,
          0
        );
        const correctAnswers = state.userAnswers.filter(
          (a) => a.isCorrect
        ).length;
        const earnedPoints = state.userAnswers.reduce(
          (sum, a) => sum + a.pointsEarned,
          0
        );
        const percentage =
          totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        return {
          totalQuestions,
          correctAnswers,
          totalPoints,
          earnedPoints,
          percentage,
        };
      },

      isAllQuestionsAnswered: () => {
        const state = get();
        return state.userAnswers.length === state.questions.length;
      },
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        userAnswers: state.userAnswers,
        isSubmitted: state.isSubmitted,
        isStarted: state.isStarted,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    }
  )
);
