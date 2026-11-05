import { useI18n } from "../i18n";
import { useState } from "react";
import { MessageCircle, Square, Volume2 } from "lucide-react";
import type { City } from "../types";
import { phrasebooks, phraseSituations } from "../data/phrasebook";
import { usePhraseSpeech } from "../hooks/usePhraseSpeech";
import { PhraseActions } from "./PhraseActions";

export function Phrasebook({ city }: { city: City }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<"practical" | "local">("practical");
  const data = phrasebooks[city.country];
  return (
    <>
      <div className="phrasebook-modes" role="group" aria-label={t("Тип разговорника")}>
        <button aria-pressed={mode === "practical"} onClick={() => setMode("practical")}>{t("На каждый день")}</button>
        <button aria-pressed={mode === "local"} onClick={() => setMode("local")}>{t("Местные выражения")}</button>
      </div>
      {mode === "practical" ? data ? <PracticalPhrases key={city.country} data={data} />
        : <p className="phrasebook-note">{t("Для этой страны разговорник пока не добавлен. Посмотри местные выражения.")}</p>
        : <div className="language-phrases" key={city.id}>
          {city.phrases.map((phrase, index) => (
            <article className="language-phrase" key={phrase.expression}>
              <span className="phrase-number">{t("ФРАЗА")} {String(index + 1).padStart(2, "0")} <MessageCircle size={20} aria-hidden="true" /></span>
              <h3>{phrase.expression}</h3>
              <p>{t(phrase.meaning)}</p>
              <PhraseActions expression={phrase.expression} />
            </article>
          ))}
        </div>}
    </>
  );
}

function PracticalPhrases({ data }: { data: typeof phrasebooks[string] }) {
  const { t, locale } = useI18n();
  const [situation, setSituation] = useState<typeof phraseSituations[number]["id"]>("cafe");
  const speech = usePhraseSpeech(data.language);
  const phrases = data.phrases.filter((phrase) => situation === "all" || phrase.situation === situation);
  return (
    <div className="practical-phrasebook">
      <div className="phrasebook-situations" role="group" aria-label={t("Ситуация общения")}>
        {phraseSituations.map((item) => <button key={item.id} aria-pressed={situation === item.id}
          onClick={() => { speech.stop(); setSituation(item.id); }}>{t(item.label)}</button>)}
      </div>
      <p className="phrasebook-note">{t(data.label)}  {locale === "en" ? "· Pronunciation is approximate." : <>{t("· Произношение кириллицей приблизительное")}{data.language === "ru-RU" ? t("; ударения отмечены знаком ´.") : "."}</>}</p>
      <div className="practical-phrases" key={situation}>
        {phrases.map((phrase) => (
          <article className="language-phrase practical-phrase" key={phrase.id}>
            <span className="phrase-number">{t(phraseSituations.find((item) => item.id === phrase.situation)?.label ?? "")}</span>
            <h3 lang={data.language}>{phrase.text}</h3>
            <p className="phrase-translation">{t(phrase.translation)}</p>
            <div className="phrase-pronunciation"><span>{t("КАК ПРОИЗНЕСТИ")}</span><p>{t(phrase.pronunciation)}</p></div>
            <p className="phrase-usage"><span>{t("Когда пригодится")}</span>{t(phrase.usage)}</p>
            <div className="practical-actions">
              <PhraseActions expression={phrase.text} />
              {speech.available && <button className="phrase-listen" aria-label={`${speech.speaking === phrase.id ? t("Остановить") : t("Послушать")}: ${phrase.text}`}
                aria-pressed={speech.speaking === phrase.id} onClick={() => speech.speak(phrase.id, phrase.text)}>
                {speech.speaking === phrase.id ? <Square size={15} /> : <Volume2 size={17} />}
                {speech.speaking === phrase.id ? t("Остановить") : t("Послушать")}
              </button>}
            </div>
          </article>
        ))}
      </div>
      <p className="phrasebook-note" role="status">{t(speech.error) || (speech.available ? t("Озвучка голосом устройства. Качество и доступность зависят от браузера.") : t("Озвучка этого языка недоступна в браузере. Используй подсказку произношения или покажи фразу собеседнику."))}</p>
      {data.sources.length > 0 && <div className="phrasebook-sources"><span>{t("Для самостоятельной практики:")}</span>{data.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{t(source.label)} ↗</a>)}</div>}
    </div>
  );
}
