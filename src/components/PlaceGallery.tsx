import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { useI18n } from "../i18n";
import type { PhotoCredit, Place } from "../types";

export function PlaceGallery({ place, credits }: { place: Place; credits: Record<string, PhotoCredit> }) {
  const { t } = useI18n();
  const images = [...new Set([place.image, ...(place.images ?? [])])];
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const current = images[index];
  const credit = Object.values(credits).find(item => item.image === current);
  const move = (step: number) => setIndex(value => (value + step + images.length) % images.length);

  useEffect(() => {
    if (images.length < 2) return;

    const timer = window.setTimeout(() => {
      setIndex(value => (value + 1) % images.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [index, images.length]);

  return <section className="place-gallery" aria-label={t("Фотографии места")}
    onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}>
    <div className="place-gallery-stage" onTouchStart={event => {
      const point = event.touches[0];
      touch.current = { x: point.clientX, y: point.clientY };
    }} onTouchEnd={event => {
      const point = event.changedTouches[0];
      if (touch.current) {
        const dx = point.clientX - touch.current.x;
        const dy = point.clientY - touch.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
      }
      touch.current = null;
    }} onTouchCancel={() => { touch.current = null; }}>
      {images.map((src, number) => <div key={src}
        className={`place-gallery-slide${index === number ? " is-active" : ""}`}
        aria-hidden={index !== number}>
        {failed.includes(src)
          ? <div className="place-gallery-unavailable"><ImageOff size={32} /><span>{t("Фотография недоступна")}</span></div>
          : <img className="modal-photo" src={src} alt={`${t(place.name)} — ${number + 1}`}
            onError={() => setFailed(value => [...value, src])} />}
      </div>)}
    </div>
    {images.length > 1 && <div className="gallery-thumbnails">
      {images.map((src, number) => <button key={src} onClick={() => setIndex(number)}
        aria-label={`${t("Показать фото")} ${number + 1}`} aria-pressed={index === number}>
        <img src={src} alt="" loading="lazy" />
      </button>)}
    </div>}
    {credit && <p className="photo-credit">{t("Фото:")} <a href={credit.source} target="_blank" rel="noreferrer">{credit.author}</a>
      {" · "}<a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>{t("· Кадрирование")}</p>}
  </section>;
}
