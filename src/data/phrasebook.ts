export const phraseSituations = [
  { id: "all", label: "Все ситуации" },
  { id: "cafe", label: "В кафе" },
  { id: "transport", label: "В транспорте" },
  { id: "shopping", label: "В магазине" },
  { id: "help", label: "Попросить помощи" },
] as const;

export interface TravelPhrase {
  id: string;
  situation: Exclude<typeof phraseSituations[number]["id"], "all">;
  text: string;
  pronunciation: string;
  translation: string;
  usage: string;
}

interface PhrasebookData {
  language: string;
  label: string;
  sources: { label: string; url: string }[];
  phrases: TravelPhrase[];
}

// Russian readings are approximate pronunciation aids, not IPA transcriptions.
export const phrasebooks: Record<string, PhrasebookData> = {
  "Япония": {
    language: "ja-JP", label: "Японский",
    sources: [{ label: "JNTO: японский для путешественников", url: "https://www.japan.travel/en/plan/japanese-language/" }],
    phrases: [
      { id: "ja-order", situation: "cafe", text: "これをください。", pronunciation: "Корэ о кудасай", translation: "Дайте, пожалуйста, это.", usage: "Покажи на блюдо в меню или на витрине, когда делаешь заказ." },
      { id: "ja-thanks", situation: "cafe", text: "ありがとうございます。", pronunciation: "Аригато: годзаимас", translation: "Спасибо.", usage: "Вежливо поблагодари официанта или продавца. Двоеточие обозначает долгий звук." },
      { id: "ja-station", situation: "transport", text: "駅はどこですか。", pronunciation: "Эки ва доко дэс ка", translation: "Где станция?", usage: "Спроси дорогу к железнодорожной станции. Можно показать её название на карте." },
      { id: "ja-price", situation: "shopping", text: "いくらですか。", pronunciation: "Икура дэс ка", translation: "Сколько стоит?", usage: "Покажи на товар, если не видишь ценник." },
      { id: "ja-excuse", situation: "help", text: "すみません。", pronunciation: "Сумимасэн", translation: "Извините.", usage: "Привлеки внимание прохожего или сотрудника перед вопросом; также подходит для извинения." },
      { id: "ja-understand", situation: "help", text: "わかりません。", pronunciation: "Вакаримасэн", translation: "Я не понимаю.", usage: "Скажи, если не понял ответ. Можно показать собеседнику перевод на телефоне." },
    ],
  },
  "Франция": {
    language: "fr-FR", label: "Французский",
    sources: [
      { label: "Open University: счёт в ресторане", url: "https://www.open.edu/openlearn/mod/oucontent/view.php?id=17465&section=2.3" },
      { label: "HelloFrench: как спросить дорогу", url: "https://www.hellofrench.com/en/exercises/lesson-3-asking-for-directions" },
    ],
    phrases: [
      { id: "fr-order", situation: "cafe", text: "Un café, s’il vous plaît.", pronunciation: "Эн кафэ, силь ву плэ", translation: "Один кофе, пожалуйста.", usage: "Закажи кофе у стойки или у официанта. В кафе под café обычно понимают эспрессо." },
      { id: "fr-bill", situation: "cafe", text: "L’addition, s’il vous plaît.", pronunciation: "Ладисьон, силь ву плэ", translation: "Счёт, пожалуйста.", usage: "Когда закончил есть и хочешь рассчитаться." },
      { id: "fr-metro", situation: "transport", text: "Où est le métro ?", pronunciation: "У э лё мэтро", translation: "Где метро?", usage: "Спроси дорогу к метро. Начни обращение с Bonjour — «Бонжур»." },
      { id: "fr-price", situation: "shopping", text: "Combien ça coûte ?", pronunciation: "Конбьен са кут", translation: "Сколько это стоит?", usage: "Покажи продавцу товар, стоимость которого хочешь уточнить." },
      { id: "fr-excuse", situation: "help", text: "Excusez-moi.", pronunciation: "Экскюзэ-муа", translation: "Извините.", usage: "Вежливо обратись к незнакомому человеку перед просьбой." },
      { id: "fr-slow", situation: "help", text: "Parlez plus lentement, s’il vous plaît.", pronunciation: "Парлэ плю лантман, силь ву плэ", translation: "Говорите медленнее, пожалуйста.", usage: "Если собеседник отвечает слишком быстро. Слово plus здесь произносится без конечного s." },
    ],
  },
  "Россия": {
    language: "ru-RU", label: "Русский", sources: [],
    phrases: [
      { id: "ru-order", situation: "cafe", text: "Можно кофе с собой, пожалуйста?", pronunciation: "Мо́жно ко́фе с собо́й, пожа́луйста?", translation: "Заказать кофе навынос.", usage: "Скажи у стойки, если не собираешься оставаться в кафе." },
      { id: "ru-bill", situation: "cafe", text: "Принесите счёт, пожалуйста.", pronunciation: "Принеси́те счёт, пожа́луйста.", translation: "Попросить счёт.", usage: "Обратись к официанту, когда готов рассчитаться." },
      { id: "ru-metro", situation: "transport", text: "Подскажите, где вход в метро?", pronunciation: "Подскажи́те, где вход в метро́?", translation: "Найти вход на станцию.", usage: "Спроси прохожего; у станции может быть несколько входов." },
      { id: "ru-price", situation: "shopping", text: "Сколько это стоит?", pronunciation: "Ско́лько э́то сто́ит?", translation: "Уточнить цену товара.", usage: "Покажи на товар, если ценник отсутствует или непонятен." },
      { id: "ru-help", situation: "help", text: "Подскажите, как сюда пройти?", pronunciation: "Подскажи́те, как сюда́ пройти́?", translation: "Спросить дорогу.", usage: "Покажи адрес или точку на карте, чтобы собеседник понял направление." },
      { id: "ru-slow", situation: "help", text: "Повторите, пожалуйста, помедленнее.", pronunciation: "Повтори́те, пожа́луйста, поме́дленнее.", translation: "Попросить повторить ответ.", usage: "Если не расслышал объяснение или не успел его понять." },
    ],
  },
};
