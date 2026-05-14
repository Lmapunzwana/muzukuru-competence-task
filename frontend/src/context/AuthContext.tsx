import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextValue { token: string | null; user: User | null; login: (t: string, u: User | null) => void; logout: () => void }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const login = (t: string, u: User | null) => { localStorage.setItem('token', t); setToken(t); setUser(u); };
  const logout = () => { localStorage.removeItem('token'); setToken(null); setUser(null); };
  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext unavailable');
  return ctx;
};
