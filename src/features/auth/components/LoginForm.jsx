import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion';
=======
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
import { useLoginMutation } from '../authApi';
import { setCredentials } from '../authSlice';
import Input from '../../../components/UI/Input';
import useTranslation from '../../../hooks/useTranslation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { VALIDATION_MESSAGES } from '../../../utils/ValidationMessages';

<<<<<<< HEAD
=======

>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
export default function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const lang = useSelector((state) => state.language.current);

  // Field validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    switch (name) {
      case 'email':
        const emailRegex = /\S+@\S+\.\S+/;
        if (!value.trim()) {
          setFormErrors(prev => ({ ...prev, email: VALIDATION_MESSAGES.email.required[lang] }));
        } else if (!emailRegex.test(value)) {
          setFormErrors(prev => ({ ...prev, email: VALIDATION_MESSAGES.email.invalid[lang] }));
        } else {
          setFormErrors(prev => ({ ...prev, email: '' }));
        }
        break;

      case 'password':
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!value.trim()) {
          setFormErrors(prev => ({ ...prev, password: VALIDATION_MESSAGES.password.required[lang] }));
        } else if (!passwordRegex.test(value)) {
          setFormErrors(prev => ({ ...prev, password: VALIDATION_MESSAGES.password.invalid[lang] }));
        } else {
          setFormErrors(prev => ({ ...prev, password: '' }));
        }
        break;

      default:
        break;
    }
  };

  // Form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

<<<<<<< HEAD
=======
   
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
    if (formErrors.email || formErrors.password || !form.email || !form.password) {
      toast.error(t('fillValidFields') || 'Please fill valid fields');
      return;
    }

    try {
      const res = await login(form).unwrap();
      dispatch(
        setCredentials({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
        })
      );
      toast.success(t('loginSuccess') || 'Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || t('loginFailed') || 'Login failed');
      setError(t('loginFailed') || 'Login failed');
    }
  };

  const isFormValid = () => {
    return form.email && form.password && !formErrors.email && !formErrors.password;
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
          🔐
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-3xl opacity-5"
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 4 }}
        >
          👤
        </motion.div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          className="w-full max-w-md"
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
                Welcome Back Farmer
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
              {t('login')}
            </h2>
            <p className="text-xl text-gray-600 font-medium leading-relaxed">
              {t('welcomeBack') || 'Sign in to continue your farming journey'}
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

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 shadow-lg"
                >
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-6 relative z-10">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('email')}
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
                    placeholder={t('enterEmailAddress') || "Enter your email address"}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t('password')}
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border-2 border-gray-200 p-5 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-300 bg-gray-50/80 focus:bg-white text-gray-800 font-medium shadow-inner"
                    placeholder={t('enterPassword') || "Enter your password"}
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

              {/* Submit Button */}
              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 relative overflow-hidden group ${
                    isFormValid() && !isLoading
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  whileHover={isFormValid() && !isLoading ? { scale: 1.02 } : {}}
                  whileTap={isFormValid() && !isLoading ? { scale: 0.98 } : {}}
                >
                  {isFormValid() && !isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="relative z-10">{t('loggingIn') || 'Signing In...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🔓</span>
                      <span className="relative z-10">{t('login') || 'Sign In'}</span>
                    </>
                  )}
                </motion.button>

                {/* Footer Links */}
                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <p className="text-gray-600 font-medium mb-4">
                    <span>{t('dontHaveAccount') || "Don't have an account?"} </span>
                    <motion.span
                      className="text-green-600 hover:text-green-700 font-semibold cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate("/signup")}
                    >
                      {t('signup') || 'Sign Up'}
                    </motion.span>
                  </p>

                  <motion.div
                    className="text-sm text-gray-500"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="cursor-pointer hover:text-green-600 transition-colors duration-200">
                      {t('forgotPassword') || 'Forgot your password?'}
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60">
              <span className="text-lg">🛡️</span>
              <span className="text-sm font-medium text-gray-700">
                {t('secureLogin') || 'Secure & encrypted login'}
              </span>
            </div>
          </motion.div>
        </motion.div>
=======
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-3xl shadow-lg animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🌾</div>
            <h2 className="text-2xl font-bold text-gray-800">{t('login')}</h2>
            <p className="text-sm text-gray-500 mt-1">{t('welcomeBack')}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-lg animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
                  placeholder="you@example.com"
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`pl-10 ${formErrors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('loggingIn')}
                </>
              ) : (
                t('login')
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{t('dontHaveAccount')} </span>
            <Link
              to="/signup"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {t('signup')}
            </Link>
          </div>
        </div>
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      </div>
    </div>
  );
}
