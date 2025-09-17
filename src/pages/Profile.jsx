import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getAllStates, getDistricts } from "india-state-district";
import toast from "react-hot-toast";
import PrivateRoute from "../features/auth/components/PrivateRoute";
import ProfileCard from "../features/user/components/ProfileCard";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { VALIDATION_MESSAGES } from "../utils/ValidationMessages";
import { useGetProfileQuery, useUpdateProfileMutation } from "../features/user/userApi";
import useTranslation from "../hooks/useTranslation";
import { updateUser } from "../features/auth/authSlice";

function ProfileInner() {
  const { data: profile, isLoading, refetch } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const dispatch = useDispatch();
  const t = useTranslation();
  const currentLanguage = useSelector((state) => state.language.current);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    state: "",
    district: "",
    address: "",
    dob: "",
    language: "en",
  });

  const [formErrors, setFormErrors] = useState({});
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        state: profile.state || "",
        district: profile.district || "",
        address: profile.address || "",
        dob: profile.dob || "",
        language: profile.language || "en",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const lang = currentLanguage;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Validation logic (keeping original functionality)
    switch (name) {
      case "name":
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, name: VALIDATION_MESSAGES.name.required[lang] }));
        } else if (value.trim().length < 3) {
          setFormErrors((prev) => ({ ...prev, name: VALIDATION_MESSAGES.name.min[lang] }));
        } else if (value.trim().length > 50) {
          setFormErrors((prev) => ({ ...prev, name: VALIDATION_MESSAGES.name.max[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, name: "" }));
        }
        break;
      case "phone":
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!value.trim()) {
          setFormErrors((prev) => ({
            ...prev,
            phone: VALIDATION_MESSAGES?.phone?.required?.[lang] || "Phone is required"
          }));
        } else if (!phoneRegex.test(value)) {
          setFormErrors((prev) => ({
            ...prev,
            phone: VALIDATION_MESSAGES?.phone?.invalid?.[lang] || "Invalid phone number"
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, phone: "" }));
        }
        break;
      case "state":
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, state: VALIDATION_MESSAGES.state.required[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, state: "" }));
        }
        setForm((prev) => ({ ...prev, district: "" }));
        break;
      case "district":
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, district: VALIDATION_MESSAGES.district.required[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, district: "" }));
        }
        break;
      case "address":
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, address: VALIDATION_MESSAGES.address.required[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, address: "" }));
        }
        break;
      case "language":
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, language: VALIDATION_MESSAGES.language.required[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, language: "" }));
        }
        break;
      default:
        break;
    }
  };

  const isFormValid = () => {
    const hasEmptyFields = Object.values(form).some((value) => !value || value === "");
    const hasErrors = Object.values(formErrors).some((error) => error && error !== "");
    return !hasEmptyFields && !hasErrors;
  };

  const submit = async () => {
    if (!isFormValid()) {
      toast.error(t("fixErrorsBeforeSubmitting"));
      return;
    }
    try {
      const updated = await updateProfile(form).unwrap();
      dispatch(updateUser(updated));
      toast.success(t("profileUpdatedSuccessfully"));
      setEditing(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || t("somethingWentWrong"));
    }
  };

  if (isLoading) return <LoadingSpinner label={t("loading")} />;

  if (!profile) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
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
            className="absolute bottom-40 right-20 text-3xl opacity-5"
            animate={{
              y: [20, -20, 20],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          >
            👤
          </motion.div>
        </div>

        <motion.div
          className="relative text-center p-12 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl max-w-lg border border-white/60"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="text-8xl mb-8"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🚫
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            {t("profileNotFound")}
          </h2>
          <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8">{t("noProfileFoundDescription")}</p>
          <motion.button
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("goToHome")}
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

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
          👤
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-3xl opacity-5"
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 4 }}
        >
          📊
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Clean Header - matching homepage style */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/80 backdrop-blur-xl border border-white/60 mb-8 shadow-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span 
              className="text-3xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🌾
            </motion.span>
            <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t("farmerProfileManagement")}
            </span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-6 tracking-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("yourFarmProfile")}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t("manageProfileDescription")}
          </motion.p>

          {/* Weather Widget - clean green theme */}
          <motion.div 
            className="mt-8 inline-flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-2xl">🌤️</span>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-800">{t("todaysWeather")}</div>
              <div className="text-xs text-gray-600">28°C • {t("partlyCloudy")}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Profile Layout */}
        <motion.div
          className="grid lg:grid-cols-12 gap-8 items-start"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Clean Profile Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Summary Card - clean green theme */}
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-2xl border border-white/60 p-8 overflow-hidden relative"
              whileHover={{ y: -5, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Clean background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-2xl" />
              
              <div className="relative text-center mb-8">
                <motion.div 
                  className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-6 shadow-xl relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    🧑‍🌾
                  </motion.span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h3>
                <p className="text-gray-600 font-medium">{profile.email}</p>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {t("activeStatus")}
                </div>
              </div>

              {/* Clean Stats Grid - consistent green theme */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-black text-green-700 mb-1">15</div>
                  <div className="text-xs text-green-600 font-bold">{t("cropsMonitored")}</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-black text-emerald-700 mb-1">23</div>
                  <div className="text-xs text-emerald-600 font-bold">{t("reportsGenerated")}</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-black text-green-700 mb-1">4.9</div>
                  <div className="text-xs text-green-600 font-bold">{t("satisfactionScore")}</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Clean Quick Actions */}
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-2xl border border-white/60 p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                {t("quickActions")}
              </h4>
              
              <div className="space-y-3">
                {[
                  { icon: "🌱", label: t("viewCropSuggestions") },
                  { icon: "🔍", label: t("diseaseDetection") },
                  { icon: "📊", label: t("analyticsDashboard") },
                  { icon: "🌾", label: t("harvestPlanner") },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-green-100 border border-gray-200 hover:border-green-200 transition-all duration-300 flex items-center gap-4 group shadow-sm hover:shadow-md"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {action.icon}
                    </span>
                    <span className="font-semibold text-gray-700 group-hover:text-green-700">
                      {action.label}
                    </span>
                    <span className="ml-auto text-gray-400 group-hover:text-green-600 transition-colors">
                      →
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Clean Farm Statistics */}
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-2xl border border-white/60 p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-2xl">📈</span>
                {t("farmStatistics")}
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <span className="text-sm font-semibold text-green-800">{t("totalLandArea")}</span>
                  <span className="text-lg font-bold text-green-700">5.2 {t("acres")}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                  <span className="text-sm font-semibold text-emerald-800">{t("activeCrops")}</span>
                  <span className="text-lg font-bold text-emerald-700">3 {t("types")}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <span className="text-sm font-semibold text-green-800">{t("nextHarvest")}</span>
                  <span className="text-lg font-bold text-green-700">45 {t("days")}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Clean Main Profile Form */}
          <div className="lg:col-span-8">
            <motion.div 
              className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/60 p-10 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Clean background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100/20 to-emerald-100/20 rounded-full blur-3xl" />

              <AnimatePresence mode="wait">
                {!editing ? (
                  <motion.div
                    key="view"
                    className="space-y-10 relative z-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h2 className="text-4xl font-black text-gray-800 mb-2">{t("profileInformation")}</h2>
                        <p className="text-gray-600 font-medium">{t("viewYourProfileDetails")}</p>
                      </div>
                      <motion.button
                        onClick={() => setEditing(true)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-xl font-bold transition-all duration-300 flex items-center gap-3 relative overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="text-xl">✏️</span>
                        <span className="relative z-10">{t("editProfile")}</span>
                      </motion.button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {[
                        { label: t("fullName"), value: profile.name, icon: "👤" },
                        { label: t("emailAddress"), value: profile.email, icon: "📧" },
                        { label: t("phoneNumber"), value: profile.phone, icon: "📱" },
                        { label: t("state"), value: profile.state, icon: "🗺️" },
                        { label: t("district"), value: profile.district, icon: "📍" },
                        { label: t("preferredLanguage"), value: profile.language === "hi" ? "हिंदी" : profile.language === "te" ? "తెలుగు" : "English", icon: "🌐" },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <ProfileCard 
                            label={item.label} 
                            value={item.value} 
                            icon={item.icon}
                            className="transform group-hover:scale-105 transition-transform duration-200" 
                          />
                        </motion.div>
                      ))}
                    </div>

                    {profile.address && (
                      <motion.div 
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <ProfileCard 
                          label={t("completeAddress")} 
                          value={profile.address} 
                          icon="🏠"
                          className="transform hover:scale-105 transition-transform duration-200" 
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="edit"
                    className="space-y-10 relative z-10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h2 className="text-4xl font-black text-gray-800 mb-2">{t("editProfile")}</h2>
                        <p className="text-gray-600 font-medium">{t("updateYourInformation")}</p>
                      </div>
                      <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow-lg">
                        <span className={`w-3 h-3 rounded-full ${isFormValid() ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
                        <span className="text-sm font-semibold text-gray-700">
                          {isFormValid() ? t("allFieldsValid") : t("fillRequiredFields")}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Form fields with clean green theme */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          {t("fullName")}
                        </label>
                        <div className="relative">
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
                            placeholder={t("enterFullName")}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
                        </div>
                        {formErrors.name && (
                          <motion.p 
                            className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <span>⚠️</span>{formErrors.name}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                          <span className="text-lg">📱</span>
                          {t("phoneNumber")}
                        </label>
                        <div className="relative">
                          <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
                            placeholder={t("enterPhoneNumber")}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
                        </div>
                        {formErrors.phone && (
                          <motion.p 
                            className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <span>⚠️</span>{formErrors.phone}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* State and District dropdowns with clean styling */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                          <span className="text-lg">🗺️</span>
                          {t("state")}
                        </label>
                        <div className="relative">
                          <motion.div
                            className="w-full rounded-2xl border-2 border-gray-200 p-5 cursor-pointer transition-all duration-300 bg-gray-50/80 hover:bg-white hover:border-green-300 flex items-center justify-between shadow-inner relative overflow-hidden"
                            onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                            <span className={`font-medium relative z-10 ${form.state ? "text-gray-800" : "text-gray-400"}`}>
                              {form.state ? getAllStates().find((s) => s.code === form.state)?.name : t("selectYourState")}
                            </span>
                            <motion.span 
                              className="text-xl relative z-10"
                              animate={{ rotate: stateDropdownOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              🔽
                            </motion.span>
                          </motion.div>
                          
                          <AnimatePresence>
                            {stateDropdownOpen && (
                              <motion.div
                                className="absolute top-full left-0 w-full max-h-64 overflow-y-auto bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-2xl z-30 shadow-2xl mt-2"
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                {getAllStates().map((s, index) => (
                                  <motion.div
                                    key={s.code}
                                    className="p-4 hover:bg-green-50 hover:text-green-800 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-0 font-medium"
                                    onClick={() => {
                                      handleChange({ target: { name: "state", value: s.code } });
                                      setStateDropdownOpen(false);
                                    }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    whileHover={{ x: 5 }}
                                  >
                                    {s.name}
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {formErrors.state && (
                          <motion.p 
                            className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <span>⚠️</span>{formErrors.state}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                          <span className="text-lg">📍</span>
                          {t("district")}
                        </label>
                        <div className="relative">
                          <motion.div
                            className={`w-full rounded-2xl border-2 border-gray-200 p-5 cursor-pointer transition-all duration-300 bg-gray-50/80 flex items-center justify-between shadow-inner relative overflow-hidden ${!form.state ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:border-green-300"}`}
                            onClick={() => form.state && setDistrictDropdownOpen(!districtDropdownOpen)}
                            whileHover={form.state ? { scale: 1.02 } : {}}
                            whileTap={form.state ? { scale: 0.98 } : {}}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                            <span className={`font-medium relative z-10 ${form.district ? "text-gray-800" : "text-gray-400"}`}>
                              {form.district || t("selectYourDistrict")}
                            </span>
                            <motion.span 
                              className="text-xl relative z-10"
                              animate={{ rotate: districtDropdownOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              🔽
                            </motion.span>
                          </motion.div>
                          
                          <AnimatePresence>
                            {districtDropdownOpen && form.state && (
                              <motion.div
                                className="absolute top-full left-0 w-full max-h-64 overflow-y-auto bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-2xl z-30 shadow-2xl mt-2"
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                {getDistricts(form.state).map((d, index) => (
                                  <motion.div
                                    key={d}
                                    className="p-4 hover:bg-green-50 hover:text-green-800 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-0 font-medium"
                                    onClick={() => {
                                      handleChange({ target: { name: "district", value: d } });
                                      setDistrictDropdownOpen(false);
                                    }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    whileHover={{ x: 5 }}
                                  >
                                    {d}
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {formErrors.district && (
                          <motion.p 
                            className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <span>⚠️</span>{formErrors.district}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div 
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                          <span className="text-lg">🌐</span>
                          {t("preferredLanguage")}
                        </label>
                        <div className="relative">
                          <select
                            name="language"
                            value={form.language}
                            onChange={handleChange}
                            className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner appearance-none cursor-pointer"
                          >
                            <option value="en">🇺🇸 English</option>
                            <option value="hi">🇮🇳 हिंदी</option>
                            <option value="te">🇮🇳 తెలుగు</option>
                          </select>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
                          <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Address field */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                        <span className="text-lg">🏠</span>
                        {t("completeAddress")}
                      </label>
                      <div className="relative">
                        <textarea
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full rounded-2xl border-2 border-gray-200 p-5 h-36 resize-none focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
                          placeholder={t("enterCompleteAddress")}
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
                      </div>
                      {formErrors.address && (
                        <motion.p 
                          className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span>⚠️</span>{formErrors.address}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Clean action buttons */}
                    <motion.div 
                      className="flex gap-6 justify-end pt-10 border-t-2 border-gray-200/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <motion.button
                        onClick={() => setEditing(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-10 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-xl">❌</span>
                        <span>{t("cancel")}</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={submit}
                        className={`px-10 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-lg ${
                          isFormValid()
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-2xl"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                        }`}
                        disabled={!isFormValid()}
                        whileHover={isFormValid() ? { scale: 1.05 } : {}}
                        whileTap={isFormValid() ? { scale: 0.95 } : {}}
                      >
                        <span className="text-xl">💾</span>
                        <span>{t("saveChanges")}</span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <PrivateRoute>
      <ProfileInner />
    </PrivateRoute>
  );
}
