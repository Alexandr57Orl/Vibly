import { useI18n } from "../i18n";
import { useRef, useState } from "react";
import { ArrowUpRight, Bookmark, Compass, MapPin, Sparkles } from "lucide-react";
import { ExploreWorkspace } from "../components/ExploreWorkspace";
import { Modal } from "../components/Modal";
import { PlaceGallery } from "../components/PlaceGallery";
import { GuideStatus } from "../components/GuideStatus";
import { useGuide } from "../hooks/useGuide";
import { useExplore } from "../hooks/useExplore";
import { useTripPlan } from "../hooks/useTripPlan";
import type { Guide, Place } from "../types";

export function ExplorePage() {
  const { state, retry } = useGuide();

  if (state.status !== "success") {
    return (
      <GuideStatus
        loading={state.status === "loading"}
        message={state.status === "error" ? state.message : undefined}
        onRetry={retry}
      />
    );
  }

  return <ExploreContent guide={state.guide} />;
}

function ExploreContent({ guide }: { guide: Guide }) {
  const { t } = useI18n();
  const { cities, photoCredits } = guide;
  const explore = useExplore(cities);
  const { city, onlyFavorites, favorites } = explore;
  const plan = useTripPlan(cities, city);
  const [transition, setTransition] = useState<{ id: number; city: string; country: string } | null>(null);
  const transitionId = useRef(0);
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  function selectCity(id: string) {
    const nextCity = cities.find((item) => item.id === id);
    if (nextCity && nextCity.id !== city.id && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTransition({ id: ++transitionId.current, city: nextCity.name, country: nextCity.country });
    } else {
      setTransition(null);
    }
    explore.selectCity(id);
  }

  return (
    <div className="app-shell">
      <div className="ambient-backdrop" aria-hidden="true" />
      {transition && (
        <div className="destination-magic" key={transition.id} aria-hidden="true"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setTransition(null);
          }}>
          <div className="magic-wave" />
          <div className="magic-arrival">
            <span className="magic-compass"><Compass size={38} strokeWidth={1.4} /></span>
            <span className="magic-caption">{t("НОВЫЙ ГОРОД. НОВЫЙ ВАЙБ.")}</span>
            <strong>{t(transition.city)}</strong>
            <span>{t(transition.country)}  {t("· Твои открытия начинаются здесь")}</span>
            <Sparkles className="magic-spark spark-one" size={32} />
            <Sparkles className="magic-spark spark-two" size={22} />
          </div>
        </div>
      )}
      <ExploreWorkspace cities={cities} explore={explore} plan={plan} onSelect={selectCity}
        onOpen={setActivePlace} onAbout={() => setShowAbout(true)} />

      {activePlace && (
        <Modal title={t(activePlace.name)} onClose={() => setActivePlace(null)}>
          <PlaceGallery key={activePlace.id} place={activePlace} credits={photoCredits} />
          <span className="place-location">
            <MapPin size={15} />
            {t(activePlace.district)}
          </span>
          <p>{t(activePlace.description)}</p>
          <div className="modal-actions">
            {!onlyFavorites && <button className="add-to-plan" onClick={() => plan.toggle(activePlace.id)}
              disabled={plan.places.length >= 4 && !plan.places.some((item) => item.id === activePlace.id)}>
              {plan.places.some((item) => item.id === activePlace.id) ? t("Убрать из плана") : t("Добавить в план")}
            </button>}
            <button
              className="explore-button"
              onClick={() => explore.toggleFavorite(activePlace.id)}
            >
              <Bookmark
                size={17}
                fill={
                  favorites.includes(activePlace.id) ? "currentColor" : "none"
                }
              />
              {favorites.includes(activePlace.id) ? t("Сохранено") : t("В избранное")}
            </button>
            <a
              className="external-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name + " " + (cities.find((item) => item.places.some((place) => place.id === activePlace.id))?.name ?? ""))}`}
              target="_blank"
              rel="noreferrer"
            >
               {t("На карте")} <ArrowUpRight size={16} />
            </a>
          </div>
          <a
            className="source-link"
            href={activePlace.source}
            target="_blank"
            rel="noreferrer"
          >
             {t("Сайт и информация для посещения ↗")} </a>
          <p className="content-note">
             {t("Проверь часы работы и условия посещения перед поездкой.")} </p>
        </Modal>
      )}
      {showAbout && (
        <Modal
          title={t("Город — больше, чем точки на карте.")}
          onClose={() => setShowAbout(false)}
          className="about-modal"
        >
          <span className="about-icon">
            <Sparkles size={32} />
          </span>
          <p>
             {t("Vibly — небольшой путеводитель для любопытных. Мы собрали места, местные выражения и простые советы, чтобы тебе было легче почувствовать новый город своим.")} </p>
          <p>{t("Выбирай страну, исследуй город и сохраняй то, что откликается. Собери до четырёх остановок в план прогулки и открой маршрут в Google Maps.")}</p>
          <p>
             {t("Избранное и планы прогулок хранятся только в этом браузере. Регистрация не нужна.")} </p>
          <p className="content-note">
             {t("Подборка загружается при открытии путеводителя. Ссылки на источники находятся в карточках мест. Фотографии: Unsplash и Wikimedia Commons. Авторы и лицензии фотографий Commons указаны в подробностях мест.")} </p>
        </Modal>
      )}
    </div>
  );
}
