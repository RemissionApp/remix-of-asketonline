## 1. Профиль — правильная иконка стихии и локализация

**Файл:** `src/components/profile/ProfileSpiritualTab.tsx` (+ хелпер).

- Добавить маппинг стихии → иконка Lucide:
  - Fire → `Flame`, Earth → `Mountain`, Air → `Wind`, Water → `Droplet`.
  Сейчас для всех стихий жёстко используется `Flame` — заменить на динамический выбор.
- Добавить локализацию `element` и `ruler` (сейчас `zodiacData[sign].element/ruler` всегда английские: `Air`, `Venus` и т. п.).
  Создать `src/utils/zodiacTranslations.ts` (или дополнить существующий) карты:
  - Стихии: `Fire/Earth/Air/Water` → ru `Огонь/Земля/Воздух/Вода`, es `Fuego/Tierra/Aire/Agua`.
  - Планеты: `Mars/Venus/Mercury/Moon/Sun/Pluto/Jupiter/Saturn/Uranus/Neptune` → ru `Марс/Венера/Меркурий/Луна/Солнце/Плутон/Юпитер/Сатурн/Уран/Нептун`, es аналогично. Поддержать составные значения `"Pluto, Mars"` через split/translate/join.
- Иконка управителя: Sun → `Sun`, Moon → `Moon`, остальные → `Globe2` (как сейчас).

## 2. Десктопный главный экран — новые блоки

**Файл:** `src/pages/MainPage.tsx` + новый `src/components/desktop/DesktopMainExtras.tsx`.

На десктопе (`useIsDesktop()`) рендерим компоновку в две колонки внутри уже существующего `DesktopShell`:

```text
+----------------------------------------+----------------------+
| Существующий MainContent (как есть)    | Astrology card       |
|  (приветствие, аскезы, CallHero, ...)  | Numerology card      |
|                                        | Daily horoscope card |
+----------------------------------------+----------------------+
```

Реализация:
- В `MainPage.tsx` обернуть текущий `<MainContent .../>` в grid `lg:grid-cols-[minmax(0,1fr)_360px] gap-6`. Правая колонка — `<DesktopMainExtras />`, видна только на `lg:` (`hidden lg:flex flex-col gap-4`).
- Мобильную верстку не трогаем (правая колонка скрыта).

`DesktopMainExtras.tsx` содержит три «стеклянных» блока в едином стиле с профилем (`bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-5`):

1. **Astrology** — знак (символ + имя), стихия (с правильной иконкой), управитель. Источник данных: `userProfile.birthDate` + `zodiacData` + новые переводы (п.1).
2. **Numerology** — Число жизни, Число судьбы, Личность, Год. Логика взята из `ProfileSpiritualTab` (`calculateLifePathNumber`, `calculateDestinyMatrix`, `calculatePersonalityNumber`). Компактная сетка 2×2 с крупными цифрами и подписями.
3. **Daily horoscope** — автоматически подгружается через `useBriefHoroscope()` (он сам кеширует на день в `localStorage`). Заголовок «Гороскоп на сегодня / Today's horoscope / Horóscopo de hoy», под ним `displayedText` с курсором (или статичный текст, если уже не печатается). Skeleton, пока `loading`.

Если у пользователя не задана дата рождения — Astrology/Numerology показывают мягкий CTA «Укажите дату рождения» с переходом в `/profile`. Daily horoscope в этом случае возвращает дефолтное сообщение из `useBriefHoroscope` (поведение уже есть).

## 3. Стиль и локализация

- Все цвета/радиусы — через существующий glass-стиль (никаких новых токенов).
- Тексты — через `useTranslations()`/локальный inline-словарь как в `ProfileSpiritualTab` (ru/en/es). Никаких смешанных языков (русский интерфейс ⇒ русские стихии/планеты, английский ⇒ английские).

## Файлы

- new: `src/utils/zodiacTranslations.ts` (карты стихий/планет ru/en/es + helper `translateRuler`).
- edit: `src/components/profile/ProfileSpiritualTab.tsx` — динамическая иконка стихии, перевод значений.
- new: `src/components/desktop/DesktopMainExtras.tsx` — три desktop-блока.
- edit: `src/pages/MainPage.tsx` — двухколоночный layout на `lg:`.

Мобильная версия и любые другие страницы — без изменений.
