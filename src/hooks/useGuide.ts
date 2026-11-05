import { useEffect, useState } from "react";
import { fetchGuide } from "../api/guide";
import type { Guide } from "../types";

type GuideState =
  | { status: "loading" }
  | { status: "success"; guide: Guide }
  | { status: "error"; message: string };

export function useGuide() {
  const [state, setState] = useState<GuideState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);

    fetchGuide(controller.signal)
      .then((guide) => {
        if (active) setState({ status: "success", guide });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = timedOut
          ? "Сервис долго не отвечает. Попробуй загрузить путеводитель ещё раз."
          : error instanceof TypeError
            ? "Не удалось связаться с сервисом. Проверь подключение к интернету."
            : error instanceof SyntaxError
              ? "Сервис вернул ответ в неверном формате."
              : error instanceof Error
                ? error.message
                : "Не удалось загрузить путеводитель.";
        setState({ status: "error", message });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((current) => current + 1);
  }

  return { state, retry };
}
