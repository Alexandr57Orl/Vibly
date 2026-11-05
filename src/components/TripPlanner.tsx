import { useI18n } from "../i18n";
import { ArrowDown, ArrowUp, ArrowUpRight, Footprints, Plus, X } from "lucide-react";
import type { City, Place } from "../types";

interface TripPlannerProps {
  city: City;
  places: Place[];
  storageWarning: boolean;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onClear: () => void;
  onOpen: (place: Place) => void;
}

export function TripPlanner({ city, places, storageWarning, onRemove, onMove, onClear, onOpen }: TripPlannerProps) {
  const { t } = useI18n();
  const address = (place: Place) => `${place.name}, ${place.district}, ${city.name}`;
  const params = new URLSearchParams({ api: "1", travelmode: "walking" });
  if (places.length >= 2) {
    params.set("origin", address(places[0]));
    params.set("destination", address(places[places.length - 1]));
    if (places.length > 2) params.set("waypoints", places.slice(1, -1).map(address).join("|"));
  }
  return (
    <section className="trip-planner" id="trip-plan" tabIndex={-1} aria-labelledby="trip-title">
      <div className="trip-heading">
        <div>
          <span className="eyebrow"><Footprints size={18} />  {t("ТВОЙ ПЛАН НА ДЕНЬ")}</span>
          <h3 id="trip-title">{t(city.name)}{t(": собери свою прогулку")}</h3>
          <p>{t("До четырёх остановок. Выбирай места в карточках и меняй порядок.")}</p>
        </div>
        <span className="trip-count" aria-live="polite">{places.length} / 4</span>
      </div>
      {places.length ? (
        <>
          <ol className="trip-stops">
            {places.map((place, index) => (
              <li key={place.id}>
                <span className="stop-number">{index + 1}</span>
                <button className="stop-title" onClick={() => onOpen(place)}>{t(place.name)}<small>{t(place.district)}</small></button>
                <div className="stop-actions">
                  <button disabled={index === 0} onClick={() => onMove(place.id, -1)} aria-label={`${t("Поднять: ")}${t(place.name)}`}><ArrowUp size={16} /></button>
                  <button disabled={index === places.length - 1} onClick={() => onMove(place.id, 1)} aria-label={`${t("Опустить: ")}${t(place.name)}`}><ArrowDown size={16} /></button>
                  <button onClick={() => onRemove(place.id)} aria-label={`${t("Убрать из плана: ")}${t(place.name)}`}><X size={16} /></button>
                </div>
              </li>
            ))}
          </ol>
          <div className="trip-footer">
            {places.length >= 2 ? <a className="explore-button" href={`https://www.google.com/maps/dir/?${params}`} target="_blank" rel="noreferrer">{t("Маршрут в Google Maps")} <ArrowUpRight size={17} /></a>
              : <p>{t("Добавь ещё одно место, чтобы построить маршрут.")}</p>}
            <button className="trip-clear" onClick={onClear}>{t("Очистить план")}</button>
          </div>
          <p className="trip-note">{t("Расстояние и время в пути покажет карта. Часы работы и цены уточняй на сайтах мест.")}</p>
        </>
      ) : <div className="trip-placeholder"><Plus size={22} /><p>{t("Нажми «В план» у понравившегося места — первая остановка появится здесь.")}</p></div>}
      <p className="trip-note" role="status">{storageWarning ? t("План доступен до закрытия страницы: браузер не разрешил сохранение.") : t("План сохраняется в этом браузере. Для каждого города — свой.")}</p>
    </section>
  );
}
