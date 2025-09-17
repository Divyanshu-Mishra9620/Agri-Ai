import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
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
        setForm((prev) => ({ ...prev, district: "" })); // reset district
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
      toast.error("Please fix the errors before submitting");
      return;
    }
    try {
      const updated = await updateProfile(form).unwrap();
      dispatch(updateUser(updated));
      toast.success("Profile updated successfully!");
      setEditing(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) return <LoadingSpinner label={t("loading")} />;

  if (!profile) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-green-200/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-200/30 blur-3xl rounded-full animate-pulse" />

        <motion.div
          className="relative text-center p-16 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl max-w-md border border-white/50"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-8xl mb-8 animate-bounce">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Profile Not Found</h2>
          <p className="text-lg text-gray-600 font-medium">{t("noProfileFound")}</p>
        </motion.div>
      </motion.div>
    );
  }

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
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/70 backdrop-blur border border-white/50 mb-6 shadow-lg">
            <span className="text-2xl">👨‍🌾</span>
            <span className="text-sm font-medium text-gray-700">Farmer Profile Management</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
            {t("yourProfile")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your agricultural profile and personalize your farming experience
          </p>
        </motion.div>

        {/* Main Profile Section */}
        <motion.div
          className="grid lg:grid-cols-12 gap-12 items-start"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Profile Stats Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-xl border border-white/50 p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4 shadow-lg">
                  👨‍🌾
                </div>
                <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                <p className="text-gray-600 text-sm">{profile.email}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="text-2xl font-bold text-green-700">12</div>
                  <div className="text-xs text-green-600 font-medium">Crops Monitored</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-700">8</div>
                  <div className="text-xs text-blue-600 font-medium">Reports Generated</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="text-2xl font-bold text-purple-700">4.8</div>
                  <div className="text-xs text-purple-600 font-medium">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-xl border border-white/50 p-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
                  <span className="text-lg">🌱</span>
                  <span className="text-sm font-medium text-gray-700">View Crop Suggestions</span>
                </button>
                <button className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
                  <span className="text-lg">🔍</span>
                  <span className="text-sm font-medium text-gray-700">Disease Detection</span>
                </button>
                <button className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
                  <span className="text-lg">📊</span>
                  <span className="text-sm font-medium text-gray-700">Analytics Dashboard</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Profile Form */}
          <div className="lg:col-span-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/50 p-12">
              {!editing ? (
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Profile Information</h2>
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-2xl shadow-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <span>✏️</span>
                      {t("editProfile")}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <ProfileCard label={t("name")} value={profile.name} />
                    <ProfileCard label={t("email")} value={profile.email} />
                    <ProfileCard label={t("phone")} value={profile.phone} />
                    <ProfileCard label={t("state")} value={profile.state} />
                    <ProfileCard label={t("district")} value={profile.district} />
                    <ProfileCard label={t("language")} value={profile.language === "hi" ? "हिंदी" : profile.language === "te" ? "తెలుగు" : "English"} />
                  </div>

                  {profile.address && (
                    <div className="mt-6">
                      <ProfileCard label={t("address")} value={profile.address} />
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Edit Profile</h2>
                    <div className="text-sm text-gray-500">
                      {isFormValid() ? "✅ All fields valid" : "⚠️ Please fill required fields"}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">{t("name")}</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-2xl border-2 border-gray-200 p-4 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                        placeholder="Enter your full name"
                      />
                      {formErrors.name && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><span>⚠️</span>{formErrors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">{t("phone")}</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-2xl border-2 border-gray-200 p-4 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                        placeholder="10-digit phone number"
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><span>⚠️</span>{formErrors.phone}</p>}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">{t("state")}</label>
                      <div className="relative">
                        <div
                          className="w-full rounded-2xl border-2 border-gray-200 p-4 cursor-pointer transition-all duration-300 bg-gray-50 hover:bg-white hover:border-green-300 flex items-center justify-between"
                          onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                        >
                          <span className={form.state ? "text-gray-800" : "text-gray-400"}>
                            {form.state ? getAllStates().find((s) => s.code === form.state)?.name : "Select your state"}
                          </span>
                          <span className={`transform transition-transform ${stateDropdownOpen ? "rotate-180" : ""}`}>🔽</span>
                        </div>
                        {stateDropdownOpen && (
                          <div className="absolute top-full left-0 w-full max-h-48 overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl z-20 shadow-2xl mt-2">
                            {getAllStates().map((s) => (
                              <div
                                key={s.code}
                                className="p-4 hover:bg-green-50 hover:text-green-800 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-0"
                                onClick={() => {
                                  handleChange({ target: { name: "state", value: s.code } });
                                  setStateDropdownOpen(false);
                                }}
                              >
                                {s.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {formErrors.state && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><span>⚠️</span>{formErrors.state}</p>}
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">{t("district")}</label>
                      <div className="relative">
                        <div
                          className={`w-full rounded-2xl border-2 border-gray-200 p-4 cursor-pointer transition-all duration-300 bg-gray-50 flex items-center justify-between ${!form.state ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:border-green-300"}`}
                          onClick={() => form.state && setDistrictDropdownOpen(!districtDropdownOpen)}
                        >
                          <span className={form.district ? "text-gray-800" : "text-gray-400"}>
                            {form.district || "Select your district"}
                          </span>
                          <span className={`transform transition-transform ${districtDropdownOpen ? "rotate-180" : ""}`}>🔽</span>
                        </div>
                        {districtDropdownOpen && form.state && (
                          <div className="absolute top-full left-0 w-full max-h-48 overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl z-20 shadow-2xl mt-2">
                            {getDistricts(form.state).map((d) => (
                              <div
                                key={d}
                                className="p-4 hover:bg-green-50 hover:text-green-800 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-0"
                                onClick={() => {
                                  handleChange({ target: { name: "district", value: d } });
                                  setDistrictDropdownOpen(false);
                                }}
                              >
                                {d}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {formErrors.district && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><span>⚠️</span>{formErrors.district}</p>}
                    </div>

                    {/* Language */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">{t("language")}</label>
                      <select
                        name="language"
                        value={form.language}
                        onChange={handleChange}
                        className="w-full rounded-2xl border-2 border-gray-200 p-4 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="te">తెలుగు</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">{t("address")}</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full rounded-2xl border-2 border-gray-200 p-4 h-32 resize-none focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="Enter your complete address"
                    />
                    {formErrors.address && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><span>⚠️</span>{formErrors.address}</p>}
                  </div>

                  <div className="flex gap-6 justify-end pt-8 border-t border-gray-200">
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2"
                    >
                      <span>❌</span>
                      {t("cancel")}
                    </button>
                    <button
                      onClick={submit}
                      className={`px-8 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${isFormValid()
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      disabled={!isFormValid()}
                    >
                      <span>💾</span>
                      {t("save")}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
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
