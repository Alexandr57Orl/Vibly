import { useI18n } from "../i18n";
import { useEffect, useState } from "react";
import { Compass, Footprints, MapPin, MessageCircle } from "lucide-react";

export function SectionNav({ onlyFavorites }: { onlyFavorites: boolean }) {
  const { t } = useI18n();
  const [active, setActive] = useState("destination");
  const sections = [
    { id: "destination", label: t("Направление"), icon: Compass },
    ...(!onlyFavorites ? [{ id: "local-language", label: t("Местный язык"), icon: MessageCircle }] : []),
    ...(!onlyFavorites ? [{ id: "trip-plan", label: t("Мой план"), icon: Footprints }] : []),
    { id: "places", label: onlyFavorites ? t("Избранное") : t("Места"), icon: MapPin },
  ];

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const ids = onlyFavorites ? ["destination", "places"] : ["destination", "local-language", "trip-plan", "places"];
      let current = ids[0];
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * .35) current = id;
      }
      setActive(current);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [onlyFavorites]);

  return (
    <nav className="section-nav" aria-label={t("Разделы страницы")}>
      {sections.map(({ id, label, icon: Icon }) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}
          onClick={(event) => {
            event.preventDefault();
            const section = document.getElementById(id);
            section?.focus({ preventScroll: true });
            section?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
          }}>
          <Icon size={19} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
