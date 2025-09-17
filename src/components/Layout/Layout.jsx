import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Clean floating elements - matching homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-5"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          🌾
        </motion.div>
        <motion.div
          className="absolute top-60 right-20 text-3xl opacity-5"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        >
          🌱
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-3xl opacity-5"
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 4 }}
        >
          🚜
        </motion.div>
      </div>

      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <motion.main 
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
