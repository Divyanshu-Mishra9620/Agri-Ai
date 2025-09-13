import type { Question } from "../types/quiz.ts";

export const questions: Question[] = [
  {
    id: "q1",
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: 2,
    explanation: "Paris is the capital and most populous city of France.",
    points: 2,
    difficulty: "Easy",
  },
  {
    id: "q2",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation:
      "Mars is often called the Red Planet due to its reddish appearance.",
    points: 2,
    difficulty: "Easy",
  },
  {
    id: "q3",
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: 3,
    explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
    points: 3,
    difficulty: "Medium",
  },
  {
    id: "q4",
    question:
      "Which programming language is known for its use in machine learning?",
    options: ["HTML", "CSS", "Python", "SQL"],
    correctAnswer: 2,
    explanation:
      "Python is widely used in machine learning due to its extensive libraries like TensorFlow and scikit-learn.",
    points: 3,
    difficulty: "Medium",
  },
  {
    id: "q5",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation:
      "Binary search has O(log n) time complexity as it eliminates half of the search space in each iteration.",
    points: 4,
    difficulty: "Hard",
  },
];
