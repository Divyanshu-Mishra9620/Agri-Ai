import useTranslation from '../../hooks/useTranslation';

export default function Footer() {
  const t = useTranslation();
  return (
<<<<<<< HEAD
    <footer className="mt-16 py-6 bg-green-50 border-t-2 border-green-200 text-center animate-fadeIn">
      <div className="text-sm text-green-900 font-medium">
        © {new Date().getFullYear()} 🌾 AgriPortal — {t('copyright')}
      </div>
      <div className="mt-2 text-xs text-green-700">
        {t('home')} • {t('profile')} • {t('suggestions')}
=======
    <footer className="mt-16 py-8 text-center bg-white border-t animate-fadeIn">
      <div className="text-sm text-gray-600">
        © {new Date().getFullYear()} AgriPortal — {t('copyright')}
>>>>>>> 94d473ce04d6ac32fbdd4070ec6afde3e0326c9e
      </div>
    </footer>
  );
}
