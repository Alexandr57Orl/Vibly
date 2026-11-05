import { useI18n } from "../i18n";
import { ArrowUpRight, Bookmark, Compass } from "lucide-react";

interface HeaderProps {
  favoritesCount: number;
  onlyFavorites: boolean;
  onExplore: () => void;
  onFavorites: () => void;
  onAbout: () => void;
}

export function Header({
  favoritesCount,
  onlyFavorites,
  onExplore,
  onFavorites,
  onAbout,
}: HeaderProps) {
  const { t } = useI18n();
  return (
    <header className="header">
      <a
        className="brand"
        href="#"
        onClick={onExplore}
        aria-label={t("Vibly — главная")}
      >
        <span className="brand-mark">
          <Compass size={24} strokeWidth={1.7} />
        </span>
        vibly<span className="brand-dot">.</span>
      </a>
      <nav className="main-nav" aria-label={t("Основная навигация")}>
        <button
          className={!onlyFavorites ? "nav-link active" : "nav-link"}
          onClick={onExplore}
        >
           {t("Открывай города")} </button>
        <button className="nav-link about-link" onClick={onAbout}>
           {t("О проекте")} <ArrowUpRight size={13} />
        </button>
      </nav>
      <button
        className={`favorites-button ${onlyFavorites ? "selected" : ""}`}
        onClick={onFavorites}
        aria-label={`${t("Избранное, сохранено мест: ")}${favoritesCount}`}
        aria-pressed={onlyFavorites}
      >
        <Bookmark size={17} />
        <span>{t("Избранное")}</span>
        <span className="count">{favoritesCount}</span>
      </button>
    </header>
  );
}
