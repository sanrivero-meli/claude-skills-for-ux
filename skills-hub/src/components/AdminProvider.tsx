"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type AdminContextValue = {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
};

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  login: async () => false,
  logout: () => {},
  token: null,
});

export function useAdmin() {
  return useContext(AdminContext);
}

const STORAGE_KEY = "skills-hub-admin-token";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setToken(stored);
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setToken(data.token);
    localStorage.setItem(STORAGE_KEY, data.token);
    return true;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin: !!token, login, logout, token }}>
      {children}
    </AdminContext.Provider>
  );
}
