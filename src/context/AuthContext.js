import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const login = async (email, password) => {
    setLoading(true);
    try {
      const body = new URLSearchParams({ username: email, password });
      const res = await fetch(API_BASE+"/auth/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
      const data = await res.json();
      setToken(data.access_token);
      await AsyncStorage.setItem("token", data.access_token);
      return true;
    } catch { return false; } finally { setLoading(false); }
  };
  const logout = async () => { setToken(null); await AsyncStorage.removeItem("token"); };
  return React.createElement(AuthContext.Provider, { value: { token, login, logout, loading } }, children);
}
export const useAuth = () => useContext(AuthContext);
