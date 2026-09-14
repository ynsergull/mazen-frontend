"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ApiError, apiFetch } from "@/lib/api-client";
import type { User } from "@/types/api";

/** Giris/cikis sonrasi sepet gibi bagimli durumlar bu olayi dinler (misafir sepeti uyeye birlesir). */
export const AUTH_CHANGED_EVENT = "mazen:auth-changed";

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function announce() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { user } = await apiFetch<{ user: User }>("/auth/me");
      setUserState(user);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setUserState(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiFetch<{ user: User }>("/auth/me")
      .then(({ user }) => active && setUserState(user))
      .catch(() => active && setUserState(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      refresh,
      setUser: setUserState,
      login: async (email, password, remember) => {
        const { user } = await apiFetch<{ user: User }>("/auth/login", { method: "POST", body: { email, password, remember } });
        setUserState(user);
        announce();
        return user;
      },
      register: async (input) => {
        const { user } = await apiFetch<{ user: User }>("/auth/register", { method: "POST", body: input });
        setUserState(user);
        announce();
        return user;
      },
      logout: async () => {
        await apiFetch("/auth/logout", { method: "POST" });
        setUserState(null);
        announce();
      },
    }),
    [user, loading, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth, AuthProvider icinde kullanilmali");
  return context;
}
