// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { api, setAccessToken as setApiToken } from "../api/axios.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setApiToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setApiToken(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// Custom hook — komponen lain tinggal panggil useAuth(), tidak perlu import useContext+AuthContext berulang
export const useAuth = () => useContext(AuthContext);