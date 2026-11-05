import type { City, Guide, PhotoCredit, Place } from "../types";

const GUIDE_API_URL = (import.meta.env.DEV ? "/api/guide" : import.meta.env.VITE_GUIDE_API_URL) ||
  "https://6aec88e1fc3b911e6fd54a2f.mockapi.io/api/v1/guide/information";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStrings(value: Record<string, unknown>, fields: string[]): boolean {
  return fields.every(field => typeof value[field] === "string");
}

function isPlace(value: unknown): value is Place {
  return isObject(value) &&
    hasStrings(value, ["id", "name", "category", "district", "description", "image", "tag", "source"]) &&
    value.id !== "" &&
    (value.images === undefined || (Array.isArray(value.images) &&
      value.images.every(image => typeof image === "string" && image.trim() !== ""))) &&
    ["sights", "food", "walks", "useful"].includes(value.category as string);
}

function isCity(value: unknown): value is City {
  return isObject(value) &&
    hasStrings(value, ["id", "name", "country", "flag", "subtitle", "description", "image", "tip"]) &&
    value.id !== "" &&
    (value.imagePosition === undefined || typeof value.imagePosition === "string") &&
    Array.isArray(value.tags) && value.tags.every(tag => typeof tag === "string") &&
    Array.isArray(value.phrases) && value.phrases.every(phrase =>
      isObject(phrase) && hasStrings(phrase, ["expression", "meaning"])) &&
    Array.isArray(value.places) && value.places.every(isPlace);
}

function isPhotoCredit(value: unknown): value is PhotoCredit {
  return isObject(value) && hasStrings(value, ["image", "author", "license", "licenseUrl", "source"]);
}

/** The endpoint returns an array with one guide object, as required by MockAPI. */
export function parseGuideResponse(data: unknown): Guide {
  const guide: unknown = Array.isArray(data) ? data[0] : undefined;
  if (!isObject(guide) ||
    !Array.isArray(guide.cities) || !guide.cities.every(isCity) ||
    !isObject(guide.photoCredits) || !Object.values(guide.photoCredits).every(isPhotoCredit)) {
    throw new Error("Сервис вернул некорректные данные путеводителя.");
  }

  if (guide.cities.length === 0) {
    throw new Error("В путеводителе пока нет городов. Попробуй зайти позже.");
  }

  const cityIds = guide.cities.map(city => city.id);
  const placeIds = guide.cities.flatMap(city => city.places.map(place => place.id));
  if (new Set(cityIds).size !== cityIds.length || new Set(placeIds).size !== placeIds.length) {
    throw new Error("В данных путеводителя повторяются идентификаторы городов или мест.");
  }

  return { cities: guide.cities, photoCredits: guide.photoCredits as Record<string, PhotoCredit> };
}

export async function fetchGuide(signal: AbortSignal): Promise<Guide> {
  const response = await fetch(GUIDE_API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить путеводитель (код ${response.status}).`);
  }

  const data: unknown = await response.json();
  const guide = parseGuideResponse(data);
  if (!import.meta.env.DEV) return guide;

  // Let phones on the local network load external photos through the dev server.
  const imageUrl = (url: string) => url.replace(/^https:\/\/images\.unsplash\.com\//, "/remote-images/");
  return {
    ...guide,
    cities: guide.cities.map(city => ({
      ...city,
      image: imageUrl(city.image),
      places: city.places.map(place => ({
        ...place,
        image: imageUrl(place.image),
        images: place.images?.map(imageUrl),
      })),
    })),
    photoCredits: Object.fromEntries(Object.entries(guide.photoCredits).map(([key, credit]) =>
      [key, { ...credit, image: imageUrl(credit.image) }])),
  };
}
