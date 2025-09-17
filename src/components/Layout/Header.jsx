import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { clearCredentials } from "../../features/auth/authSlice";
import LanguagueSelector from "../../features/languague/components/LanguagueSelector";
import useTranslation from "../../hooks/useTranslation";
import Logo from "../../assets/icons/logo.png";

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
    `px-3 py-2 rounded-lg font-medium transition-colors
     ${isActive ? "bg-green-700 text-white" : "text-green-900 hover:bg-green-200"}`;

  return (
    <header className="bg-green-50 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src={Logo} alt="KRISHinova Logo" className="h-12 w-auto" />
        </NavLink>

        {/* Nav Links */}
        <nav className="flex items-center gap-3">
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
              <NavLink to="/voice-chat" className={linkClasses}>
                {t("chatBot")}
              </NavLink>
              <NavLink to="/profile" className={linkClasses}>
                {t("profile")}
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
                  `px-4 py-2 rounded-lg font-medium text-white ${
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
          {/* <LanguagueSelector /> */}
        </nav>
      </div>
    </header>
  );
}
