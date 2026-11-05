import { useI18n } from "../i18n";
import { ArrowUpRight, Globe2, MapPin } from "lucide-react";
import { useState } from "react";
import { SelectField } from "./SelectField";
import type { City } from "../types";

interface DestinationPickerProps {
  city: City;
  cities: City[];
  onSelect: (id: string) => void;
}

export function DestinationPicker({
  city,
  cities,
  onSelect,
}: DestinationPickerProps) {
  const { t } = useI18n();
  const [country, setCountry] = useState(city.country);
  const [cityId, setCityId] = useState(city.id);
  const preview = cities.find((item) => item.id === cityId) ?? city;
  const available = cities.filter((item) => item.country === country);
  const countries = [
    ...new Map(cities.map((item) => [item.country, item])).values(),
  ];

  function changeCountry(value: string) {
    setCountry(value);
    setCityId(cities.find((item) => item.country === value)!.id);
  }

  return (
    <form
      className="destination-picker"
      onSubmit={(event) => {
        event.preventDefault();
        onSelect(cityId);
      }}
    >
      <figure className="destination-preview">
        <img src={preview.image} alt={t(preview.name)} style={{ objectPosition: preview.imagePosition }} />
        <figcaption>{t(preview.name)}<span>{t(preview.country)}</span></figcaption>
      </figure>
      <SelectField label={t("Страна")} icon={<Globe2 size={21} />} value={country}
        options={countries.map((item) => ({ value: item.country, label: t(item.country) }))}
        onChange={changeCountry} />
      <SelectField label={t("Город")} icon={<MapPin size={21} />} value={cityId}
        options={available.map((item) => ({ value: item.id, label: t(item.name) }))}
        onChange={setCityId} />
      <button type="submit" className="explore-button">
         {t("Поймать вайб")} <ArrowUpRight size={19} />
      </button>
    </form>
  );
}
