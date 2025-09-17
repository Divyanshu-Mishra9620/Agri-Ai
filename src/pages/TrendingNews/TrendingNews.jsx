import React from 'react';
import { motion } from 'framer-motion';
import { GOVERNMENT_SCHEMES } from '../../utils/constants';
import { SchemeCard } from './components/NewsCard';
import useTranslation from '../../hooks/useTranslation';
import { useSelector } from 'react-redux';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function TrendingNews() {
  const t = useTranslation();
  const lang = useSelector((s) => s.language.current);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Clean background elements - matching homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-5"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          🏛️
        </motion.div>
        <motion.div
          className="absolute top-60 right-20 text-3xl opacity-5"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        >
          📋
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-3xl opacity-5"
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 4 }}
        >
          🌾
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6 relative">
        {/* Header - matching homepage style */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/80 backdrop-blur-xl border border-white/60 mb-8 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span 
              className="text-3xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🏛️
            </motion.span>
            <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('govt_schemes_badge') || 'Government Initiatives'}
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-6 tracking-tight leading-tight">
            {t('govt_schemes_title') || 'Government Schemes for Farmers'}
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            {t('govt_schemes_subtitle') || 'Comprehensive support programs designed to empower farmers and boost agricultural productivity across India'}
          </p>
          
          {/* Stats - clean green design */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "25+", label: t('active_schemes') || 'Active Schemes', icon: "📋" },
              { value: "12Cr+", label: t('beneficiaries') || 'Beneficiaries', icon: "👥" },
              { value: "₹2L+Cr", label: t('budget_allocated') || 'Budget Allocated', icon: "💰" },
              { value: "All", label: t('states_covered') || 'States Covered', icon: "🗺️" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60 hover:shadow-2xl hover:bg-white/95 transition-all duration-500"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
       
              >
                <div className="text-2xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Schemes Sections - clean design */}
        <motion.div 
          className="space-y-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {GOVERNMENT_SCHEMES.map((group, index) => (
            <motion.section 
              key={group.sector} 
              className="relative"
              variants={sectionVariants}
            >
              <div className="flex items-center gap-6 mb-12">
                <motion.div 
                  className="w-20 h-20 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-3xl shadow-xl text-white"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {group.icon}
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-4xl font-black text-gray-800 mb-3 leading-tight">
                    {t(`sector_${group.sector.toLowerCase().replace(/\s+/g, '_')}`) || group.sector}
                  </h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-lg px-5 py-2 rounded-full bg-white/80 text-gray-700 font-bold backdrop-blur-xl border border-white/60 shadow-lg">
                      {group.items.length} {t('schemes_available') || 'Schemes Available'}
                    </span>
                    <span className="text-sm px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-200 font-semibold">
                      {t('translatedHeadlines') || 'Translated Headlines'} ✨
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1 + itemIndex * 0.08,
                      ease: "easeOut"
                    }}
                  >
                    <SchemeCard item={item} lang={lang || 'en'} sectorColor={group.color} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>

        {/* Call to Action - matching homepage CTA */}
        <motion.div 
          className="mt-24 relative overflow-hidden rounded-3xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Background matching homepage CTA */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.95) 100%), url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
            }}
          />
          
          <div className="relative p-16 text-center text-white">
            <motion.div
              className="text-6xl mb-6"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🤝
            </motion.div>
            
            <h3 className="text-4xl font-black mb-6 leading-tight">
              {t('need_help_title') || 'Need Help with Applications?'}
            </h3>
            <p className="text-xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              {t('need_help_desc') || 'Our support team can guide you through the application process for any government scheme'}
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <motion.button
                className="group relative bg-white/90 hover:bg-white text-green-700 hover:text-green-800 px-12 py-5 rounded-2xl font-bold shadow-xl text-lg overflow-hidden"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-xl">🚀</span>
                  {t('get_support') || 'Get Support'} 
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
              
              <motion.button
                className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-3">
                  📄 {t('download_guide') || 'Download Guide'}
                </span>
              </motion.button>
            </div>
            
            <motion.p 
              className="mt-8 text-green-200 font-medium"
            >
              ✅ Free consultation • ✅ Expert guidance • ✅ Quick approval
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
