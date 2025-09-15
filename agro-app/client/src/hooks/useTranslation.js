import { useSelector } from 'react-redux';
import en from '../features/languague/translations/en';
import hi from '../features/languague/translations/hi';
import te from '../features/languague/translations/te';

const map = { en, hi, te };

export default function useTranslation() {
  const current = useSelector((s) => s.language.current);
  return (key) => map[current]?.[key] || map.en[key] || key;
}
