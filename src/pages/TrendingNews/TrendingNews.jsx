<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';
import { GOVERNMENT_SCHEMES } from '../../utils/constants';
import { SchemeCard } from './components/NewsCard';
import useTranslation from '../../hooks/useTranslation';
import { useSelector } from 'react-redux';
=======
// pages/GovernmentSchemes.jsx
import React from "react";
import { motion } from "framer-motion";
import { GOVERNMENT_SCHEMES } from "../../utils/constants";
import { SchemeCard } from "./components/NewsCard";
import useTranslation from "../../hooks/useTranslation";
import { useSelector } from "react-redux";

const sectorNames = {
  "Credit Finance": "Finance and Credit Sector",
  Insurance: "Water and Insurance Sector",
  Agriculture: "Agriculture Development Sector",
  Irrigation: "Irrigation and Water Sector",
  // add more mappings as needed
};
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-200/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-blue-200/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-100/10 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto py-16 px-6">
        {/* Enhanced Header */}
        <motion.div
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
<<<<<<< HEAD
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
=======
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/70 backdrop-blur border border-white/50 mb-6 shadow-lg">
            <span className="text-2xl">🏛️</span>
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {t("govt_schemes_badge") || "Government Initiatives"}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
            {t("govt_schemes_title") || "Government Schemes for Farmers"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("govt_schemes_subtitle") ||
              "Comprehensive support programs designed to empower farmers and boost agricultural productivity across India"}
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <motion.div
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-bold text-green-600">25+</div>
              <div className="text-sm text-gray-600 font-medium">
                {t("active_schemes") || "Active Schemes"}
              </div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-bold text-blue-600">12Cr+</div>
              <div className="text-sm text-gray-600 font-medium">
                {t("beneficiaries") || "Beneficiaries"}
              </div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-bold text-purple-600">₹2L+Cr</div>
              <div className="text-sm text-gray-600 font-medium">
                {t("budget_allocated") || "Budget Allocated"}
              </div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-bold text-orange-600">All</div>
              <div className="text-sm text-gray-600 font-medium">
                {t("states_covered") || "States Covered"}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Schemes Sections */}
        <motion.div
          className="space-y-16"
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {GOVERNMENT_SCHEMES.map((group, index) => (
<<<<<<< HEAD
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
=======
            <motion.section
              key={group.sector}
              className="relative"
              variants={sectionVariants}
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${group.color} flex items-center justify-center text-2xl shadow-lg`}
                >
                  {group.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl font-black text-gray-800 mb-3 leading-tight">
                    {sectorNames[group.sector] || group.sector}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 rounded-full bg-white/70 text-gray-700 font-medium backdrop-blur border border-white/50">
                      {group.items.length}{" "}
                      {t("schemes_available") || "Schemes Available"}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                      {t("translatedHeadlines") || "Translated Headlines"}
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
                    </span>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
              
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
=======

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1 + itemIndex * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <SchemeCard
                      item={item}
                      lang={lang || "en"}
                      sectorColor={group.color}
                    />
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>

<<<<<<< HEAD
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
=======
        {/* Call to Action */}
        <motion.div
          className="mt-20 text-center bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/50 p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {t("need_help_title") || "Need Help with Applications?"}
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("need_help_desc") ||
              "Our support team can guide you through the application process for any government scheme"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("get_support") || "Get Support"} →
            </motion.button>
            <motion.button
              className="bg-white/80 backdrop-blur border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-white/90"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("download_guide") || "Download Guide"}
            </motion.button>
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
          </div>
        </motion.div>
      </div>
    </div>
  );
}
