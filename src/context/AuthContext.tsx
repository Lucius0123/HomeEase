import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '../types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: Role;
  login: (email: string, role?: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr-admin-1',
  name: 'Raj Chaurasiya',
  email: 'admin@homease.in',
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('homease_auth') === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('homease_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('homease_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('homease_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = (email: string, selectedRole: Role = 'Super Admin') => {
    const newUser: User = {
      ...DEFAULT_USER,
      email,
      role: selectedRole
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('homease_auth', 'true');
    localStorage.setItem('homease_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('homease_auth');
  };

  const setRole = (newRole: Role) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('homease_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role: user?.role || 'Super Admin',
        login,
        logout,
        setRole,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
