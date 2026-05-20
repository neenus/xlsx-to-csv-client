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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

  const handleLogin = async (credentials: { email: string, password: string }) => {
    try {
      const data: any = await login(credentials);
      // nr-auth responds as { success, data: { token, user } }
      const { token: authToken, user: authUser } = data.data;
      localStorage.setItem('auth_token', authToken);
      setUser(authUser);
      setToken(authToken);
    } catch (error) {
      console.error('Error logging in user', error);
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out user', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setToken(null);
    }
  }

  return (
    <UserContext.Provider value={{ user, token, handleLogin, handleLogout }} >
      {children}
    </UserContext.Provider>
  )
};

export default UserContext;