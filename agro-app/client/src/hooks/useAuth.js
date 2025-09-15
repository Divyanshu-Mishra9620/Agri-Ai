import { useSelector } from 'react-redux';
export default function useAuth() {
  const { isAuthenticated, user, accessToken } = useSelector((s) => s.auth);
  return { isAuthenticated, user, accessToken };
}