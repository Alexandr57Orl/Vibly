export type Category = "sights" | "food" | "walks" | "useful";

export interface Place {
  id: string;
  name: string;
  category: Category;
  district: string;
  description: string;
  image: string;
  images?: string[];
  tag: string;
  source: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  flag: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition?: string;
  tags: string[];
  phrases: { expression: string; meaning: string }[];
  tip: string;
  places: Place[];
}

export interface PhotoCredit {
  image: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export interface Guide {
  cities: City[];
  photoCredits: Record<string, PhotoCredit>;
}
