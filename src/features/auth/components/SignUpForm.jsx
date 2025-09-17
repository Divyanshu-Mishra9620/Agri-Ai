import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
=======
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
import { useSignupMutation } from "../authApi";
import Input from "../../../components/UI/Input";
import useTranslation from "../../../hooks/useTranslation";
import { getAllStates, getDistricts } from "india-state-district";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { User, Mail, Lock, Calendar, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { VALIDATION_MESSAGES } from "../../../utils/ValidationMessages";
import { useSelector } from "react-redux";

export default function SignUpForm() {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();
  const t = useTranslation();
  const currentLanguage = useSelector((state) => state.language.current);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    state: "",
    district: "",
    address: "",
    dob: "",
    language: "en",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    state: "",
    district: "",
    address: "",
    dob: "",
    language: "",
  });

  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);

<<<<<<< HEAD
  const handleChange = (e) => {
    const { name, value } = e.target;
    const lang = currentLanguage;
=======

  const handleChange = (e) => {
    const { name, value } = e.target;
    const lang = currentLanguage; 
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e

    // Update form state
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validation logic
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

      case "email":
        const emailRegex = /\S+@\S+\.\S+/;
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, email: VALIDATION_MESSAGES.email.required[lang] }));
        } else if (!emailRegex.test(value)) {
          setFormErrors((prev) => ({ ...prev, email: VALIDATION_MESSAGES.email.invalid[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, email: "" }));
        }
        break;

      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, password: VALIDATION_MESSAGES.password.required[lang] }));
        } else if (!passwordRegex.test(value)) {
          setFormErrors((prev) => ({ ...prev, password: VALIDATION_MESSAGES.password.invalid[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, password: "" }));
        }
        break;

      case "state":
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, state: VALIDATION_MESSAGES.state.required[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, state: "" }));
        }
        // reset district when state changes
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

      case "dob":
        if (!value) {
          setFormErrors((prev) => ({ ...prev, dob: VALIDATION_MESSAGES.dob.required[lang] }));
        } else {
          setFormErrors((prev) => ({ ...prev, dob: "" }));
        }
        break;

      default:
        break;
    }
  };

