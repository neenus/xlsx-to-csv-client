import React, { createContext, useContext, ReactNode, useState } from 'react';
import { login, logout } from '../api/apiService';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  handleLogin: (credentials: { email: string, password: string }) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const USER_STORAGE_KEY = 'auth_user';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

  const handleLogin = async (credentials: { email: string, password: string }) => {
    const data: any = await login(credentials);
    const { token: authToken, user: authUser } = data.data ?? {};

    if (!authToken || !authUser) {
      throw new Error(
        data.data?.requiresTwoFactor
          ? 'Two-factor authentication is not supported in this app'
          : 'Login failed — unexpected response from server'
      );
    }

    localStorage.setItem('auth_token', authToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    setToken(authToken);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out user', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setToken(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, token, handleLogin, handleLogout }} >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
