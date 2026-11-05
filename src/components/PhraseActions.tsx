import { useI18n } from "../i18n";
import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export function PhraseActions({ expression }: { expression: string }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);
  return (
    <div className="phrase-actions">
      <button onClick={async () => {
        try { await navigator.clipboard.writeText(expression); setStatus("copied"); }
        catch { setStatus("error"); }
      }} aria-label={`${t("Скопировать фразу: ")}${expression}`}>
        {status === "copied" ? <Check size={15} /> : <Copy size={15} />}  {t("Скопировать")} </button>
      <span role="status">{status === "copied" ? t("Скопировано") : status === "error" ? t("Не удалось скопировать. Выдели текст вручную.") : ""}</span>
    </div>
  );
}
