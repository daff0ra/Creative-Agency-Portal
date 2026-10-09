import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api, setAccessToken as setApiToken } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true sampai kita selesai cek status login

  // Jalan sekali tiap app pertama kali dibuka/di-refresh:
  // tukar cookie refreshToken jadi access token baru, lalu ambil data user.
  useEffect(() => {
    // client/src/context/AuthContext.jsx (ubah isi restoreSession)
    const restoreSession = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setApiToken(data.accessToken);
        setUser(data.user); // user langsung ikut dari response refresh
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []); // [] artinya cuma jalan sekali saat komponen pertama kali muncul, bukan tiap render

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

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);