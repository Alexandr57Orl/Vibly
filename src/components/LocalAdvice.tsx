import { useState } from "react";
import { ArrowUpRight, Coffee, Footprints, HeartHandshake, Lightbulb, TrainFront } from "lucide-react";
import { adviceReviewedAt, localAdvice } from "../data/localAdvice";
import type { AdviceKind, AdviceTopic } from "../data/localAdvice";
import { useI18n } from "../i18n";
import type { City } from "../types";

const topics = [
  { id: "road", label: "На дороге", icon: Footprints },
  { id: "transport", label: "В транспорте", icon: TrainFront },
  { id: "etiquette", label: "Этикет и привычки", icon: HeartHandshake },
  { id: "food", label: "В кафе", icon: Coffee },
] as const;
const kindLabels: Record<AdviceKind, string> = {
  rule: "Правило", custom: "Привычка", practical: "На практике",
};

export function LocalAdvice({ city }: { city: City }) {
  const { t, locale } = useI18n();
  const [topic, setTopic] = useState<AdviceTopic | "all">("all");
  const advice = localAdvice[city.id] ?? [];
  const availableTopics = topics.filter((item) => advice.some((card) => card.topic === item.id));
  const visible = advice.filter((item) => topic === "all" || item.topic === topic);
  const reviewed = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${adviceReviewedAt}T00:00:00Z`));

  return (
    <>
      <div className="catalog-heading advice-heading">
        <div><span className="advice-city">{t(city.name)}</span><h2>{t("Как здесь принято")}</h2>
          <p>{t("Дороги, транспорт и повседневные привычки — чтобы освоиться быстрее.")}</p>
        </div>
      </div>
      <aside className="advice-spotlight" aria-labelledby="local-tip-title">
        <span className="advice-spotlight-icon" aria-hidden="true"><Lightbulb size={24} /></span>
        <div><h3 id="local-tip-title">{t("Совет местного")}</h3><p>{t(city.tip)}</p></div>
      </aside>
      {advice.length > 0 ? <>
        <div className="advice-topics" role="group" aria-label={t("Темы советов")}>
          <button aria-pressed={topic === "all"} onClick={() => setTopic("all")}>{t("Все советы")}</button>
          {availableTopics.map((item) => <button key={item.id} aria-pressed={topic === item.id}
            onClick={() => setTopic(item.id)}><item.icon size={17} aria-hidden="true" />{t(item.label)}</button>)}
        </div>
        <div className="advice-grid">
          {visible.map((item) => {
            const topicInfo = topics.find((entry) => entry.id === item.topic)!;
            const Icon = topicInfo.icon;
            return (
              <article className="advice-card" key={item.id}>
                <div className="advice-card-meta"><span><Icon size={18} aria-hidden="true" />{t(topicInfo.label)}</span>
                  <span className={`advice-kind advice-kind-${item.kind}`}>{t(kindLabels[item.kind])}</span>
                </div>
                <h3>{t(item.title)}</h3>
                <p>{t(item.body)}</p>
                <div className="advice-action"><strong>{t("Что сделать")}</strong><p>{t(item.action)}</p></div>
                <a className="advice-source" href={item.source.url} target="_blank" rel="noreferrer">
                  {t("Источник")}: {t(item.source.label)}<ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
        <p className="advice-editorial">{t("Советы собраны по материалам городских служб и туристических организаций.")}
          <span>{t("Источники проверены")}: <time dateTime={adviceReviewedAt}>{reviewed}</time>.</span>
        </p>
      </> : <p className="advice-editorial">{t("Подробные советы для этого города ещё готовятся.")}</p>}
    </>
  );
}
