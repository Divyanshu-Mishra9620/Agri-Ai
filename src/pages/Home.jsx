// pages/Home.jsx
import { Link } from "react-router-dom";
import Card from "../components/UI/Card";
import useTranslation from "../hooks/useTranslation";
import FarmersDashboard from "../components/FarmersDashboard";

export default function Home() {
  const t = useTranslation();

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

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-blue-50 via-emerald-50 to-teal-50 py-24 px-6 md:px-12 mb-20 shadow-2xl border border-white/20 backdrop-blur-sm">
        {/* Enhanced animated background elements */}
        <div
          className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-gradient-to-br from-green-300/30 to-emerald-400/20 blur-3xl rounded-full animate-pulse opacity-60"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[45rem] h-[45rem] bg-gradient-to-tr from-blue-300/25 to-cyan-400/15 blur-3xl rounded-full animate-pulse opacity-50"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-purple-300/20 to-pink-300/15 blur-2xl rounded-full animate-spin opacity-30"
          style={{ animationDuration: "20s" }}
        />

        {/* Floating geometric shapes */}
        <div
          className="absolute top-16 right-16 w-8 h-8 border-2 border-green-400/30 rounded-lg animate-spin opacity-60"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-20 left-20 w-6 h-6 border-2 border-blue-400/30 rounded-full animate-ping opacity-40"
          style={{ animationDuration: "3s" }}
        />

        <div className="relative grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slideInLeft">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/90 border border-green-200/50 text-sm shadow-lg backdrop-blur-md hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="text-xl animate-bounce">🌾</span>
              <span className="font-medium text-gray-700">
                {t("home_badge")}
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>

            <div className="relative">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent animate-fadeInUp leading-tight">
                {t("welcome")}
              </h1>
              <div className="absolute -z-10 top-4 left-4 text-5xl md:text-7xl font-black text-green-100/50 blur-sm">
                {t("welcome")}
              </div>
            </div>

            <p
              className="text-xl text-gray-700 max-w-2xl leading-relaxed animate-fadeInUp font-medium"
              style={{ animationDelay: "0.2s" }}
            >
              {t("tagline")}
            </p>

            <div
              className="flex flex-wrap gap-6 animate-fadeInUp"
              style={{ animationDelay: "0.4s" }}
            >
              <Link
                to="/signup"
                className="group relative px-8 py-4 rounded-2xl text-white font-bold shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-green-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  {t("signup")}
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
              </Link>

              <Link
                to="/disease-detection"
                className="group relative px-8 py-4 rounded-2xl text-white font-bold shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 group-hover:from-blue-600 group-hover:to-cyan-700 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">{t("diseaseDetection")}</span>
              </Link>
            </div>

            {/* Enhanced Stats */}
            <div
              className="grid grid-cols-3 gap-6 max-w-lg animate-fadeInUp"
              style={{ animationDelay: "0.6s" }}
            >
              {[
                {
                  value: "25k+",
                  label: t("home_stat_farmers"),
                  color: "green",
                  delay: "0.7s",
                },
                {
                  value: "120+",
                  label: t("home_stat_districts"),
                  color: "blue",
                  delay: "0.8s",
                },
                {
                  value: "4.8",
                  label: t("home_stat_rating"),
                  color: "purple",
                  delay: "0.9s",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group text-center p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-rotate-1 transition-all duration-300 animate-fadeInUp"
                  style={{ animationDelay: stat.delay }}
                >
                  <div
                    className={`text-4xl font-black bg-gradient-to-br from-${stat.color}-600 to-${stat.color}-800 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 mt-2">
                    {stat.label}
                  </div>
                  <div
                    className={`w-full h-1 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 rounded-full mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block animate-slideInRight">
            <div className="relative rounded-3xl bg-white/90 backdrop-blur-md border border-white/50 p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:rotate-1">
              {/* Floating indicators */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg" />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-bounce" />

              <div className="grid grid-cols-2 gap-8">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="group relative p-6 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200/50 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fadeInScale"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 mb-4">
                        {f.icon}
                      </div>
                      <div className="font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300 mb-2">
                        {t(f.key)}
                      </div>
                      <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {t(f.descKey)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs text-gray-500 text-center italic animate-pulse">
                {t("home_card_hint")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <FarmersDashboard />
      </section>

      {/* Enhanced Offers Section */}
      <section className="mb-20">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 relative">
            {t("home_offers_title")}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full" />
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("home_offers_sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="group animate-fadeInUp"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <Card className="text-center hover:shadow-2xl transform hover:scale-105 hover:-translate-y-4 transition-all duration-500 bg-gradient-to-br from-white to-gray-50 border-2 border-transparent hover:border-green-200 relative overflow-hidden">
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative p-8">
                  <div className="text-6xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                    {t(f.key)}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {t(f.descKey)}
                  </p>
                  <Link
                    to={
                      f.key === "diseaseDetection"
                        ? "/disease-detection"
                        : f.key === "cropSuggestions"
                        ? "/suggestions"
                        : "/profile"
                    }
                    className="group/btn relative inline-block px-8 py-3 rounded-xl font-bold text-white overflow-hidden transform hover:scale-110 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 group-hover/btn:from-green-600 group-hover/btn:to-blue-600 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <span className="relative">{t("home_learn_more")}</span>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Tech Section */}
      <section className="mb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl opacity-50" />
        <div className="relative p-12">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              {t("home_tech_title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("home_tech_sub")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tech.map((x, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 animate-fadeInUp relative overflow-hidden"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">
                    {x.icon}
                  </div>
                  <div className="font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {x.title}
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                    {x.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Goals Section */}
      <section className="mb-20">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 relative">
            {t("home_goals_title")}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("home_goals_sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {goals.map((g, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-4 transition-all duration-500 animate-fadeInUp overflow-hidden"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5 rounded-2xl">
                <div className="w-full h-full bg-white rounded-2xl" />
              </div>

              {/* Background animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative">
                <div className="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">
                  {g.icon}
                </div>
                <div className="font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300">
                  {g.title}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  {g.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="mb-24">
        <div className="relative animate-fadeInUp overflow-hidden">
          <Card className="relative shadow-2xl border-2 border-transparent bg-gradient-to-br from-white via-blue-50 to-green-50 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full blur-2xl animate-pulse" />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            <div className="relative p-12">
              <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-gray-800 relative">
                <span className="text-4xl mr-4">🚀</span>
                {t("home_get_started")}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full" />
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  {[
                    {
                      num: 1,
                      text: t("home_step_profile"),
                      color: "green",
                      delay: "0.2s",
                    },
                    {
                      num: 2,
                      text: t("home_step_field"),
                      color: "blue",
                      delay: "0.4s",
                    },
                    {
                      num: 3,
                      text: t("home_step_reco"),
                      color: "purple",
                      delay: "0.6s",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-6 animate-fadeInLeft"
                      style={{ animationDelay: step.delay }}
                    >
                      <div
                        className={`relative w-12 h-12 bg-gradient-to-br from-${step.color}-400 to-${step.color}-600 rounded-full flex items-center justify-center font-black text-white shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}
                      >
                        <span className="relative z-10">{step.num}</span>
                        <div
                          className={`absolute inset-0 bg-${step.color}-300 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                        />
                      </div>
                      <span className="text-gray-700 font-semibold text-lg group-hover:text-gray-900 transition-colors duration-300">
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl p-10 text-center shadow-xl border border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-500 animate-fadeInRight">
                    {/* Floating particles */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60" />
                    <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-50" />

                    <h3 className="font-black text-2xl text-gray-800 mb-4">
                      {t("home_ready")}
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                      {t("home_join_note")}
                    </p>
                    <Link
                      to="/signup"
                      className="group relative inline-block px-10 py-4 rounded-2xl text-white font-black text-lg shadow-2xl overflow-hidden transform hover:scale-110 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 group-hover:from-green-600 group-hover:via-blue-600 group-hover:to-purple-600 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative flex items-center justify-center gap-3">
                        {t("signup")}
                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                          →
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
