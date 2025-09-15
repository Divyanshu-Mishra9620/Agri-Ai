import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../languagueSlice';
import { LANGS } from '../../../utils/constants';

export default function LanguagueSelector() {
  const dispatch = useDispatch();
  const current = useSelector((s) => s.language.current);
  const currentLang = LANGS.find(l => l.code === current);

  return (
    <div className="relative group">
      <button className="language-selector flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100">
        <span>{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.name}</span>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        {LANGS.map((lang) => (
          <button
            key={lang.code}
            onClick={() => dispatch(setLanguage(lang.code))}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
