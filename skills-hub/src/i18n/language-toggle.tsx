"use client";

import { useTranslation } from "./context";
import { LOCALES } from "./types";

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
            locale === code
              ? "border-zinc-400 text-zinc-50 bg-zinc-800"
              : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
