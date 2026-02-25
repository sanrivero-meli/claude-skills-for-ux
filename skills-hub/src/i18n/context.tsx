"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Locale, TranslationKey, Translations } from "./types";
import { DEFAULT_LOCALE } from "./types";

import en from "./locales/en.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

const dictionaries: Record<Locale, Translations> = {
  en,
  es,
  pt,
} as Record<Locale, Translations>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  tContent: (key: TranslationKey, fallback: string) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
  tContent: (_key, fallback) => fallback,
});

export function useTranslation() {
  return useContext(I18nContext);
}

const STORAGE_KEY = "skills-hub-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && dictionaries[stored]) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      let value = dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          value = value.replace(
            new RegExp(`\\{${paramKey}\\}`, "g"),
            String(paramValue)
          );
        });
      }
      return value;
    },
    [locale]
  );

  const tContent = useCallback(
    (key: TranslationKey, fallback: string): string => {
      if (locale === DEFAULT_LOCALE) return fallback;
      return dictionaries[locale]?.[key] ?? fallback;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tContent }}>
      {children}
    </I18nContext.Provider>
  );
}
