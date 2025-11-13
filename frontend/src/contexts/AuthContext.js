import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      console.log('Making login request to:', axios.defaults.baseURL);
      // NOTE: include credentials so cookies (connect.sid) are sent/accepted
      const response = await axios.post(
        '/api/auth/login',
        { username, password },
        { withCredentials: true } // <-- important
      );
      console.log('Login response:', response.data);
      setUser(response.data.user);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      // improved logging (error.response may be undefined when blocked by CORS)
      if (error.response) {
        console.error('Login request failed:', error.response.status, error.response.data);
      } else {
        console.error('Login request failed:', error.message || error);
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // On mount, restore user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
