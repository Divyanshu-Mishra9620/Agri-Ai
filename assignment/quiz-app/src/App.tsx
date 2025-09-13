import React from "react";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quiz";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { QuizView } from "@/components/QuizView";
import { ResultsSummary } from "@/components/ResultsSummary";

function App() {
  const { isStarted, isSubmitted } = useQuizStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-ainstein-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Quiz Challenge
              </h1>
            </motion.div>

            {isStarted && !isSubmitted && (
              <motion.div
                className="text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <span className="hidden sm:inline">
                  Ready to test your knowledge?
                </span>
                <span className="sm:hidden">Quiz in progress</span>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div
          key={`${isStarted}-${isSubmitted}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {!isStarted ? (
            <WelcomeScreen />
          ) : isSubmitted ? (
            <ResultsSummary />
          ) : (
            <QuizView />
          )}
        </motion.div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Built with React, TypeScript, Tailwind CSS, and Framer Motion</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
