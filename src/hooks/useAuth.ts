import { useUser } from "../context/UserContext";

const useAuth = () => {
  const { user, token, handleLogin, handleLogout } = useUser();
  const isAuthenticated = !!user;

  return { isAuthenticated, user, token, handleLogin, handleLogout };
}

export default useAuth;