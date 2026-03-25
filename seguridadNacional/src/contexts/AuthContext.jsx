import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setUser({ token });
    }

    setLoading(false);
  }, []);

  const login = async (nombre_usuario, contrasena) => {
    try {
      const response = await client.post('/auth/login', { nombre_usuario, contrasena });
      const token = response.data.token || response.data.access_token || response.data?.data?.token;

      if (!token) {
        throw new Error('No se recibió token en la respuesta del servidor');
      }

      localStorage.setItem('token', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};