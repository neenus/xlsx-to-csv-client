import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getProfile } from '../api/apiService';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
  handleLogin: (credentials: { email: string; password: string }) => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rehydrate session from cookie on app load
  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
      // 401 is expected when not logged in — suppress error
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Clear user state when any API call returns 401
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const handleLogin = useCallback(async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiLogin(credentials);
      if (!data?.user) throw new Error('Login failed — unexpected response from server');
      setUser(data.user);
    } catch (err: any) {
      const message = err?.message || 'Login failed';
      setError(message);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiLogout();
    } catch (err: any) {
      const message = err?.message || 'Logout failed';
      setError(message);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<UserContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      isLoading,
      error,
      handleLogin,
      handleLogout,
      refreshProfile,
    }),
    [user, isInitializing, isLoading, error, handleLogin, handleLogout, refreshProfile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
