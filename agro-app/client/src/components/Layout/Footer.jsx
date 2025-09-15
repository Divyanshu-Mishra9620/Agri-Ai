import useTranslation from '../../hooks/useTranslation';

export default function Footer() {
  const t = useTranslation();
  return (
    <footer className="mt-16 py-8 text-center bg-white border-t animate-fadeIn">
      <div className="text-sm text-gray-600">
        © {new Date().getFullYear()} AgriPortal — {t('copyright')}
      </div>
    </footer>
  );
}
