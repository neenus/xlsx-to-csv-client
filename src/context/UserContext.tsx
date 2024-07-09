import React, { createContext, useContext, ReactNode, useState } from 'react';
import { login, logout } from '../api/apiService';

interface User {
  id: string;
  name: string;
  email: string;
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
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (credentials: { email: string, password: string }) => {
    try {
      const data: any = await login(credentials);
      // set user and token in context
      setUser(data.user);
      setToken(data.token);
    } catch (error) {
      console.error('Error logging in user', error);
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error logging out user', error);
    }
  }

  return (
    <UserContext.Provider value={{ user, token, handleLogin, handleLogout }} >
      {children}
    </UserContext.Provider>
  )
};

export default UserContext;