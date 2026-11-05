import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "../i18n";

export function ThemeSwitcher() {
  const { locale } = useI18n();
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === "dark");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem("vibly-theme"); } catch { /* Use the system preference. */ }
      const next = saved === "dark" || (saved !== "light" && media.matches);
      document.documentElement.dataset.theme = next ? "dark" : "light";
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#17141f" : "#fffaf5");
      setDark(next);
    };
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const label = locale === "ru"
    ? (dark ? "Включить светлую тему" : "Включить тёмную тему")
    : (dark ? "Switch to light theme" : "Switch to dark theme");

  return <button type="button" className="theme-switcher" aria-label={label} title={label}
    aria-pressed={dark} onClick={() => {
      const next = !dark;
      setDark(next);
      document.documentElement.dataset.theme = next ? "dark" : "light";
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#17141f" : "#fffaf5");
      try { localStorage.setItem("vibly-theme", next ? "dark" : "light"); } catch { /* Keep the choice for this session. */ }
    }}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
