// Rebuilds the backend import and downloads licensed Commons photographs.
// Run manually with: node scripts/expand-guide.mjs
import fs from 'node:fs/promises';
await fs.mkdir('.cache/guide-photos', { recursive: true });
const guide = JSON.parse(await fs.readFile('docs/guide.json', 'utf8'));
const en = JSON.parse(await fs.readFile('src/i18n/en.json', 'utf8'));
const tr = (ru, english) => { en[ru] = english; return ru; };
const place = (id, ru, english, category, district, description, translation, source, query) => ({
  id, name: tr(ru, english), category, district: tr(district, district),
  description: tr(description, translation), image: '', images: [],
  tag: tr('Стоит увидеть', 'Worth discovering'), source, query,
});
const city = (id, ru, english, country, countryEn, flag, description, descriptionEn, tip, tipEn, phrases, places) => ({
  id, name: tr(ru, english), country: tr(country, countryEn), flag,
  subtitle: tr('Твой следующий город. Твои новые открытия.', 'Your next city. Your next discoveries.'),
  description: tr(description, descriptionEn), image: '', tags: [tr('Архитектура', 'Architecture'), tr('Прогулки', 'Walks')],
  tip: tr(tip, tipEn), phrases: phrases.map(([expression, meaning, meaningEn]) => ({ expression, meaning: tr(meaning, meaningEn) })), places,
});
const additions = [
  city('rome', 'Рим', 'Rome', 'Италия', 'Italy', '🇮🇹',
    'Античные амфитеатры, площади с фонтанами и переулки Трастевере. История здесь становится частью обычной прогулки.',
    'Ancient amphitheatres, fountain-filled squares and Trastevere lanes. History becomes part of an everyday walk.',
    'Собери маршрут по районам: исторический центр удобно исследовать пешком. Условия входа в музеи проверяй на официальных сайтах.',
    'Plan walks by neighbourhood: the historic centre is easy to explore on foot. Check museum admission on official websites.',
    [['Buongiorno!', 'Добрый день — вежливое приветствие.', 'Good day — a polite greeting.'], ['Un caffè, per favore.', 'Один кофе, пожалуйста.', 'One coffee, please.']], [
      place('rome-colosseum', 'Колизей', 'Colosseum', 'sights', 'Celio', 'Античный амфитеатр с арками и галереями. Посмотри на него с площади, а для знакомства изнутри заранее изучи варианты посещения.', 'An ancient amphitheatre of arches and galleries. Admire it from the square and check admission options before exploring inside.', 'https://colosseo.it/en/', 'Colosseum Rome exterior'),
      place('rome-pantheon', 'Пантеон', 'Pantheon', 'sights', 'Pigna', 'Античный храм с огромным куполом и круглым проёмом в его центре. После посещения задержись на площади Ротонды.', 'An ancient temple with a vast dome and a circular opening at its centre. Afterwards, linger in Piazza della Rotonda.', 'https://pantheon.cultura.gov.it/', 'Pantheon Rome exterior'),
      place('rome-trevi', 'Фонтан Треви', 'Trevi Fountain', 'sights', 'Trevi', 'Монументальный фонтан среди тесных улиц центра. Рассмотри скульптуры и продолжи прогулку по соседним переулкам.', 'A monumental fountain among narrow central streets. Take in the sculptures and continue through the nearby lanes.', 'https://www.turismoroma.it/en/places/trevi-fountain', 'Trevi Fountain Rome'),
      place('rome-trastevere', 'Трастевере', 'Trastevere', 'walks', 'Trastevere', 'Квартал за Тибром с тёплыми фасадами, небольшими площадями и тратториями. Подходит для прогулки без строгого маршрута.', 'A neighbourhood across the Tiber with warm-coloured facades, small squares and trattorias. Ideal for an unhurried wander.', 'https://www.turismoroma.it/en', 'Trastevere Rome street'),
      place('rome-navona', 'Пьяцца Навона', 'Piazza Navona', 'walks', 'Parione', 'Вытянутая площадь с барочными фонтанами и дворцами. Отсюда удобно свернуть к небольшим улицам исторического центра.', 'An elongated square with Baroque fountains and palaces. Continue into the smaller streets of the historic centre.', 'https://www.turismoroma.it/en/places/piazza-navona', 'Piazza Navona Rome'),
    ]),
  city('london', 'Лондон', 'London', 'Великобритания', 'United Kingdom', '🇬🇧',
    'Прогулки вдоль Темзы, большие музеи и кварталы с разным характером. Выбирай свой темп между парками и оживлёнными улицами.',
    'Thames-side walks, major museums and neighbourhoods with distinct personalities. Find your pace between parks and busy streets.',
    'Группируй остановки по берегам Темзы и районам. Перед поездкой проверь маршруты и способы оплаты на сайте TfL.',
    'Group stops by neighbourhood and bank of the Thames. Check routes and payment options on the TfL website before travelling.',
    [['Cheers!', 'Спасибо — неформально, в повседневном общении.', 'An informal way to say thank you.'], ['Excuse me, please.', 'Извините, пожалуйста — чтобы обратиться к человеку.', 'A polite way to get someone’s attention.']], [
      place('london-big-ben', 'Биг-Бен и Вестминстер', 'Big Ben and Westminster', 'sights', 'Westminster', 'Часовая башня, здание парламента и виды с Вестминстерского моста. Начни здесь прогулку вдоль Темзы.', 'The clock tower, Parliament and views from Westminster Bridge. Start a walk along the Thames here.', 'https://www.parliament.uk/visiting/', 'Big Ben Westminster London'),
      place('london-tower-bridge', 'Тауэрский мост', 'Tower Bridge', 'sights', 'Tower Bridge', 'Мост с двумя башнями и пешеходными галереями над рекой. Красивые виды открываются с набережных по обе стороны Темзы.', 'A bridge with twin towers and walkways above the river. Enjoy views from the embankments on either side of the Thames.', 'https://www.towerbridge.org.uk/', 'Tower Bridge London'),
      place('london-british-museum', 'Британский музей', 'British Museum', 'sights', 'Bloomsbury', 'Музей мировых культур с просторным Большим двором под стеклянной крышей. Выбери несколько залов, чтобы не спешить.', 'A museum of world cultures with a spacious Great Court under a glass roof. Pick a few galleries and take your time.', 'https://www.britishmuseum.org/', 'British Museum Great Court'),
      place('london-hyde-park', 'Гайд-парк', 'Hyde Park', 'walks', 'Hyde Park', 'Большой городской парк с аллеями и озером Серпентайн. Место для паузы между музеями и прогулками по центру.', 'A large urban park with avenues and the Serpentine lake. Pause here between museums and city walks.', 'https://www.royalparks.org.uk/visit/parks/hyde-park', 'Hyde Park London Serpentine'),
      place('london-borough-market', 'Боро-маркет', 'Borough Market', 'food', 'Southwark', 'Продуктовый рынок рядом с Лондонским мостом. Загляни к прилавкам и продолжи прогулку вдоль южного берега.', 'A food market near London Bridge. Browse the stalls and continue along the South Bank.', 'https://boroughmarket.org.uk/', 'Borough Market London'),
    ]),
  city('istanbul', 'Стамбул', 'Istanbul', 'Турция', 'Türkiye', '🇹🇷',
    'Купола над старым городом, паромы через Босфор и шумные базары. Исследуй город по обе стороны пролива.',
    'Domes above the old city, ferries across the Bosphorus and bustling bazaars. Explore both sides of the strait.',
    'На посещение мечетей выбирай подходящую одежду и проверяй правила входа. Паромы помогают увидеть город с воды.',
    'Dress appropriately for mosque visits and check entry rules. Ferries offer a view of the city from the water.',
    [['Merhaba!', 'Здравствуйте — универсальное приветствие.', 'Hello — an everyday greeting.'], ['Teşekkür ederim.', 'Спасибо — вежливая благодарность.', 'Thank you — a polite expression of gratitude.']], [
      place('istanbul-hagia-sophia', 'Айя-София', 'Hagia Sophia', 'sights', 'Sultanahmet', 'Знаменитый памятник с большим куполом в историческом центре. Перед посещением проверь актуальные правила доступа.', 'A landmark with a vast dome in the historic centre. Check current access rules before visiting.', 'https://muze.gov.tr/', 'Hagia Sophia Istanbul exterior'),
      place('istanbul-blue-mosque', 'Голубая мечеть', 'Blue Mosque', 'sights', 'Sultanahmet', 'Мечеть Султанахмет с каскадом куполов и стройными минаретами. На площади рядом удобно начать знакомство со старым городом.', 'The Sultan Ahmed Mosque with cascading domes and slender minarets. The adjoining square is a good starting point for the old city.', 'https://istanbul.goturkiye.com/', 'Sultan Ahmed Mosque Istanbul'),
      place('istanbul-galata', 'Галатская башня', 'Galata Tower', 'sights', 'Galata', 'Каменная башня над крутыми улицами Галаты. Исследуй окрестные лестницы, переулки и небольшие кафе.', 'A stone tower above Galata’s steep streets. Explore the surrounding stairways, lanes and small cafés.', 'https://muze.gov.tr/', 'Galata Tower Istanbul'),
      place('istanbul-grand-bazaar', 'Гранд-базар', 'Grand Bazaar', 'food', 'Beyazıt', 'Крытый базар с сетью торговых улиц. Рассмотри витрины и сделай паузу за чаем в окрестных кафе.', 'A covered bazaar with a network of shopping streets. Browse the windows and pause for tea in a nearby café.', 'https://istanbul.goturkiye.com/', 'Grand Bazaar Istanbul interior'),
      place('istanbul-topkapi', 'Дворец Топкапы', 'Topkapı Palace', 'sights', 'Cankurtaran', 'Дворцовый комплекс с дворами и видами на воду. Выдели время на архитектуру и прогулку по территории.', 'A palace complex with courtyards and views over the water. Leave time for its architecture and grounds.', 'https://www.millisaraylar.gov.tr/', 'Topkapi Palace Istanbul courtyard'),
    ]),
  city('barcelona', 'Барселона', 'Barcelona', 'Испания', 'Spain', '🇪🇸',
    'Архитектура Гауди, узкие улицы старого города и прогулки к морю. Здесь легко чередовать искусство и отдых.',
    'Gaudí’s architecture, old-town lanes and walks towards the sea. Alternate art with time to unwind.',
    'Популярные архитектурные памятники планируй заранее. Для неспешной прогулки оставь отдельное время на старый город.',
    'Plan visits to popular architectural landmarks ahead. Set aside separate time for a relaxed old-town walk.',
    [['Bon dia!', 'Добрый день на каталанском языке.', 'Good day in Catalan.'], ['Gràcies!', 'Спасибо на каталанском языке.', 'Thank you in Catalan.']], [
      place('barcelona-sagrada', 'Саграда Фамилия', 'Sagrada Família', 'sights', 'Eixample', 'Базилика Антонио Гауди с башнями и сложными скульптурными фасадами. Внутри обрати внимание на свет витражей.', 'Antoni Gaudí’s basilica with soaring towers and intricate sculpted facades. Inside, look for the light through the stained glass.', 'https://sagradafamilia.org/en/', 'Sagrada Familia Barcelona exterior'),
      place('barcelona-guell', 'Парк Гуэль', 'Park Güell', 'walks', 'Gràcia', 'Парк с мозаиками, необычными павильонами и видами на Барселону. Удобная обувь пригодится на подъёмах.', 'A park of mosaics, unusual pavilions and views over Barcelona. Comfortable shoes help on the slopes.', 'https://parkguell.barcelona/en', 'Park Guell Barcelona terrace'),
      place('barcelona-batllo', 'Дом Бальо', 'Casa Batlló', 'sights', 'Passeig de Gràcia', 'Дом Гауди с волнообразным фасадом и цветной мозаикой. Рассмотри детали с бульвара или изучи интерьеры.', 'A Gaudí house with an undulating facade and colourful mosaics. Admire its details from the avenue or explore the interiors.', 'https://www.casabatllo.es/en/', 'Casa Batllo Barcelona facade'),
      place('barcelona-gothic', 'Готический квартал', 'Gothic Quarter', 'walks', 'Ciutat Vella', 'Лабиринт переулков, небольших площадей и старых фасадов. Гуляй без спешки и сворачивай с самых людных улиц.', 'A maze of lanes, small squares and old facades. Take your time and turn away from the busiest streets.', 'https://www.barcelonaturisme.com/', 'Gothic Quarter Barcelona street'),
      place('barcelona-boqueria', 'Рынок Бокерия', 'La Boqueria', 'food', 'La Rambla', 'Крытый рынок рядом с Рамблой с продуктовыми прилавками и заведениями. Подходит для остановки во время прогулки по центру.', 'A covered market beside La Rambla with food stalls and places to eat. Stop here during a central-city walk.', 'https://www.boqueria.barcelona/', 'La Boqueria Barcelona market'),
    ]),
  city('dubai', 'Дубай', 'Dubai', 'ОАЭ', 'United Arab Emirates', '🇦🇪',
    'Высотные панорамы и старые кварталы у залива. Посмотри на город с набережной, а затем исследуй его историческую часть.',
    'High-rise panoramas and old creekside districts. Take in the waterfront, then explore the historic city.',
    'Учитывай жару и расстояния: планируй прогулки на комфортное время и проверяй транспорт между районами.',
    'Allow for heat and distances: choose comfortable times for walks and check transport between districts.',
    [['Marhaba!', 'Здравствуйте — приветствие на арабском.', 'Hello — a greeting in Arabic.'], ['Shukran!', 'Спасибо на арабском языке.', 'Thank you in Arabic.']], [
      place('dubai-burj', 'Бурдж-Халифа', 'Burj Khalifa', 'sights', 'Downtown Dubai', 'Небоскрёб, который определяет силуэт центра Дубая. Сравни вид снизу с панорамой со смотровых площадок.', 'The skyscraper that defines Downtown Dubai’s skyline. Compare the view from below with the observation-deck panorama.', 'https://www.burjkhalifa.ae/', 'Burj Khalifa Dubai tower'),
      place('dubai-marina', 'Дубай Марина', 'Dubai Marina', 'walks', 'Dubai Marina', 'Набережная среди высотных домов и яхт. Выбери небольшой участок для прогулки вдоль воды.', 'A waterfront among high-rise buildings and yachts. Choose a stretch for a walk beside the water.', 'https://www.visitdubai.com/en/', 'Dubai Marina skyline'),
      place('dubai-al-fahidi', 'Исторический квартал Аль-Фахиди', 'Al Fahidi Historical Neighbourhood', 'walks', 'Bur Dubai', 'Узкие проходы, внутренние дворы и традиционные ветровые башни. Здесь можно увидеть другой масштаб города.', 'Narrow passages, courtyards and traditional wind towers. Discover a different scale of the city here.', 'https://www.visitdubai.com/en/', 'Al Fahidi Dubai wind tower'),
      place('dubai-future', 'Музей будущего', 'Museum of the Future', 'sights', 'Trade Centre', 'Здание в форме кольца с арабской каллиграфией на фасаде. Посмотри на архитектуру и заранее изучи программу посещения.', 'A ring-shaped building with Arabic calligraphy across its facade. Admire the architecture and check visit options ahead.', 'https://museumofthefuture.ae/en', 'Museum of the Future Dubai exterior'),
      place('dubai-creek', 'Дубай-Крик', 'Dubai Creek', 'walks', 'Dubai Creek', 'Залив между историческими районами Дейра и Бур-Дубай. Наблюдай за лодками и гуляй вдоль старых торговых кварталов.', 'The creek between historic Deira and Bur Dubai. Watch the boats and walk beside the old trading districts.', 'https://www.visitdubai.com/en/', 'Dubai Creek abra'),
    ]),
  city('new-york', 'Нью-Йорк', 'New York', 'США', 'United States', '🇺🇸',
    'Улицы Манхэттена, мосты и большие городские парки. Чередуй известные виды с прогулками по соседним кварталам.',
    'Manhattan streets, bridges and great urban parks. Mix famous views with walks through surrounding neighbourhoods.',
    'Расстояния между районами большие: объединяй близкие места в один день. Схемы и изменения движения проверяй на сайте MTA.',
    'Distances between neighbourhoods are large: group nearby sights into one day. Check maps and service changes on the MTA website.',
    [['To go, please.', 'С собой, пожалуйста — при заказе еды или кофе.', 'A request to take food or coffee away.'], ['Which way is the subway?', 'В какой стороне метро?', 'A way to ask for directions to the subway.']], [
      place('new-york-liberty', 'Статуя Свободы', 'Statue of Liberty', 'sights', 'Liberty Island', 'Знаменитая статуя на острове в нью-йоркской гавани. Маршрут и доступные варианты посещения проверяй у официального оператора.', 'The famous island statue in New York Harbor. Check routes and visit options with the official operator.', 'https://www.nps.gov/stli/', 'Statue of Liberty New York'),
      place('new-york-central-park', 'Центральный парк', 'Central Park', 'walks', 'Manhattan', 'Аллеи, лужайки и водоёмы среди Манхэттена. Выбери часть парка и оставь время на остановки.', 'Paths, lawns and lakes in the heart of Manhattan. Pick an area of the park and leave time to pause.', 'https://www.centralparknyc.org/', 'Central Park New York Bethesda'),
      place('new-york-brooklyn-bridge', 'Бруклинский мост', 'Brooklyn Bridge', 'walks', 'East River', 'Пешеходная прогулка над Ист-Ривер с видом на Манхэттен. Продолжи маршрут по набережной со стороны Бруклина.', 'Walk above the East River with views of Manhattan. Continue along the waterfront on the Brooklyn side.', 'https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml', 'Brooklyn Bridge New York'),
      place('new-york-met', 'Метрополитен-музей', 'The Metropolitan Museum of Art', 'sights', 'Upper East Side', 'Большая коллекция искусства рядом с Центральным парком. Выбери интересные эпохи и не пытайся увидеть всё за один визит.', 'A major art collection beside Central Park. Choose the periods that interest you and avoid trying to see everything in one visit.', 'https://www.metmuseum.org/', 'Metropolitan Museum of Art New York exterior'),
      place('new-york-high-line', 'Хай-Лайн', 'High Line', 'walks', 'Chelsea', 'Парк на бывшей надземной железнодорожной линии. Прогуляйся среди растений и посмотри на улицы с необычного ракурса.', 'A park on a former elevated railway. Walk among the plants and see the streets from a different perspective.', 'https://www.thehighline.org/', 'High Line New York park'),
    ]),
];
for (const added of additions) if (!guide.cities.some(item => item.id === added.id)) guide.cities.push(added);
const oldQueries = {
  'moscow-basil': 'Saint Basil Cathedral Moscow', 'moscow-patriarch': 'Patriarshiye Ponds Moscow',
  'moscow-ges': 'GES-2 Moscow', 'moscow-neskuchny': 'Neskuchny Garden Moscow',
  'moscow-food': 'Danilovsky market Moscow', 'moscow-metro': 'Moscow metro Komsomolskaya',
  'tokyo-senso': 'Sensoji Tokyo temple', 'tokyo-shibuya': 'Shibuya Crossing Tokyo',
  'tokyo-ueno': 'Ueno Park Tokyo', 'tokyo-yanaka': 'Yanaka Ginza Tokyo',
  'tokyo-info': 'Asakusa Culture Tourist Information Center', 'paris-eiffel': 'Eiffel Tower Paris',
  'paris-louvre': 'Louvre Paris pyramid', 'paris-montmartre': 'Montmartre Paris Sacre Coeur',
  'paris-market': 'Marche des Enfants Rouges Paris', 'paris-transport': 'Paris metro Cite station',
};
const strip = value => (value ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
async function request(url) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'ViblyGuide/1.0 (educational city guide)' }, signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (attempt === 5) throw error;
      console.warn(`Retry ${attempt + 1}: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 12000 * (attempt + 1)));
    }
  }
}
let manifest;
try { manifest = JSON.parse(await fs.readFile('docs/photo-selection.json', 'utf8')); }
catch { manifest = []; }
async function illustrate(place) {
  if (place.images?.length >= 2) return;
  const overrides = { 'barcelona-gothic': 'intitle:"Gothic Quarter" Barcelona -art', 'dubai-future': 'Museum of the Future Dubai' };
  const query = overrides[place.id] ?? place.query ?? oldQueries[place.id];
  if (!query) throw Error(`Missing image query for ${place.id}`);
  const curated = place.id === 'barcelona-gothic' ? [
    'File:Gothic Quarter, Barcelona - panoramio.jpg',
    'File:Gothic Quarter, Barcelona (3) (31215331786).jpg',
    'File:Gothic Quarter, Barcelona (15) (30442722553).jpg',
  ] : null;
  const params = new URLSearchParams({ action: 'query', prop: 'imageinfo', iiprop: 'url|extmetadata|size', iiurlwidth: '960', format: 'json',
    ...(curated ? { titles: curated.join('|') } : { generator: 'search', gsrsearch: `${query} filetype:bitmap`, gsrnamespace: '6', gsrlimit: '12' }),
  });
  let data;
  const cache = `.cache/guide-photos/${place.id}.json`;
  try { data = JSON.parse(await fs.readFile(cache, 'utf8')); }
  catch {
    await new Promise(resolve => setTimeout(resolve, 2500));
    data = await (await request(`https://commons.wikimedia.org/w/api.php?${params}`)).json();
    await fs.writeFile(cache, JSON.stringify(data));
  }
  const candidates = Object.values(data.query?.pages ?? {}).sort((a, b) => a.index - b.index)
    .filter(page => /\.(jpe?g|png)$/i.test(page.title) && page.imageinfo?.[0]?.width >= 600 &&
      /CC BY|CC0|Public domain/i.test(page.imageinfo[0].extmetadata?.LicenseShortName?.value ?? ''));
  const images = place.image ? [place.image] : [];
  manifest = manifest.filter(item => item.place !== place.id);
  for (const candidate of candidates) {
    const info = candidate.imageinfo[0];
    // Do not add the original Commons photograph a second time under another filename.
    if (Object.values(guide.photoCredits).some(c => images.includes(c.image) && c.source === info.descriptionurl)) continue;
    const number = images.length + 1;
    const file = `${place.id}-${number}.${/\.png$/i.test(candidate.title) ? 'png' : 'jpg'}`;
    const image = `/images/${file}`;
    try {
      try { await fs.access(`public${image}`); }
      catch {
        const response = await request(info.thumburl ?? info.url);
        if (!response.headers.get('content-type')?.startsWith('image/')) throw Error('Not an image');
        await fs.writeFile(`public${image}`, Buffer.from(await response.arrayBuffer()));
      }
      const meta = info.extmetadata;
      guide.photoCredits[`${place.id}-${number}`] = { image, author: strip(meta.Artist?.value) || 'Wikimedia Commons',
        license: strip(meta.LicenseShortName?.value), licenseUrl: meta.LicenseUrl?.value || 'https://commons.wikimedia.org/wiki/Commons:Licensing', source: info.descriptionurl };
      images.push(image);
      manifest.push({ place: place.id, file: candidate.title, image });
      if (images.length === 3) break;
    } catch (error) { console.warn(`Skipping ${candidate.title}: ${error.message}`); }
  }
  if (images.length < 2) throw Error(`Only ${images.length} photos found for ${place.id}`);
  place.image = images[0];
  place.images = images;
  delete place.query;
  console.log(`${place.id}: ${images.length} photos`);
}
const queue = guide.cities.flatMap(c => c.places);
// Limit concurrent Commons requests.
await Promise.all(Array.from({ length: 1 }, async () => {
  while (queue.length) await illustrate(queue.shift());
}));
for (const item of guide.cities) if (!item.image) item.image = item.places[0].image;
Object.assign(en, {
  'Фотографии места': 'Place photos', 'Предыдущее фото': 'Previous photo', 'Следующее фото': 'Next photo',
  'Показать фото': 'Show photo', 'Фотография недоступна': 'Photo unavailable',
});
await fs.writeFile('docs/guide.json', JSON.stringify(guide, null, 2) + '\n');
await fs.writeFile('docs/guide-response.json', JSON.stringify([guide], null, 2) + '\n');
await fs.writeFile('docs/photo-selection.json', JSON.stringify(manifest, null, 2) + '\n');
await fs.writeFile('src/i18n/en.json', JSON.stringify(en, null, 2) + '\n');
console.log(`Saved ${guide.cities.length} cities, ${guide.cities.reduce((n, c) => n + c.places.length, 0)} places`);
