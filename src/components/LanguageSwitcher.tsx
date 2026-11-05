import { useI18n } from "../i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="language-switcher" role="group" aria-label={locale === "ru" ? "Язык интерфейса" : "Interface language"}>
      {(["ru", "en"] as const).map((language) => (
        <button key={language} type="button" lang={language}
          aria-label={language === "ru" ? "Русский" : "English"}
          aria-pressed={locale === language} onClick={() => setLocale(language)}>
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
