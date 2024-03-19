// auth.context.js

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser({ userData, token });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isTokenExpired = (token) => {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const { exp } = JSON.parse(decodedPayload);
  
    return Date.now() >= exp * 1000;
  };
  

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
  
    return !!token && !isTokenExpired(token);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
