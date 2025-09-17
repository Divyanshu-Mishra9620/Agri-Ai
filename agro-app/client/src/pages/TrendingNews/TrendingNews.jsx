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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-200/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-blue-200/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-100/10 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto py-16 px-6">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
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
                    </span>
                  </div>
                </div>
              </div>

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
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>

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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
