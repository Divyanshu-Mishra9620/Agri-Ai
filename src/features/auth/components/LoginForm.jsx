import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../authApi';
import { setCredentials } from '../authSlice';
import Input from '../../../components/UI/Input';
import useTranslation from '../../../hooks/useTranslation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { VALIDATION_MESSAGES } from '../../../utils/ValidationMessages';


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
      </div>
    </div>
  );
}
