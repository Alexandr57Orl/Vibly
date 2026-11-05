import { ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "../i18n";
import type { City } from "../types";

export function DestinationGallery({ cities, cityId, onSelect }: {
  cities: City[];
  cityId: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const lastInteraction = useRef(0);
  const touching = useRef(false);
  const [overflow, setOverflow] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState(0);
  const [stopCount, setStopCount] = useState(0);

  function positions() {
    const element = track.current;
    if (!element) return [];
    const max = Math.max(0, element.scrollWidth - element.clientWidth);
    const left = element.getBoundingClientRect().left;
    const offsets = Array.from(element.children, (child) => Math.max(0, Math.min(max,
      child.getBoundingClientRect().left - left + element.scrollLeft)));
    return offsets.filter((offset, index) => index === 0 || Math.abs(offset - offsets[index - 1]) > 1);
  }

  function moveTo(index: number) {
    const left = positions()[index];
    if (left !== undefined) track.current?.scrollTo({ left, behavior: reducedMotion ? "instant" : "smooth" });
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      setOverflow(element.scrollWidth > element.clientWidth + 2);
      const offsets = positions();
      setStopCount(offsets.length);
      setActive(offsets.reduce((nearest, offset, index) =>
        Math.abs(offset - element.scrollLeft) < Math.abs(offsets[nearest] - element.scrollLeft) ? index : nearest, 0));
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [cities]);

  useEffect(() => {
    if (!overflow || paused || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => {
      const element = track.current;
      if (!element || touching.current || Date.now() - lastInteraction.current < 8000
        || document.hidden || document.querySelector("dialog[open]")) return;
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      const next = positions().find((left) => left > element.scrollLeft + 8) ?? 0;
      element.scrollTo({ left: next, behavior: "smooth" });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [overflow, paused, hovered, focused, reducedMotion, cities]);

  return (
    <nav className="destination-carousel" aria-label={t("Направление")}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="destination-gallery" ref={track}
        onPointerDown={() => { touching.current = true; lastInteraction.current = Date.now(); }}
        onPointerUp={() => { touching.current = false; lastInteraction.current = Date.now(); }}
        onPointerCancel={() => { touching.current = false; lastInteraction.current = Date.now(); }}
        onWheel={() => { lastInteraction.current = Date.now(); }}>
        {cities.map((destination) => (
          <button key={destination.id} className="destination-tile"
            aria-pressed={destination.id === cityId} onClick={() => onSelect(destination.id)}>
            <img src={destination.image} alt="" loading="lazy" style={{ objectPosition: destination.imagePosition }} />
            <span className="destination-tile-copy"><strong>{t(destination.name)}</strong><span>{t(destination.country)}</span></span>
            <span className="destination-tile-arrow" aria-hidden="true"><ChevronDown size={18} /></span>
          </button>
        ))}
      </div>
      {overflow && <div className="destination-carousel-controls">
        <button className="destination-step" aria-label={t("Предыдущие направления")}
          onClick={() => { lastInteraction.current = Date.now(); moveTo((active - 1 + stopCount) % stopCount); }}><ChevronLeft size={18} /></button>
        <div className="destination-dots">
          {cities.slice(0, stopCount).map((destination, index) => <button key={destination.id}
            aria-label={`${t("Показать направление")}: ${t(destination.name)}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => { lastInteraction.current = Date.now(); moveTo(index); }}><span /></button>)}
        </div>
        <button className="destination-step" aria-label={t("Следующие направления")}
          onClick={() => { lastInteraction.current = Date.now(); moveTo((active + 1) % stopCount); }}><ChevronRight size={18} /></button>
        {!reducedMotion && <button className="destination-autoplay" aria-pressed={paused}
          aria-label={t(paused ? "Включить автопрокрутку" : "Приостановить автопрокрутку")}
          onClick={() => setPaused(!paused)}>
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>}
      </div>}
    </nav>
  );
}
