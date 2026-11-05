import { useI18n } from "../i18n";
import { useMemo, useState } from "react";
import type { Category, City } from "../types";
import { useLocalStorage } from "./useLocalStorage";

export const situations = [
  { id: "all", label: "Свой ритм", categories: ["sights", "food", "walks", "useful"] },
  { id: "first", label: "Первое знакомство", categories: ["sights", "walks"] },
  { id: "coffee", label: "Кофе и прогулка", categories: ["food", "walks"] },
  { id: "practical", label: "Освоиться в городе", categories: ["useful"] },
] as const;
export type Situation = typeof situations[number]["id"];

export function useExplore(cities: City[]) {
  const { t, locale } = useI18n();
  const [cityId, setCityId] = useState(cities[0].id);
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [situation, setSituation] = useState<Situation>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, toggleFavorite] = useLocalStorage("vibly-favorites");
  const city = cities.find((item) => item.id === cityId) ?? cities[0];

  const places = useMemo(() => {
    const candidates = onlyFavorites
      ? cities.flatMap((item) => item.places)
      : city.places;
    const search = query.trim().toLocaleLowerCase(locale);
    return candidates.filter(
      (place) =>
        (situations.find((item) => item.id === situation)!.categories as readonly string[]).includes(place.category) &&
        (category === "all" || place.category === category) &&
        (!onlyFavorites || favorites.includes(place.id)) &&
        `${place.name} ${place.district} ${place.description} ${t(place.name)} ${t(place.district)} ${t(place.description)}`
          .toLocaleLowerCase(locale)
          .includes(search),
    );
  }, [cities, city, category, query, onlyFavorites, favorites, situation, t, locale]);

  function selectCity(id: string) {
    setCityId(id);
    setCategory("all");
    setSituation("all");
    setQuery("");
    setOnlyFavorites(false);
  }

  function resetFilters() {
    setSituation("all");
    setCategory("all");
    setQuery("");
  }

  return {
    city,
    situation,
    selectSituation: (value: Situation) => { setSituation(value); setCategory("all"); setQuery(""); },
    selectCity,
    category,
    setCategory,
    query,
    setQuery,
    onlyFavorites,
    setOnlyFavorites,
    favorites,
    toggleFavorite,
    places,
    resetFilters,
  };
}
