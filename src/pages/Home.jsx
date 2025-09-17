import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Card from "../components/UI/Card";
import useTranslation from "../hooks/useTranslation";

export default function Home() {
  const t = useTranslation();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    document
      .querySelectorAll("[data-animate]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-cycling feature highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { key: "cropSuggestions", icon: "🌱", descKey: "feat_crop_desc" },
    { key: "diseaseDetection", icon: "🔍", descKey: "feat_disease_desc" },
    { key: "farmerSupport", icon: "👨‍🌾", descKey: "feat_support_desc" },
  ];

  const tech = [
    { icon: "🗺️", title: t("home_map_title"), desc: t("home_map_desc") },
    { icon: "🧠", title: t("home_ai_title"), desc: t("home_ai_desc") },
    {
      icon: "📡",
      title: t("home_realtime_title"),
      desc: t("home_realtime_desc"),
    },
    { icon: "🔐", title: t("home_secure_title"), desc: t("home_secure_desc") },
  ];

  const goals = [
    { icon: "📈", title: t("goal_income_title"), desc: t("goal_income_desc") },
    { icon: "💧", title: t("goal_water_title"), desc: t("goal_water_desc") },
    { icon: "🧪", title: t("goal_input_title"), desc: t("goal_input_desc") },
    { icon: "🤝", title: t("goal_access_title"), desc: t("goal_access_desc") },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Advanced Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.03)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.01)_50%,transparent_75%)]" />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-5"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          🌾
        </motion.div>
        <motion.div
          className="absolute top-60 right-20 text-3xl opacity-5"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        >
          🚜
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-3xl opacity-5"
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 4 }}
        >
          🌱
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Revolutionary Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Hero Background with Advanced Parallax */}
          <motion.div style={{ y }} className="absolute inset-0 z-0">
            <div
              className="w-full h-[120vh] bg-cover bg-center bg-fixed"
              style={{
                backgroundImage: `
                  linear-gradient(
                    135deg, 
                    rgba(34, 197, 94, 0.85) 0%, 
                    rgba(22, 163, 74, 0.88) 25%,
                    rgba(16, 185, 129, 0.82) 50%,
                    rgba(5, 150, 105, 0.85) 75%,
                    rgba(4, 120, 87, 0.9) 100%
                  ), 
                  url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
              }}
            />
          </motion.div>

          {/* Advanced Floating Particles */}
          <div className="absolute inset-0 z-10 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -100, -20],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-bold text-lg mb-12 shadow-2xl">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  🌾
                </motion.span>
                <span className="bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent font-black">
                  {t("home_badge")}
                </span>
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight"
            >
              <span className="block">Welcome to KRISHinova</span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-green-200 via-emerald-200 to-green-300 bg-clip-text text-transparent">
                Smart Agriculture Revolution
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-green-100 mb-16 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              {t("tagline")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
            >
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-4 bg-white/90 hover:bg-white text-green-700 hover:text-green-800 font-black text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-3xl">🚀</span>
                <span className="relative z-10">{t("signup")}</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>

              <Link
                to="/disease-detection"
                className="group inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold text-xl px-12 py-6 rounded-2xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-3xl">🔍</span>
                {t("diseaseDetection")}
              </Link>
            </motion.div>

            {/* Advanced Stats with Animation */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { value: "25k+", label: t("home_stat_farmers"), icon: "👨‍🌾" },
                { value: "120+", label: t("home_stat_districts"), icon: "🗺️" },
                { value: "4.8", label: t("home_stat_rating"), icon: "⭐" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
                  className="group text-center p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/20 transform hover:scale-110 transition-all duration-500"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-4xl sm:text-5xl font-black text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-green-200 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Animated Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-8 h-14 border-3 border-white/50 rounded-full flex justify-center p-2">
              <motion.div
                className="w-2 h-6 bg-white/70 rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Revolutionary Features Section */}
        <motion.section
          id="features"
          data-animate
          variants={containerVariants}
          initial="hidden"
          animate={isVisible.features ? "visible" : "hidden"}
          className="py-32 relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50 rounded-3xl" />
          <div
            className="absolute inset-0 opacity-5 rounded-3xl"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            }}
          />

          <div className="relative z-10 px-6">
            <motion.div variants={itemVariants} className="text-center mb-20">
              <span className="inline-flex items-center gap-3 px-8 py-4 bg-green-100 text-green-800 rounded-full font-bold text-lg mb-8 shadow-lg">
                <span className="text-2xl">✨</span>
                Revolutionary Features
                <span className="text-2xl">✨</span>
              </span>

              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
                <span className="block">{t("home_offers_title")}</span>
                <span className="block text-4xl sm:text-5xl bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                  Built for Modern Farmers
                </span>
              </h2>

              <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                {t("home_offers_sub")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group relative"
                  onMouseEnter={() => setActiveFeature(i)}
                >
                  <div className="relative h-full">
                    {/* Feature Image Background */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <img
                        src={
                          f.key === "cropSuggestions"
                            ? "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            : f.key === "diseaseDetection"
                              ? "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                              : "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={t(f.key)}
                        className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/50 to-transparent" />
                    </div>

                    <Card className="relative h-full text-white bg-gradient-to-b from-green-900 via-green-800 to-green-700 border-none shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-6 transition-all duration-700 overflow-hidden rounded-2xl">
                      <div className="relative p-10 flex flex-col h-full justify-end">
                        {/* Icon Animation */}
                        <motion.div
                          className="text-7xl mb-6 filter drop-shadow-lg text-green-200"
                          animate={
                            activeFeature === i
                              ? {
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 10, 0],
                                }
                              : {}
                          }
                          transition={{ duration: 0.5 }}
                        >
                          {f.icon}
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-3xl font-black mb-6 text-green-100 group-hover:text-green-300 transition-colors duration-300">
                          {t(f.key)}
                        </h3>

                        {/* Description */}
                        <p className="text-green-200 mb-8 leading-relaxed text-lg font-medium">
                          {t(f.descKey)}
                        </p>

                        {/* Learn More Button */}
                        <Link
                          to={
                            f.key === "diseaseDetection"
                              ? "/disease-detection"
                              : f.key === "cropSuggestions"
                                ? "/suggestions"
                                : "/profile"
                          }
                          className="group/btn relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-green-600 hover:bg-green-500 overflow-hidden transform hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                          <span className="relative z-10">
                            {t("home_learn_more")}
                          </span>
                          <motion.span
                            className="relative z-10"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </Link>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Advanced Technology Section */}
        <motion.section
          id="tech"
          data-animate
          variants={containerVariants}
          initial="hidden"
          animate={isVisible.tech ? "visible" : "hidden"}
          className="py-32 relative"
        >
          {/* Dynamic Background */}
          <div
            className="absolute inset-0 bg-cover bg-center rounded-3xl opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            }}
          />

          <div className="relative bg-gradient-to-br from-gray-900/95 to-green-900/95 backdrop-blur-xl rounded-3xl p-16 border border-green-500/20 shadow-2xl mx-6">
            <motion.div variants={itemVariants} className="text-center mb-20">
              <span className="inline-flex items-center gap-3 px-8 py-4 bg-green-500/20 text-green-300 rounded-full font-bold text-lg mb-8 shadow-lg border border-green-500/30">
                <span className="text-2xl">🚀</span>
                Advanced Technology Stack
              </span>

              <h2 className="text-5xl sm:text-6xl font-black text-white mb-8">
                {t("home_tech_title")}
              </h2>
              <p className="text-xl text-green-200 max-w-4xl mx-auto leading-relaxed font-medium">
                {t("home_tech_sub")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {tech.map((x, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/20 transform hover:scale-110 hover:-translate-y-4 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative text-center">
                    <motion.div
                      className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block filter drop-shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 15 }}
                    >
                      {x.icon}
                    </motion.div>
                    <h3 className="font-black text-xl text-white mb-4 group-hover:text-green-300 transition-colors duration-300">
                      {x.title}
                    </h3>
                    <p className="text-sm text-green-200 group-hover:text-white transition-colors duration-300 leading-relaxed">
                      {x.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Goals Section with Modern Design */}
        <motion.section
          id="goals"
          data-animate
          variants={containerVariants}
          initial="hidden"
          animate={isVisible.goals ? "visible" : "hidden"}
          className="py-32 relative"
        >
          <div
            className="absolute inset-0 bg-cover bg-center rounded-3xl opacity-5"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            }}
          />

          <div className="relative z-10 px-6">
            <motion.div variants={itemVariants} className="text-center mb-20">
              <span className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-100 text-emerald-800 rounded-full font-bold text-lg mb-8 shadow-lg">
                <span className="text-2xl">🎯</span>
                Our Mission & Vision
              </span>

              <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8 leading-tight">
                <span className="block">{t("home_goals_title")}</span>
                <span className="block text-4xl sm:text-5xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Sustainable Future
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                {t("home_goals_sub")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {goals.map((g, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="relative h-full overflow-hidden rounded-3xl">
                    {/* Goal Background Images */}
                    <div className="absolute inset-0">
                      <img
                        src={
                          i === 0
                            ? "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            : i === 1
                              ? "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                              : i === 2
                                ? "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                : "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={g.title}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-800/50 to-transparent" />
                    </div>

                    <div className="relative p-8 h-full flex flex-col justify-end text-white">
                      <motion.div
                        className="text-5xl mb-4 filter drop-shadow-lg"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {g.icon}
                      </motion.div>
                      <h3 className="font-black text-2xl mb-3 group-hover:text-green-300 transition-colors duration-300">
                        {g.title}
                      </h3>
                      <p className="text-emerald-200 group-hover:text-white transition-colors duration-300 leading-relaxed font-medium">
                        {g.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Revolutionary CTA Section */}
        <motion.section
          id="cta"
          data-animate
          variants={containerVariants}
          initial="hidden"
          animate={isVisible.cta ? "visible" : "hidden"}
          className="py-32 mb-24"
        >
          <div className="relative overflow-hidden rounded-3xl mx-6">
            {/* CTA Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.98) 50%, rgba(16, 185, 129, 0.95) 100%), url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
              }}
            />

            <div className="relative p-16 text-center text-white">
              <motion.div variants={itemVariants} className="mb-12">
                <span className="inline-flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full font-bold text-xl mb-8">
                  <span className="text-3xl">🚀</span>
                  Ready to Transform Your Farm?
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight"
              >
                <span className="text-3xl mr-4">🌾</span>
                {t("home_get_started")}
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                <motion.div variants={itemVariants} className="space-y-8">
                  {[
                    { num: 1, text: t("home_step_profile"), delay: 0.2 },
                    { num: 2, text: t("home_step_field"), delay: 0.4 },
                    { num: 3, text: t("home_step_reco"), delay: 0.6 },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.delay, duration: 0.6 }}
                      className="group flex items-center gap-6"
                    >
                      <div className="relative w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center font-black text-white shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 border-2 border-white/40">
                        <span className="relative z-10 text-xl">
                          {step.num}
                        </span>
                      </div>
                      <span className="text-white font-bold text-xl group-hover:text-green-200 transition-colors duration-300">
                        {step.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 text-center shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-500">
                    <h3 className="font-black text-3xl text-white mb-6">
                      {t("home_ready")}
                    </h3>
                    <p className="text-green-200 mb-10 leading-relaxed text-xl font-medium">
                      {t("home_join_note")}
                    </p>

                    <div className="space-y-4">
                      <Link
                        to="/signup"
                        className="group relative inline-flex items-center justify-center gap-4 w-full px-12 py-6 rounded-2xl text-green-800 bg-white hover:bg-green-50 font-black text-xl shadow-2xl overflow-hidden transform hover:scale-110 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="text-2xl">🌱</span>
                        <span className="relative z-10">{t("signup")}</span>
                        <motion.span
                          className="relative z-10"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </Link>

                      <p className="text-green-300 text-sm font-medium">
                        ✅ Free trial • ✅ No credit card required • ✅ Cancel
                        anytime
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
