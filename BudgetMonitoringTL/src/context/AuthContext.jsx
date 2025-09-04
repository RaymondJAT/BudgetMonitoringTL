// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [access, setAccess] = useState([]);

  // ✅ Restore from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedAccess = localStorage.getItem("access");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setAccess(savedAccess ? JSON.parse(savedAccess) : []);
    }
  }, []);

  // ✅ Login function
  const login = (data, token, access) => {
    setUser(data);
    setToken(token);
    setAccess(access);

    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", token);
    localStorage.setItem("access", JSON.stringify(access));
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setAccess([]);

    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, access, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use auth easily
export const useAuth = () => useContext(AuthContext);
