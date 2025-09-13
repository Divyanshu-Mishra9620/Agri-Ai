import React from "react";
import { motion } from "framer-motion";
import { Play, BookOpen, Trophy, Clock } from "lucide-react";
import { useQuizStore } from "@/store/quiz";

export const WelcomeScreen: React.FC = () => {
  const { startQuiz, questions } = useQuizStore();

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const estimatedTime = questions.length * 1.5;

  const features = [
    {
      icon: BookOpen,
      title: "Multiple Choice Questions",
      description: "Test your knowledge across different topics",
    },
    {
      icon: Trophy,
      title: "Scoring System",
      description: `Earn up to ${totalPoints} points based on difficulty`,
    },
    {
      icon: Clock,
      title: "Self-Paced",
      description: `Approximately ${Math.ceil(estimatedTime)} minutes to complete`,
    },
  ];

  return (
    <motion.div
      className="max-w-2xl mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-ainstein-500 text-white rounded-full mb-6">
          <BookOpen className="w-10 h-10" />
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Knowledge Quiz Challenge
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          Test your knowledge with our carefully curated set of questions. Each
          question is designed to challenge your understanding across different
          topics and difficulty levels.
        </p>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid gap-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {questions.length}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-ainstein-600 mb-1">
                {totalPoints}
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-sunburst-600 mb-1">
                ~{Math.ceil(estimatedTime)}
              </div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex items-start gap-4 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                <feature.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Select one answer for each question</li>
            <li>• You can navigate between questions freely</li>
            <li>• Submit only when all questions are answered</li>
            <li>• Review your answers and explanations at the end</li>
          </ul>
        </motion.div>

        <motion.button
          className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4"
          onClick={startQuiz}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Play className="w-5 h-5" />
          Start Quiz
        </motion.button>
      </motion.div>

      <motion.p
        className="text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        Your progress will be automatically saved as you go through the quiz.
      </motion.p>
    </motion.div>
  );
};
