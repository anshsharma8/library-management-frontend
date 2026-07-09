import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem('token');
  const initialUser = savedToken ? decodeToken(savedToken) : null;

  const [user, setUser] = useState(initialUser);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(decodeToken(token));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}