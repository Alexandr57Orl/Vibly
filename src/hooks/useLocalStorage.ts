import { useState } from "react";

/** Safely persists a list of IDs; unavailable storage does not prevent using the app. */
export function useLocalStorage(key: string) {
  const [value, setValue] = useState<string[]>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      return Array.isArray(stored)
        ? stored.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  });

  function toggle(id: string) {
    setValue((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* Keep in-memory favorites. */
      }
      return next;
    });
  }

  return [value, toggle] as const;
}
