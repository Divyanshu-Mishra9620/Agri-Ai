export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isSubmitted: boolean;
  isStarted: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
}
