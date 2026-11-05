import { useEffect, useState } from "react";
import type { City } from "../types";

const key = "vibly-trip-plan";
type Plans = Record<string, string[]>;

export function useTripPlan(cities: City[], city: City) {
  const [plans, setPlans] = useState<Plans>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) ?? "{}");
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
      return Object.fromEntries(cities.map((item) => {
        const ids: unknown = (stored as Record<string, unknown>)[item.id];
        return [item.id, Array.isArray(ids) ? [...new Set(ids.filter((id): id is string =>
          typeof id === "string" && item.places.some((place) => place.id === id)))].slice(0, 4) : []];
      }));
    } catch { return {}; }
  });
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(plans)); setStorageWarning(false); }
    catch { setStorageWarning(true); }
  }, [plans]);

  const ids = plans[city.id] ?? [];
  const places = ids.flatMap((id) => city.places.find((place) => place.id === id) ?? []);
  function toggle(id: string) {
    if (!city.places.some((place) => place.id === id)) return;
    setPlans((current) => {
      const currentIds = current[city.id] ?? [];
      const next = currentIds.includes(id) ? currentIds.filter((item) => item !== id)
        : currentIds.length < 4 ? [...currentIds, id] : currentIds;
      return { ...current, [city.id]: next };
    });
  }
  function move(id: string, direction: -1 | 1) {
    setPlans((current) => {
      const next = [...(current[city.id] ?? [])];
      const index = next.indexOf(id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, [city.id]: next };
    });
  }
  return { places, toggle, move, storageWarning,
    clear: () => setPlans((current) => ({ ...current, [city.id]: [] })) };
}
