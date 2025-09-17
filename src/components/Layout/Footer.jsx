import useTranslation from '../../hooks/useTranslation';

export default function Footer() {
  const t = useTranslation();
  return (
    <footer className="mt-16 py-6 bg-green-50 border-t-2 border-green-200 text-center animate-fadeIn">
      <div className="text-sm text-green-900 font-medium">
        © {new Date().getFullYear()} 🌾 AgriPortal — {t('copyright')}
      </div>
      <div className="mt-2 text-xs text-green-700">
        {t('home')} • {t('profile')} • {t('suggestions')}
      </div>
    </footer>
  );
}
