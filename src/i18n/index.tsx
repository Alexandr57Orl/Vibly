import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import english from "./en.json";

export type Locale = "ru" | "en";
const translations: Record<string, string> = english;
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const dictionary = Object.fromEntries(Object.entries(translations).map(([key, value]) => [normalize(key), value.trim()]));

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem("vibly-language");
    if (saved === "ru" || saved === "en") return saved;
  } catch { /* Continue when browser storage is unavailable. */ }
  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

export function translate(value: string, locale: Locale): string {
  if (locale === "ru") return value;
  const status = /^Не удалось загрузить путеводитель \(код (\d+)\)\.$/.exec(value);
  if (status) return `Could not load the guide (status ${status[1]}).`;
  const result = dictionary[normalize(value)];
  if (result === undefined) return value;
  return `${value.match(/^\s*/)?.[0] ?? ""}${result}${value.match(/\s*$/)?.[0] ?? ""}`;
}

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (value: string) => string;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = locale === "ru" ? "Vibly — почувствуй город своим" : "Vibly — feel at home in the city";
    document.querySelector('meta[name="description"]')?.setAttribute("content", locale === "ru"
      ? "Vibly — почувствуй город своим. Достопримечательности, местные выражения и прогулки по городам мира."
      : "Vibly — feel at home in the city. Sights, local expressions and city walks around the world.");
    try { localStorage.setItem("vibly-language", locale); } catch { /* Language still works for this session. */ }
  }, [locale]);
  const value = useMemo(() => ({ locale, setLocale, t: (text: string) => translate(text, locale) }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n requires I18nProvider");
  return context;
}
