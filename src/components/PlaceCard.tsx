import { useI18n } from "../i18n";
import { ArrowUpRight, Bookmark, Check, MapPin, Plus } from "lucide-react";
import { categoryLabels } from "../data/categories";
import type { Place } from "../types";

interface PlaceCardProps {
  place: Place;
  saved: boolean;
  onToggle: () => void;
  onOpen: () => void;
  inPlan?: boolean;
  planFull?: boolean;
  onPlan?: () => void;
}

export function PlaceCard({ place, saved, onToggle, onOpen, inPlan, planFull, onPlan }: PlaceCardProps) {
  const { t } = useI18n();
  return (
    <article className="place-card">
      <div className="place-image-wrap">
        <button
          className="image-button"
          onClick={onOpen}
          aria-label={`${t("Подробнее: ")}${t(place.name)}`}
        >
          <img
            className="place-image"
            src={place.image}
            alt={t(place.name)}
            loading="lazy"
          />
        </button>
        <span className="place-tag">{t(place.tag)}</span>
        <button
          className={`save-button ${saved ? "saved" : ""}`}
          onClick={onToggle}
          aria-label={`${saved ? t("Убрать из избранного") : t("Сохранить")}: ${t(place.name)}`}
          aria-pressed={saved}
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="place-body">
        <span className="place-category">{t(categoryLabels[place.category])}</span>
        <button className="place-title" onClick={onOpen}>
          {t(place.name)}
          <ArrowUpRight size={18} />
        </button>
        <p className="place-description">{t(place.description)}</p>
        <span className="place-location">
          <MapPin size={13} />
          {t(place.district)}
        </span>
        <div className="place-utilities">
          <a href={place.source} target="_blank" rel="noreferrer" aria-label={`${t("Условия посещения: ")}${t(place.name)}`}>{t("Сайт места")} <ArrowUpRight size={14} /></a>
          {onPlan && <button className={`add-to-plan ${inPlan ? "in-plan" : ""}`} onClick={onPlan}
            disabled={!inPlan && planFull} aria-pressed={inPlan}
            aria-label={`${inPlan ? t("Убрать из плана") : t("В план")}: ${t(place.name)}`}>
            {inPlan ? <Check size={16} /> : <Plus size={16} />}{inPlan ? t("В плане") : planFull ? t("План заполнен") : t("В план")}
          </button>}
        </div>
      </div>
    </article>
  );
}
