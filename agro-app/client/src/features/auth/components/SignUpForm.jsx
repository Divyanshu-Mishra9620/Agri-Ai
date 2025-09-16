import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    const lang = currentLanguage; 

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
      </div>
    </div>
  );
}
