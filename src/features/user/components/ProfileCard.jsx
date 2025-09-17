import React from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import useTranslation from '../../../hooks/useTranslation';

export default function ProfileCard({ label, value, icon, className = "" }) {
  const t = useTranslation();
  
  return (
    <motion.div 
      className={`group relative overflow-hidden bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Decorative Corner Element */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative z-10">
        {/* Label with Icon */}
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <motion.span 
              className="text-2xl"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.span>
          )}
          <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">
            {typeof label === 'string' ? t(label) : label}
          </label>
        </div>
        
        {/* Value */}
        <motion.p 
          className="text-lg text-gray-800 font-semibold leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {value || (
            <span className="text-gray-400 italic font-normal">
              {t('notProvided')}
            </span>
          )}
        </motion.p>
        
        {/* Bottom Accent Line */}
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 w-0 group-hover:w-full transition-all duration-500 rounded-full"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
        />
      </div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.div>
=======
import useTranslation from '../../../hooks/useTranslation';

export default function ProfileCard({ label, value }) {
  const t = useTranslation();
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t(label)}</label>
      <p className="text-lg text-gray-800 font-medium">{value}</p>
    </div>
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  );
}
