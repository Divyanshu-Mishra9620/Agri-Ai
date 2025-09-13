import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Award, RotateCcw } from "lucide-react";
import { useQuizStore } from "@/store/quiz";
import { QuestionCard } from "./QuestionCard";
import { formatPercentage, getScoreMessage } from "@/lib/utils";

export const ResultsSummary: React.FC = () => {
  const { questions, userAnswers, getResult, resetQuiz } = useQuizStore();
  const result = getResult();

  if (!result) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8"
        variants={itemVariants}
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-ainstein-500 text-white rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Award className="w-10 h-10" />
          </motion.div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Quiz Completed!
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            {getScoreMessage(result.percentage)}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {result.correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {formatPercentage(result.percentage)}
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {result.earnedPoints}
              </div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {result.totalPoints}
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>

          <motion.button
            className="btn-primary inline-flex items-center gap-2"
            onClick={resetQuiz}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            Take Quiz Again
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8"
        variants={itemVariants}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Overview
        </h2>
        <div className="grid gap-3">
          {questions.map((question, index) => {
            const userAnswer = userAnswers.find(
              (a) => a.questionId === question.id
            );
            const isCorrect = userAnswer?.isCorrect ?? false;

            return (
              <motion.div
                key={question.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { delay: index * 0.1 },
                  },
                }}
              >
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-ainstein-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-sunburst-500 flex-shrink-0" />
                )}
                <span className="text-sm font-medium text-gray-700 flex-1">
                  Question {index + 1}
                </span>
                <span className="text-sm text-gray-500">
                  {userAnswer?.pointsEarned ?? 0}/{question.points} pts
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Detailed Results
        </h2>
        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = userAnswers.find(
              (a) => a.questionId === question.id
            );

            return (
              <motion.div
                key={question.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  },
                }}
              >
                <QuestionCard
                  question={question}
                  questionNumber={index + 1}
                  selectedOption={userAnswer?.selectedOption ?? null}
                  onOptionSelect={() => {}}
                  isSubmitted={true}
                  userAnswer={userAnswer}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
