import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token } = response.data;
    await AsyncStorage.setItem('token', token);
    setUserToken(token);
  };

  const register = async (businessName, email, password) => {
    const response = await apiClient.post('/auth/register', { businessName, email, password });
    const { token } = response.data;
    await AsyncStorage.setItem('token', token);
    setUserToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
  };

  useEffect(() => {
    const isLoggedIn = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem('token');
      } catch (e) { console.log(e); }
      setUserToken(token);
      setIsLoading(false);
    };
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};