import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useI18n } from "../i18n";
import { Compass, RefreshCw } from "lucide-react";

interface GuideStatusProps {
  loading: boolean;
  message?: string;
  onRetry: () => void;
}

export function GuideStatus({ loading, message, onRetry }: GuideStatusProps) {
  const { t } = useI18n();
  return (
    <div className="app-shell guide-status-shell">
      <div className="ambient-backdrop" aria-hidden="true" />
      <header className="header guide-status-header">
        <a className="brand" href="/" aria-label={t("Vibly — главная")}>
          <span className="brand-mark">
            <Compass size={24} />
          </span>
          vibly<span className="brand-dot">.</span>
        </a>
        <div className="guide-status-actions"><LanguageSwitcher /><ThemeSwitcher /></div>
      </header>
      <main className="guide-status" aria-busy={loading}>
        <div className="guide-status-card" role={loading ? "status" : "alert"}>
          <span className="guide-status-icon" aria-hidden="true"><Compass
            size={34}
            className={loading ? "loading-compass" : undefined}
          /></span>
          <h1>
            {loading
              ? t("Собираем твои открытия")
              : t("Путеводитель пока недоступен")}
          </h1>
          <p>
            {loading
              ? t("Загружаем города и места. Ещё немного — и отправимся в путь.")
              : t(message ?? "")}
          </p>
          {loading && <div className="guide-status-dots" aria-hidden="true"><span /><span /><span /></div>}
          {!loading && (
            <button className="explore-button" onClick={onRetry}>
              <RefreshCw size={16} />
               {t("Попробовать снова")} </button>
          )}
        </div>
      </main>
    </div>
  );
}
