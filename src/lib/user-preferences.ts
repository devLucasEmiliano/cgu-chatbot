"use client";

import { useEffect, useState } from "react";
import type { Language } from "@/src/app/page";

const PREFERENCES_COOKIE = "cgu_chatbot_preferences";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

const cookieAttributes = (maxAge: number) => {
  if (!isBrowser()) return "";

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  return `Max-Age=${maxAge}; Path=/; SameSite=Strict${secure}`;
};

const readCookie = (name: string) => {
  if (!isBrowser()) return null;

  const prefix = `${name}=`;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const match = cookies.find((cookie) => cookie.startsWith(prefix));

  if (!match) return null;

  return match.slice(prefix.length);
};

const writeCookie = (name: string, value: string, maxAge: number) => {
  if (!isBrowser()) return;

  document.cookie = `${name}=${value}; ${cookieAttributes(maxAge)}`;
};

const deleteCookie = (name: string) => {
  writeCookie(name, "", 0);
};

export interface UserPreferences {
  language: Language | null;
  termsAccepted: boolean;
  termsAcceptedAt?: string;
}

const defaultPreferences: UserPreferences = {
  language: null,
  termsAccepted: false,
};

// Funcao para salvar preferencias em cookie seguro
export function savePreferences(preferences: UserPreferences): void {
  try {
    const encoded = encodeURIComponent(JSON.stringify(preferences));
    writeCookie(PREFERENCES_COOKIE, encoded, COOKIE_MAX_AGE_SECONDS);
  } catch {
    // Silenciar erro - falhas ao persistir preferencias nao sao criticas
  }
}

// Funcao para carregar preferencias do cookie
export function loadPreferences(): UserPreferences {
  try {
    const stored = readCookie(PREFERENCES_COOKIE);
    if (!stored) return defaultPreferences;

    const parsed = JSON.parse(decodeURIComponent(stored)) as UserPreferences;
    return {
      ...defaultPreferences,
      ...parsed,
    };
  } catch {
    // Silenciar erro - falhas ao carregar preferencias usa valores padrao
    return defaultPreferences;
  }
}

// Hook personalizado para gerenciar preferencias
export function useUserPreferences() {
  const [preferences, setPreferencesState] =
    useState<UserPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadPreferences();
    setPreferencesState(loaded);
    setIsLoaded(true);
  }, []);

  const setPreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferencesState(updated);
    savePreferences(updated);
  };

  const setLanguage = (language: Language) => {
    setPreferences({ language });
  };

  const acceptTerms = () => {
    setPreferences({
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
    });
  };

  const clearPreferences = () => {
    const cleared = { ...defaultPreferences };
    setPreferencesState(cleared);
    deleteCookie(PREFERENCES_COOKIE);
  };

  return {
    preferences,
    isLoaded,
    setPreferences,
    setLanguage,
    acceptTerms,
    clearPreferences,
  };
}
