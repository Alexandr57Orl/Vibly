import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Camera, Compass, ImagePlus, LogIn, LogOut, MapPin, Plus, Users, X } from "lucide-react";
import { isCommunityPhoto, prepareCommunityPhoto } from "../utils/communityPhoto";
import { useFormValidation } from "../hooks/useFormValidation";
import { Modal } from "./Modal";
import { useI18n } from "../i18n";
import type { City } from "../types";

interface DemoUser { name: string; email: string }
interface Suggestion { id: string; cityId: string; name: string; address: string; description: string; author: string; createdAt: string; photo?: string }
const sessionKey = "vibly-demo-user";
const placesKey = "vibly-community-places";

function readUser(): DemoUser | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(sessionKey) ?? "null");
    return value && typeof value.name === "string" && typeof value.email === "string" ? value : null;
  } catch { return null; }
}

function readPlaces(): Suggestion[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(placesKey) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is Suggestion => item &&
      ["id", "cityId", "name", "address", "description", "author", "createdAt"].every(key => typeof item[key] === "string") &&
      (item.photo === undefined || isCommunityPhoto(item.photo))) : [];
  } catch { return []; }
}

export function CommunityPlaces({ city }: { city: City }) {
  const { t, locale } = useI18n();
  const [user, setUser] = useState(readUser);
  const [places, setPlaces] = useState(readPlaces);
  const [auth, setAuth] = useState<"login" | "register" | null>(null);
  const [composing, setComposing] = useState(false);
  const [notice, setNotice] = useState("");
  const [photo, setPhoto] = useState<string>();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const photoRequest = useRef(0);
  const authValidation = useFormValidation();
  const placeValidation = useFormValidation();
  const [descriptionLength, setDescriptionLength] = useState(0);
  useEffect(() => {
    if (!composing) { setPhoto(undefined); setPhotoError(""); setPhotoLoading(false); }
    return () => { photoRequest.current++; };
  }, [composing]);
  const cityPlaces = places.filter(place => place.cityId === city.id);

  function suggest() {
    setNotice("");
    placeValidation.reset(); authValidation.reset(); setDescriptionLength(0);
    if (user) setComposing(true); else setAuth("login");
  }

  async function attachPhoto(file: File) {
    const request = ++photoRequest.current;
    setPhotoError(""); setPhotoLoading(true);
    try {
      const result = await prepareCommunityPhoto(file);
      if (request === photoRequest.current) setPhoto(result);
    } catch (error) {
      if (request === photoRequest.current) setPhotoError(error instanceof Error && error.message === "size"
        ? "Фото слишком большое. Выбери файл до 10 МБ."
        : "Не удалось открыть фото. Выбери изображение JPG, PNG или WebP.");
    } finally { if (request === photoRequest.current) setPhotoLoading(false); }
  }

  function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!authValidation.validate(event.currentTarget)) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const name = auth === "register" ? String(form.get("name")).trim() : email.split("@")[0];
    if (!name || !email) return;
    const next = { name, email };
    setUser(next);
    try { sessionStorage.setItem(sessionKey, JSON.stringify(next)); }
    catch { setNotice("Хранилище недоступно. Демопрофиль работает до перезагрузки страницы."); }
    setAuth(null);
    placeValidation.reset(); setDescriptionLength(0);
    setComposing(true);
  }

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (photoLoading) return;
    if (!user) { setComposing(false); setAuth("login"); return; }
    if (!placeValidation.validate(event.currentTarget)) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    const address = String(form.get("address")).trim();
    const description = String(form.get("description")).trim();
    if (!name || !address || description.length < 20) {
      setNotice("Заполни название, адрес и описание от 20 символов."); return;
    }
    // randomUUID is unavailable on HTTP when opening the dev site from a phone.
    const id = globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const next = [{ id, cityId: city.id, name, address, description,
      author: user.name, createdAt: new Date().toISOString(), ...(photo ? { photo } : {}) }, ...places];
    setPlaces(next);
    try {
      localStorage.setItem(placesKey, JSON.stringify(next));
      setNotice("Место добавлено! В деморежиме оно видно только в этом браузере.");
    } catch { setNotice("Место добавлено на эту сессию. Браузер не разрешил сохранить его."); }
    setComposing(false);
  }

  return <div className="community-places">
    <div className="catalog-heading community-heading"><div><h2>{t("Места от путешественников")}</h2>
      <p>{t("Знаешь место, которого нет в путеводителе? Расскажи о нём.")} · {t(city.name)}</p></div>
      {cityPlaces.length > 0 && <button className="community-primary" onClick={suggest}>
        <Plus size={17} />{t("Предложить место")}</button>}
    </div>
    <div className="community-demo"><Users size={19} /><p>{t("Деморежим: вход и регистрация имитируются. Предложения сохраняются только в этом браузере и не отправляются на сервер. Пароль не сохраняется.")}</p></div>
    <div className="community-account">{user ? <><span>{t("Ты вошёл как")} <strong>{user.name}</strong></span>
      <button className="quiet-button" onClick={() => {
        setUser(null); setComposing(false);
        try { sessionStorage.removeItem(sessionKey); } catch { /* The in-memory session is already cleared. */ }
      }}><LogOut size={16} />{t("Выйти")}</button></> : <><span>{t("Читать может каждый. Чтобы предложить место, войди или зарегистрируйся.")}</span>
      <button className="quiet-button" onClick={() => setAuth("login")}><LogIn size={16} />{t("Войти")}</button></>}</div>
    {notice && <p className="community-notice" role="status">{t(notice)}</p>}
    {cityPlaces.length ? <div className="community-grid">{cityPlaces.map(place => <article className="community-card" key={place.id}>
      {place.photo && <img className="community-card-photo" src={place.photo} alt={place.name} loading="lazy" />}
      <span className="community-badge">{t("Предложено путешественником")}</span><h3>{place.name}</h3>
      <p className="community-address"><MapPin size={15} />{place.address}</p>
      <p className="community-description">{place.description}</p><footer><span>{place.author}</span>
        <time dateTime={place.createdAt}>{Number.isNaN(Date.parse(place.createdAt)) ? "" : new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(place.createdAt))}</time></footer>
    </article>)}</div> : <div className="community-empty">
      <div className="community-empty-art" aria-hidden="true"><span className="community-empty-orbit" />
        <span className="community-empty-pin"><MapPin size={38} strokeWidth={1.5} /></span>
        <span className="community-empty-camera"><Camera size={23} /></span><Compass className="community-empty-compass" size={26} />
      </div><div className="community-empty-copy"><span className="community-empty-kicker">{t("ТВОЙ ГОРОД. ТВОИ НАХОДКИ.")}</span>
        <h3>{t("Первое открытие — за тобой")}</h3>
        <p>{t("Здесь появятся предложенные места этого города. Поделись любимым кафе, тихим двором или необычным маршрутом.")}</p>
        <button className="community-primary" onClick={suggest}><Plus size={17} />{t("Поделиться открытием")}</button>
      </div></div>}

    {auth && <Modal title={t(auth === "login" ? "Войти" : "Регистрация")} onClose={() => setAuth(null)} className="community-modal">
      <p className="community-auth-note">{t("Это демовход. Используй вымышленные данные и любой тестовый пароль от 6 символов. Проверки аккаунта пока нет.")}</p>
      <form className="community-form" key={auth} {...authValidation.formProps} onSubmit={authenticate}>
        {auth === "register" && <label>{t("Как тебя зовут")}<input name="name" autoComplete="nickname" required maxLength={60} {...authValidation.fieldProps("name")} />{authValidation.message("name")}</label>}
        <label>Email<input name="email" type="email" autoComplete="off" placeholder="traveler@example.com" required maxLength={254} {...authValidation.fieldProps("email")} />{authValidation.message("email")}</label>
        <label>{t("Тестовый пароль")}<input name="password" type="password" autoComplete="off" required minLength={6} maxLength={128} {...authValidation.fieldProps("password")} />{authValidation.message("password")}</label>
        <button className="community-primary" type="submit">{t(auth === "login" ? "Войти в демопрофиль" : "Создать демопрофиль")}</button>
      </form><button className="community-auth-switch quiet-button" onClick={() => { authValidation.reset(); setAuth(auth === "login" ? "register" : "login"); }}>
        {t(auth === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти")}</button>
    </Modal>}
    {composing && user && <Modal title={t("Предложить место")} onClose={() => setComposing(false)} className="community-modal">
      <p>{t("Город:")} {t(city.name)} · {t("Твоё предложение дополнит раздел путешественников.")}</p>
      <form className="community-form" {...placeValidation.formProps} onSubmit={publish}>
        <label>{t("Название места")}<input name="name" required maxLength={120} {...placeValidation.fieldProps("name")} />{placeValidation.message("name")}</label>
        <label>{t("Адрес или ориентир")}<input name="address" required maxLength={240} {...placeValidation.fieldProps("address")} />{placeValidation.message("address")}</label>
        <label>{t("Почему стоит заглянуть")}<textarea name="description" required minLength={20} maxLength={2000} rows={5} {...placeValidation.fieldProps("description")} onChange={event => setDescriptionLength(event.currentTarget.value.trim().length)} />
          <span className="community-character-count">{descriptionLength} / 2000 · {t("минимум 20 символов")}</span>{placeValidation.message("description")}</label>
        <p className="community-auth-note">{t("От 20 до 2000 символов. Расскажи, что здесь особенного и как найти это место.")}</p>
        <div className="community-photo-field"><span className="community-photo-title">{t("Фото места")} <small>{t("необязательно")}</small></span>
          {photo && <div className="community-photo-preview"><img src={photo} alt={t("Предпросмотр фото места")} />
            <button type="button" className="community-photo-remove" aria-label={t("Удалить фото")} onClick={() => { photoRequest.current++; setPhoto(undefined); setPhotoLoading(false); setPhotoError(""); }}><X size={18} /></button></div>}
          <label className="community-photo-upload"><ImagePlus size={22} /><span>{t(photoLoading ? "Обрабатываем фото…" : photo ? "Заменить фото" : "Добавить фото")}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={photoLoading} onChange={event => {
              const file = event.currentTarget.files?.[0]; event.currentTarget.value = "";
              if (file) void attachPhoto(file);
            }} /></label>
          <p className="community-auth-note">{t("JPG, PNG или WebP до 10 МБ. Фото автоматически уменьшается и сохраняется в этом браузере.")}</p>
          {photoError && <p className="community-photo-error" role="alert">{t(photoError)}</p>}
        </div>
        {notice && <p role="status">{t(notice)}</p>}
        <button className="community-primary" type="submit" disabled={photoLoading}><Plus size={17} />{t("Добавить в демоленту")}</button>
      </form>
    </Modal>}
  </div>;
}
