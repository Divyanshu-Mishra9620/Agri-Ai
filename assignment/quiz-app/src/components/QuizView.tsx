import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, AlertCircle } from "lucide-react";
import { useQuizStore } from "@/store/quiz";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";

export const QuizView: React.FC = () => {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    answerQuestion,
    submitQuiz,
    getProgress,
    isAllQuestionsAnswered,
  } = useQuizStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitError, setShowSubmitError] = useState(false);

  const progress = getProgress();
  const currentQuestion = questions[currentIndex];
  const currentAnswer = userAnswers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  const handleOptionSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    answerQuestion(currentQuestion.id, optionIndex);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!isAllQuestionsAnswered()) {
      setShowSubmitError(true);
      setTimeout(() => setShowSubmitError(false), 3000);
      return;
    }
    submitQuiz();
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressBar
        current={progress.current}
        total={progress.total}
        className="mb-8"
      />

      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2">
          {questions.map((_, index) => {
            const isAnswered = userAnswers.some(
              (a) => a.questionId === questions[index].id
            );
            const isCurrent = index === currentIndex;

            return (
              <motion.button
                key={index}
                className={`w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isCurrent
                    ? "bg-primary-500 text-white ring-2 ring-primary-200"
                    : isAnswered
                      ? "bg-ainstein-500 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Go to question ${index + 1}`}
              >
                {index + 1}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedOption={currentAnswer?.selectedOption ?? null}
            onOptionSelect={handleOptionSelect}
          />
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:static lg:bg-transparent lg:border-0 lg:mt-8 lg:p-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            whileHover={{ scale: currentIndex === 0 ? 1 : 1.02 }}
            whileTap={{ scale: currentIndex === 0 ? 1 : 0.98 }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          <AnimatePresence>
            {showSubmitError && (
              <motion.div
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="w-4 h-4" />
                Please answer all questions before submitting
              </motion.div>
            )}
          </AnimatePresence>

          {currentIndex === questions.length - 1 ? (
            <motion.button
              className={`btn-primary flex items-center gap-2 ${
                showSubmitError ? "animate-shake" : ""
              }`}
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
              Submit Quiz
            </motion.button>
          ) : (
            <motion.button
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
