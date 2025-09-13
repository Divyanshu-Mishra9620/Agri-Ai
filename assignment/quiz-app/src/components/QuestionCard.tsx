import React from "react";
import { motion } from "framer-motion";
import { Question, UserAnswer } from "@/types/quiz";
import { cn, getDifficultyColor } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedOption: number | null;
  onOptionSelect: (optionIndex: number) => void;
  isSubmitted?: boolean;
  userAnswer?: UserAnswer;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  selectedOption,
  onOptionSelect,
  isSubmitted = false,
  userAnswer,
}) => {
  const getOptionStatus = (optionIndex: number) => {
    if (!isSubmitted) {
      return selectedOption === optionIndex ? "selected" : "default";
    }

    if (optionIndex === question.correctAnswer) {
      return "correct";
    }

    if (
      userAnswer &&
      userAnswer.selectedOption === optionIndex &&
      !userAnswer.isCorrect
    ) {
      return "incorrect";
    }

    return "default";
  };

  const getOptionClasses = (optionIndex: number) => {
    const status = getOptionStatus(optionIndex);
    const baseClasses = "option-chip";

    switch (status) {
      case "selected":
        return `${baseClasses} selected`;
      case "correct":
        return `${baseClasses} correct`;
      case "incorrect":
        return `${baseClasses} incorrect`;
      default:
        return baseClasses;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
              {questionNumber}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border",
                getDifficultyColor(question.difficulty)
              )}
            >
              {question.difficulty}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {question.points} {question.points === 1 ? "point" : "points"}
            </span>
          </div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 leading-relaxed">
            {question.question}
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            className={getOptionClasses(index)}
            onClick={() => !isSubmitted && onOptionSelect(index)}
            disabled={isSubmitted}
            whileHover={!isSubmitted ? { scale: 1.01 } : {}}
            whileTap={!isSubmitted ? { scale: 0.99 } : {}}
            transition={{ duration: 0.12 }}
            aria-label={`Option ${index + 1}: ${option}`}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 text-sm font-medium rounded-full flex items-center justify-center">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-left font-medium">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {isSubmitted && (
        <motion.div
          className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Explanation
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {question.explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
