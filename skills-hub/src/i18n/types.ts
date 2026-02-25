import en from "./locales/en.json";

export type TranslationKey = keyof typeof en;
export type Locale = "en" | "es" | "pt";
export type Translations = Record<TranslationKey, string>;

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
];

export const DEFAULT_LOCALE: Locale = "en";
