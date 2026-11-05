export type AdviceTopic = "road" | "transport" | "etiquette" | "food";
export type AdviceKind = "rule" | "custom" | "practical";

export interface LocalAdviceItem {
  id: string;
  topic: AdviceTopic;
  kind: AdviceKind;
  title: string;
  body: string;
  action: string;
  source: { label: string; url: string };
}

// Editorial review date: update after checking the linked sources.
export const adviceReviewedAt = "2026-11-05";

const mRoad = { label: "Московский транспорт", url: "https://transport.mos.ru/pedestrians/pdd" };
const mMetro = { label: "Московский транспорт", url: "https://transport.mos.ru/metro/rules" };
const jManners = { label: "JNTO", url: "https://www.japan.travel/en/guide/japanese-manners-dos-and-donts/" };
const pCafe = { label: "Paris je t’aime", url: "https://parisjetaime.com/eng/article/prices-spending-tipping-a524" };

// City IDs and source URLs stay unchanged across interface languages.
export const localAdvice: Record<string, LocalAdviceItem[]> = {
  moscow: [
    {
      id: "crossing", topic: "road", kind: "rule",
      title: "Зебра — не повод выходить не глядя",
      body: "На зебре водители должны уступать пешеходам, но выходить не глядя нельзя. Дождись зелёного, а без светофора оцени скорость и расстояние до машин.",
      action: "Остановись у края, посмотри в обе стороны и убедись, что тебя пропускают.",
      source: mRoad,
    },
    {
      id: "wide-roads", topic: "road", kind: "practical",
      title: "Широкую улицу лучше не срезать",
      body: "Ищи обозначенный переход, подземный или надземный переход. Не выходи из-за припаркованной машины: она закрывает обзор и тебе, и водителю.",
      action: "Сначала найди переход на карте, потом выбирай сторону улицы.",
      source: mRoad,
    },
    {
      id: "scooters", topic: "road", kind: "rule",
      title: "На самокате через зебру — пешком",
      body: "Перед пешеходным переходом нужно спешиться и вести самокат рядом. Это относится и к велосипеду: не пересекай зебру верхом.",
      action: "Сойди с самоката до выхода на переход.",
      source: { label: "Московский транспорт", url: "https://transport.mos.ru/kicksharing/safety-rules" },
    },
    {
      id: "escalator", topic: "transport", kind: "rule",
      title: "На эскалаторе стой справа",
      body: "В московском метро стоят справа, держась за поручень. Не задерживайся на сходе: за тобой продолжают ехать другие пассажиры.",
      action: "Отойди от схода и только потом сверяйся с картой.",
      source: mMetro,
    },
    {
      id: "seats", topic: "etiquette", kind: "rule",
      title: "Уступай место тем, кому труднее стоять",
      body: "Правила метро требуют взаимной вежливости и предусматривают уступать места пожилым людям, пассажирам с инвалидностью и с детьми.",
      action: "Если сомневаешься, спокойно предложи своё место.",
      source: mMetro,
    },
    {
      id: "closures", topic: "transport", kind: "practical",
      title: "Проверь перекрытия перед прогулкой",
      body: "Для маршрута через центр пригодится городская карта ограничений: на ней можно выбрать дату и проверить изменения движения.",
      action: "Сверь маршрут с картой ограничений перед выходом.",
      source: { label: "Московский транспорт", url: "https://i.transport.mos.ru/perekrytiya" },
    },
  ],
  tokyo: [
    {
      id: "crossing", topic: "road", kind: "rule",
      title: "Здесь машины едут слева",
      body: "В Японии левостороннее движение, водители должны уступать пешеходам. Пользуйся переходом и своим сигналом светофора; даже на зелёный проверяй поворачивающие машины.",
      action: "Перед выходом посмотри в обе стороны; не полагайся на привычное направление потока.",
      source: { label: "Tokyo Metropolitan Police", url: "https://www.keishicho.metro.tokyo.lg.jp/multilingual/english/finding_services/living_guide/living_guide_e_3.html" },
    },
    {
      id: "trains", topic: "transport", kind: "custom",
      title: "В поезде говорят тише, а звонки откладывают",
      body: "На городском транспорте принято говорить негромко и не разговаривать по телефону. Перед посадкой встань сбоку от дверей и дай пассажирам выйти.",
      action: "Переведи телефон в беззвучный режим до посадки.",
      source: jManners,
    },
    {
      id: "shoes", topic: "etiquette", kind: "custom",
      title: "Не всякое помещение — в уличной обуви",
      body: "В домах, некоторых ресторанах, храмах и традиционных гостиницах обувь снимают. Ориентируйся на таблички, полки для обуви и просьбы персонала.",
      action: "У входа проверь, где заканчивается зона уличной обуви.",
      source: jManners,
    },
    {
      id: "tips", topic: "food", kind: "custom",
      title: "Чаевые обычно не оставляют",
      body: "В обычных кафе, ресторанах, такси и отелях Японии чаевые не являются общепринятой практикой. Не нужно автоматически добавлять процент к счёту.",
      action: "Оплати указанную сумму и поблагодари: «Arigatō gozaimasu».",
      source: { label: "JNTO", url: "https://www.japan.travel/en/plan/tipping-in-japan/" },
    },
    {
      id: "photos", topic: "etiquette", kind: "custom",
      title: "Сначала спроси, потом фотографируй",
      body: "Перед съёмкой человека спроси разрешение. В магазинах и на объектах могут быть запреты на фото; не перекрывай проход ради кадра.",
      action: "Проверь таблички и отойди от потока, прежде чем достать камеру.",
      source: { label: "GO TOKYO", url: "https://www.gotokyo.org/en/plan/tips-for-tokyo-sightseeing/index.html" },
    },
    {
      id: "rubbish", topic: "etiquette", kind: "practical",
      title: "Урна может оказаться не рядом",
      body: "Общественных урн бывает мало. Будь готов какое-то время нести упаковку с собой, пока не найдёшь подходящую урну.",
      action: "Положи небольшой пакет для мусора в рюкзак.",
      source: { label: "JNTO", url: "https://www.japan.travel/en/faq/" },
    },
  ],
  paris: [
    {
      id: "crossing", topic: "road", kind: "rule",
      title: "Переходи на свой зелёный, а не вслед за толпой",
      body: "Водители должны уступать пешеходам на переходе. Город рекомендует дождаться зелёного и проверить движение: чужой выход на красный — не ориентир.",
      action: "Убери телефон и проверь проезжую часть перед первым шагом.",
      source: { label: "Ville de Paris", url: "https://www.paris.fr/pages/pietons-nos-conseils-pour-circuler-en-toute-securite-18050" },
    },
    {
      id: "bikes", topic: "road", kind: "rule",
      title: "Велосипедный поток — тоже движение",
      body: "На некоторых перекрёстках отдельный знак разрешает велосипедисту ехать в указанном направлении на красный, уступая пешеходам. Красный для машин не означает, что рядом никто не движется.",
      action: "Перед пересечением велодорожки посмотри, откуда едут велосипеды.",
      source: { label: "Ville de Paris", url: "https://www.paris.fr/en/pages/how-to-ride-a-bike-safely-in-paris-33582" },
    },
    {
      id: "tickets", topic: "transport", kind: "rule",
      title: "Купить билет недостаточно — его нужно валидировать",
      body: "RATP требует валидировать билет при каждой поездке. Сохраняй билет или носитель до выхода из сети: он может понадобиться при проверке.",
      action: "Приложи билет или телефон к считывателю; у каждого пассажира должна быть своя валидация.",
      source: { label: "RATP", url: "https://www.ratp.fr/en/visiting-paris/travelers-guide/metro-rer" },
    },
    {
      id: "hello", topic: "etiquette", kind: "custom",
      title: "Начни разговор с Bonjour",
      body: "Вежливое приветствие помогает начать разговор в магазине или кафе. Днём подойдёт Bonjour, вечером — Bonsoir; уходя, можно сказать Au revoir.",
      action: "Сначала поздоровайся, затем переходи к вопросу или заказу.",
      source: { label: "Campus France", url: "https://www.bielorussie.campusfrance.org/fr/les-francais-mode-d-emploi" },
    },
    {
      id: "tips", topic: "food", kind: "custom",
      title: "Обслуживание уже включено",
      body: "Указанные цены включают налоги и обслуживание. Дополнительные чаевые — способ поблагодарить за особенно хороший сервис, а не обязательная доплата.",
      action: "Сначала проверь счёт и реши, хочешь ли оставить что-то дополнительно.",
      source: pCafe,
    },
    {
      id: "counter", topic: "food", kind: "practical",
      title: "Кофе у стойки и на террасе может стоить по-разному",
      body: "В кафе напиток у стойки, за столиком внутри и на террасе может иметь разную цену. Сверь меню для выбранного места до заказа.",
      action: "Посмотри цены до того, как сесть на террасе.",
      source: pCafe,
    },
  ],
};