<<<<<<< HEAD
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
  const isFormValid = () => {
    const hasEmptyFields = Object.values(form).some((value) => !value || value === "");
    const hasErrors = Object.values(formErrors).some((error) => error && error !== "");
    return !hasEmptyFields && !hasErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await signup(form).unwrap();
      toast.success("Account Created Successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
<<<<<<< HEAD
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
          📝
        </motion.div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header - matching homepage style */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
                Join the Farming Revolution
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
              {t("createAccount")}
            </h2>
            <p className="text-xl text-gray-600 font-medium leading-relaxed">
              {t("welcomeSignUp") || "Join thousands of smart farmers transforming agriculture"}
            </p>
          </motion.div>

          {/* Main Form Card */}
          <motion.div 
            className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/60 p-10 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Clean background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100/20 to-emerald-100/20 rounded-full blur-3xl" />

            <form onSubmit={onSubmit} className="space-y-6 relative z-10">
              {/* Name Field */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t("name")}
                </label>
                <div className="relative">
                  <Input
                    placeholder={t("enterFullName") || "Enter your full name"}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
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

              {/* Email Field */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t("email")}
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder={t("enterEmailAddress") || "Enter your email address"}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
                </div>
                {formErrors.email && (
                  <motion.p 
                    className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>⚠️</span>{formErrors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t("password")}
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder={t("enterStrongPassword") || "Create a strong password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
                </div>
                {formErrors.password && (
                  <motion.p 
                    className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>⚠️</span>{formErrors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* State & District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
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
                        {form.state ? getAllStates().find((s) => s.code === form.state)?.name : t("selectState")}
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
                                setForm({ ...form, state: s.code, district: "" });
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
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
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
                        {form.district || t("selectDistrict")}
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
                                setForm({ ...form, district: d });
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
              </div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">🏠</span>
                  {t("address")}
                </label>
                <div className="relative">
                  <textarea
                    placeholder={t("enterCompleteAddress") || "Enter your complete address"}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-2 border-gray-200 p-5 h-32 resize-none focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
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

              {/* DOB & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t("dateOfBirth")}
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={form.dob ? new Date(form.dob) : null}
                      onChange={(date) =>
                        handleChange({ target: { name: "dob", value: date ? date.toISOString().split("T")[0] : "" } })
                      }
                      className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
                      placeholderText={t("selectDate")}
                      dateFormat="yyyy-MM-dd"
                      maxDate={new Date()}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
                  </div>
                  {formErrors.dob && (
                    <motion.p 
                      className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span>⚠️</span>{formErrors.dob}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">🌐</span>
                    {t("language")}
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
                  {formErrors.language && (
                    <motion.p 
                      className="text-red-500 text-sm mt-3 flex items-center gap-2 font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span>⚠️</span>{formErrors.language}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <motion.button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 relative overflow-hidden group ${
                    isFormValid() && !isLoading
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isFormValid() || isLoading}
                  whileHover={isFormValid() && !isLoading ? { scale: 1.02 } : {}}
                  whileTap={isFormValid() && !isLoading ? { scale: 0.98 } : {}}
                >
                  {isFormValid() && !isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="relative z-10">{t("signingUp") || "Creating Account..."}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🚀</span>
                      <span className="relative z-10">{t("signup") || "Create Account"}</span>
                    </>
                  )}
                </motion.button>

                <motion.p 
                  className="mt-6 text-center text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  Already have an account?{" "}
                  <motion.span
                    className="text-green-600 hover:text-green-700 font-semibold cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </motion.span>
                </motion.p>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
=======
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white p-8 rounded-3xl shadow-lg animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🌾</div>
            <h2 className="text-2xl font-bold text-gray-800">{t("createAccount")}</h2>
            <p className="text-sm text-gray-500 mt-1">{t("welcomeSignUp") || "Join us to grow smarter"}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                placeholder={t("name")}
                name="name"
                value={form.name}
                onChange={handleChange}
                className="pl-10"
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder={t("email")}
                name="email"
                value={form.email}
                onChange={handleChange}
                className="pl-10"
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder={t("password")}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="pl-10"
              />
              {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
            </div>

            {/* State & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("state")}</label>
                <div
                  className="border rounded-lg p-2 cursor-pointer relative"
                  onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                >
                  {form.state ? getAllStates().find((s) => s.code === form.state)?.name : t("selectState")}
                  <div className={`absolute top-full left-0 w-full mt-1 border rounded-lg bg-white z-10 max-h-48 overflow-y-auto ${stateDropdownOpen ? "block" : "hidden"}`}>
                    {getAllStates().map((s) => (
                      <div
                        key={s.code}
                        className="p-2 hover:bg-emerald-100 cursor-pointer"
                        onClick={() => {
                          setForm({ ...form, state: s.code, district: "" });
                          setStateDropdownOpen(false);
                        }}
                      >
                        {s.name}
                      </div>
                    ))}
                  </div>
                </div>
                {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("district")}</label>
                <div
                  className={`border rounded-lg p-2 cursor-pointer relative ${!form.state ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => form.state && setDistrictDropdownOpen(!districtDropdownOpen)}
                >
                  {form.district ? form.district : t("selectDistrict")}
                  <div className={`absolute top-full left-0 w-full mt-1 border rounded-lg bg-white z-10 max-h-48 overflow-y-auto ${districtDropdownOpen ? "block" : "hidden"}`}>
                    {form.state &&
                      getDistricts(form.state).map((d) => (
                        <div
                          key={d}
                          className="p-2 hover:bg-emerald-100 cursor-pointer"
                          onClick={() => {
                            setForm({ ...form, district: d });
                            setDistrictDropdownOpen(false);
                          }}
                        >
                          {d}
                        </div>
                      ))}
                  </div>
                </div>
                {formErrors.district && <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <textarea
                placeholder={t("address")}
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-input w-full p-3 rounded-lg h-20 resize-none"
              />
              {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
            </div>

            {/* DOB & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("dateOfBirth")}</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <DatePicker
                    selected={form.dob ? new Date(form.dob) : null}
                    onChange={(date) =>
                      handleChange({ target: { name: "dob", value: date ? date.toISOString().split("T")[0] : "" } })
                    }
                    className="form-input w-full pl-10 p-2 rounded-lg border"
                    placeholderText={t("selectDate")}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                  />
                  {formErrors.dob && <p className="text-red-500 text-sm mt-1">{formErrors.dob}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("language")}</label>
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="form-input w-full p-3 rounded-lg"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="te">తెలుగు</option>
                </select>
                {formErrors.language && <p className="text-red-500 text-sm mt-1">{formErrors.language}</p>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("signingUp")}
                </>
              ) : (
                t("signup")
              )}
            </button>
          </form>
        </div>
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      </div>
    </div>
  );
}
