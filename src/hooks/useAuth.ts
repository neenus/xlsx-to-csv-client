import { useUser } from "../context/UserContext";

const useAuth = () => {
  const { user, isAuthenticated, isInitializing, isLoading, error, handleLogin, handleLogout, refreshProfile } = useUser();
  return { isAuthenticated, isInitializing, isLoading, error, user, handleLogin, handleLogout, refreshProfile };
}

export default useAuth;
