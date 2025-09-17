import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { clearCredentials } from "../../features/auth/authSlice";
import LanguagueSelector from "../../features/languague/components/LanguagueSelector";
import useTranslation from "../../hooks/useTranslation";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [logout] = useLogoutMutation();
  const t = useTranslation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {}
    dispatch(clearCredentials());
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `font-medium ${
      isActive
        ? "text-green-700 border-b-2 border-green-700" // Active link style
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <header className="header-bg shadow-lg sticky top-0 z-40">
      <div className="container px-4 py-4 flex justify-between items-center animate-slideIn">
        <NavLink
          to="/"
          className="font-bold text-2xl text-green-700 hover:text-green-800"
        >
          🌾 AgriPortal
        </NavLink>
        <nav className="flex items-center gap-6">
          <NavLink to="/" className={linkClasses}>
            {t("home")}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/trending-news" className={linkClasses}>
                {t("agriTrending")}
              </NavLink>
              <NavLink to="/disease-detection" className={linkClasses}>
                {t("diseaseDetection")}
              </NavLink>
              <NavLink to="/suggestions" className={linkClasses}>
                {t("suggestions")}
              </NavLink>
              <NavLink to="/community" className={linkClasses}>
                {t("Community Chat") || "Community Chat"}
              </NavLink>
              <NavLink to="/profile" className={linkClasses}>
                {t("profile")}
              </NavLink>
              <NavLink to="/voice-chat" className={linkClasses}>
                {t("ChatBot")}
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses}>
                {t("login")}
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-white font-medium ${
                    isActive
                      ? "bg-green-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`
                }
              >
                {t("signup")}
              </NavLink>
            </>
          )}
          <LanguagueSelector />
        </nav>
      </div>
    </header>
  );
}
