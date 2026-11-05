import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { CommunityPlaces } from "./CommunityPlaces";
import { useI18n } from "../i18n";
import { useState } from "react";
import { Bookmark, ChevronDown, Compass, Footprints, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import type { City, Place } from "../types";
import { categoryLabels } from "../data/categories";
import { situations, useExplore } from "../hooks/useExplore";
import { useTripPlan } from "../hooks/useTripPlan";
import { DestinationPicker } from "./DestinationPicker";
import { Modal } from "./Modal";
import { Phrasebook } from "./Phrasebook";
import { PlaceCard } from "./PlaceCard";
import { TripPlanner } from "./TripPlanner";
import { LocalAdvice } from "./LocalAdvice";
import { DestinationGallery } from "./DestinationGallery";

const workspaceTabs = [
  { id: "places", label: "Места" },
  { id: "language", label: "Разговорник" },
  { id: "advice", label: "Советы местных" },
  { id: "community", label: "Открытия сообщества" },
] as const;

interface Props {
  cities: City[];
  explore: ReturnType<typeof useExplore>;
  plan: ReturnType<typeof useTripPlan>;
  onSelect: (id: string) => void;
  onOpen: (place: Place) => void;
  onAbout: () => void;
}

export function ExploreWorkspace({ cities, explore, plan, onSelect, onOpen, onAbout }: Props) {
  const { t } = useI18n();
  const { city, onlyFavorites, favorites } = explore;
  const [view, setView] = useState<typeof workspaceTabs[number]["id"]>("places");
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  function showPlaces() { setView("places"); explore.setOnlyFavorites(false); explore.resetFilters(); }
  return (
    <div className="workspace">
      <header className="workspace-header">
        <a className="brand" href="#" onClick={(event) => {
          event.preventDefault();
          showPlaces();
          window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        }} aria-label={t("Vibly — главная")}><span className="workspace-brand-symbol" aria-hidden="true"><Compass size={22} strokeWidth={1.7} /></span><span>vibly<span className="brand-dot">.</span></span></a>
        <button className="destination-switch" onClick={() => setDestinationOpen(true)} aria-haspopup="dialog" aria-expanded={destinationOpen} aria-label={`${t("Выбрать направление: ")}${t(city.name)}`}>
          <span className="destination-icon" aria-hidden="true"><MapPin size={18} /></span>
          <span className="destination-copy"><small>{t("Направление")}</small><span>{t(city.name)}<span className="destination-country">{t(city.country)}</span></span></span>
          <ChevronDown className="destination-chevron" size={15} aria-hidden="true" />
        </button>
        <div className="workspace-header-actions">
          <button className={`workspace-favorites ${onlyFavorites ? "is-selected" : ""}`} aria-pressed={onlyFavorites}
            aria-label={`${t("Избранное, сохранено мест: ")}${favorites.length}`} onClick={() => {
              explore.setOnlyFavorites(!onlyFavorites); explore.resetFilters(); setView("places");
            }}><Bookmark size={18} /><span>{t("Избранное")}</span><small>{favorites.length}</small></button>
          <button className="plan-toggle" onClick={() => setPlanOpen(true)} aria-label={`${t("Мой план, остановок: ")}${plan.places.length}`}>
            <Footprints size={18} /><span>{t("Мой план")}</span><small>{plan.places.length}</small>
          </button>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      <main>
        <section className="city-introduction" aria-labelledby="intro-title">
          <div><p className="city-kicker">{t("ТВОЙ ЛОКАЛЬНЫЙ ПУТЕВОДИТЕЛЬ")}</p>
            <h1 id="intro-title">{t(city.name)},{" "}<br /><span>{t("в твоём ритме.")}</span></h1>
            <p>{t(city.description)}</p>
          </div>
          <figure className="city-postcard" key={city.id}>
            <div className="postcard-photo">
              <img src={city.image} alt={`${t("Панорама города ")}${t(city.name)}`} style={{ objectPosition: city.imagePosition }} />
              <span className="postcard-label">{t("ОТКРОЙ ДЛЯ СЕБЯ")}</span>
            </div>
            <figcaption><span>{t(city.name)}<small>{t(city.country)}</small></span><span className="postcard-stamp" aria-hidden="true"><Compass size={24} strokeWidth={1.2} /></span></figcaption>
          </figure>
        </section>

        <DestinationGallery cities={cities} cityId={city.id}
          onSelect={(id) => { onSelect(id); setView("places"); }} />

        <div className="workspace-tabs" role="tablist" aria-label={t("Разделы путеводителя")}
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const current = workspaceTabs.findIndex((tab) => tab.id === view);
            const index = event.key === "Home" ? 0 : event.key === "End" ? workspaceTabs.length - 1
              : (current + (event.key === "ArrowRight" ? 1 : -1) + workspaceTabs.length) % workspaceTabs.length;
            const next = workspaceTabs[index].id;
            setView(next);
            document.getElementById(`tab-${next}`)?.focus();
          }}>
          {workspaceTabs.map((tab) => <button key={tab.id} id={`tab-${tab.id}`} role="tab"
            aria-selected={view === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={view === tab.id ? 0 : -1}
            onClick={() => setView(tab.id)}>{t(tab.label)}</button>)}
        </div>

        {view === "places" ? <section id="panel-places" role="tabpanel" aria-labelledby="tab-places" className="workspace-catalog">
          <div className="catalog-heading"><h2 id="city-heading">{onlyFavorites ? t("Избранное") : t("Найди своё место")}</h2>
            {onlyFavorites && <button className="quiet-button" onClick={showPlaces}>{t("Все места в городе")}</button>}
          </div>
          <div className="catalog-toolbar">
            <div className="category-tabs" role="group" aria-label={t("Категория мест")}>
              <button className={`category-tab ${explore.category === "all" ? "selected" : ""}`} aria-pressed={explore.category === "all"} onClick={() => explore.setCategory("all")}>{t("Все места")}</button>
              {Object.entries(categoryLabels).map(([category, label]) => <button key={category}
                className={`category-tab ${explore.category === category ? "selected" : ""}`} aria-pressed={explore.category === category}
                onClick={() => explore.setCategory(category as keyof typeof categoryLabels)}>{t(label)}</button>)}
            </div>
            <label className="search-field"><Search size={18} /><input type="search" aria-label={t("Поиск мест")} placeholder={t("Название или район")} value={explore.query} onChange={(event) => explore.setQuery(event.target.value)} />
              {explore.query && <button aria-label={t("Очистить поиск")} onClick={() => explore.setQuery("")}><X size={14} /></button>}
            </label>
            <button className={`filter-toggle ${explore.situation !== "all" ? "is-selected" : ""}`} aria-expanded={filtersOpen} aria-controls="situation-filters" aria-label={t("Подборки по настроению")} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={18} /></button>
          </div>
          {filtersOpen && <div id="situation-filters" className="situation-picker" role="group" aria-label={t("Настроение прогулки")}><span>{t("Как проведём день?")}</span>
            {situations.map((item) => <button key={item.id} aria-pressed={explore.situation === item.id} onClick={() => explore.selectSituation(item.id)}>{t(item.label)}</button>)}
          </div>}
          <div className="catalog-meta"><span aria-live="polite">{t("Мест:")} {explore.places.length}{explore.situation !== "all" && ` · ${t(situations.find((item) => item.id === explore.situation)?.label ?? "")}`}</span>
            {(explore.query || explore.category !== "all" || explore.situation !== "all") && <button className="quiet-button" onClick={explore.resetFilters}>{t("Сбросить фильтры")}</button>}
          </div>
          {explore.places.length ? <div className="places-grid">{explore.places.map((place) => <PlaceCard key={place.id} place={place}
            saved={favorites.includes(place.id)} onToggle={() => explore.toggleFavorite(place.id)} onOpen={() => onOpen(place)}
            inPlan={plan.places.some((item) => item.id === place.id)} planFull={plan.places.length >= 4}
            onPlan={!onlyFavorites ? () => plan.toggle(place.id) : undefined} />)}</div>
            : <div className="empty-state"><Bookmark size={28} /><h3>{onlyFavorites && !favorites.length ? t("Твои открытия будут здесь") : t("Ничего не нашлось")}</h3>
              <p>{onlyFavorites && !favorites.length ? t("Сохраняй понравившиеся места с помощью закладки.") : t("Попробуй изменить запрос или сбросить фильтры.")}</p>
              <button className="explore-button" onClick={() => { explore.resetFilters(); if (!favorites.length) explore.setOnlyFavorites(false); }}>{onlyFavorites && !favorites.length ? t("Выбрать места") : t("Сбросить фильтры")}</button>
            </div>}
        </section> : view === "language" ? <section id="panel-language" role="tabpanel" aria-labelledby="tab-language" className="workspace-language">
          <div className="catalog-heading"><div><h2>{t("Говори увереннее")}</h2><p>{t("Полезные фразы и местные выражения ·")} {t(city.name)}</p></div></div>
          <div className="local-language"><Phrasebook key={city.id} city={city} /></div>
        </section> : view === "advice" ? <section id="panel-advice" role="tabpanel" aria-labelledby="tab-advice" className="workspace-advice">
          <LocalAdvice key={city.id} city={city} />
        </section> : <section id="panel-community" role="tabpanel" aria-labelledby="tab-community">
          <CommunityPlaces key={city.id} city={city} />
        </section>}
      </main>
      <footer className="workspace-footer"><span>{t("Vibly · Почувствуй город своим")}</span><button onClick={onAbout}>{t("О проекте")}</button></footer>
      <button className="mobile-plan-toggle" onClick={() => setPlanOpen(true)} aria-label={`${t("Мой план, остановок: ")}${plan.places.length}`}>
        <Footprints size={18} />  {t("Мой план")} <small>{plan.places.length}</small>
      </button>

      {destinationOpen && <Modal title={t("Куда отправимся?")} onClose={() => setDestinationOpen(false)} className="destination-modal">
        <p>{t("Выбери направление — город и его настроение обновятся вместе.")}</p>
        <DestinationPicker city={city} cities={cities} onSelect={(id) => { onSelect(id); setView("places"); setDestinationOpen(false); }} />
      </Modal>}
      {planOpen && <Modal title={t("Мой план")} onClose={() => setPlanOpen(false)} className="plan-drawer">
        <TripPlanner city={city} places={plan.places} storageWarning={plan.storageWarning} onRemove={plan.toggle} onMove={plan.move} onClear={plan.clear}
          onOpen={(place) => { setPlanOpen(false); onOpen(place); }} />
      </Modal>}
    </div>
  );
}
