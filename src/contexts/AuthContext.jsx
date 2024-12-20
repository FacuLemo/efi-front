"use client"
import { createContext, useState, useEffect } from 'react';
import PostData from '@/components/PostData';
import decodeToken from '@/utils/decodeToken';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading');

  const setUserData = (token) => {
    const { currentUser } = decodeToken(token)
    setUser({
      email: currentUser.email,
      name: currentUser.name,
      id: currentUser.id,
    });
  }

  const login = async (email, password) => {
    try {
      const response = await PostData('/users/login', { email, password });
      const { authorizationToken } = response;
      localStorage.setItem('token', authorizationToken);
      setToken(authorizationToken);
      setUserData(authorizationToken);
      setAuthStatus('authenticated');
    } catch (error) {
      console.error("Login error", error);
      setAuthStatus('unauthenticated');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthStatus('unauthenticated');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setUserData(savedToken);
      setAuthStatus('authenticated');
    } else {
      setAuthStatus('unauthenticated');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authStatus }}>
      {children}
    </AuthContext.Provider>
  );
}
