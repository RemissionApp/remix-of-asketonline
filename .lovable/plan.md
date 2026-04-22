

## Полный аудит приложения и план доработки до публикации

### Критические блокеры (фиксить НЕМЕДЛЕННО)

**Блокер #1 — Белый экран на `/main` из-за разделения React-чанков**
В консоли: `TypeError: Cannot read properties of null (reading 'useSyncExternalStore')` в `NotificationProvider`. Причина — `manualChunks` в `vite.config.ts` всё ещё разделяет vendor-чанки, и `zustand` подгружается раньше React, получая `null` вместо React-инстанса. Сборка работала локально, но в превью лежит старый кэш + у zustand нет явной зависимости в react-vendor группе.

**Фикс:** убрать `manualChunks` целиком, отдать разбиение на откуп Vite/Rollup. Размер бандла можно потом сократить через `React.lazy` (без ручных вендор-чанков).

**Блокер #2 — `ProtectedRoute` редиректит на `/main` со ВСЕХ защищённых страниц**
Логика `if (targetRoute !== location.pathname) <Navigate to={targetRoute}/>` означает: для готового пользователя `targetRoute === '/main'` всегда, поэтому `/pacts`, `/universe`, `/profile`, `/meditation`, `/numerology`, `/affirmations` и т.д. — недоступны.

**Фикс:** редирект на `targetRoute` срабатывает только при `status === 'needs_profile'` или `'needs_onboarding'`. При `status === 'ready'` рендерим children без редиректа.

---

### Системный аудит по областям

#### A. Аутентификация и роутинг

| Что | Статус | Действие |
|---|---|---|
| Welcome → Language → Login | OK | оставить |
| Signup + OTP email verify | OK | проверить лимит resend, блок при невалидном коде |
| `useAuthFlow` / `AuthBootstrap` | OK | оставить |
| `ProtectedRoute` | СЛОМАН | переписать (см. Блокер #2) |
| `PublicRoute` | проверить — не должен блокировать `/login` после logout | аудит |
| `/auth/callback` (OAuth) | проверить наличие Google провайдера | если включаем Google — добавить |
| Forgot password / `/reset-password` | проверить наличие страницы | если нет — создать |
| Logout flow | проверить очистку Zustand + redirect на `/` | аудит |

#### B. Онбординг и профиль

| Что | Статус | Действие |
|---|---|---|
| Триггер `on_auth_user_created` | НЕТ в БД (`db-triggers` пустой) | повторно применить миграцию + проверить |
| `UserProfileForm` (имя, дата) | UTC-фикс применён | проверить, что birthDate сохраняется без сдвига |
| Calendar (год слайдер) | пофикшен | визуальная проверка fromYear/toYear |
| Avatar upload | пофикшен | проверить cache-busting и RLS на bucket |
| `profile_step_completed` флаг | проверить, что не сбрасывается при F5 | аудит |
| `user_onboarding_state` (3 шага) | проверить, что `onboarding_step_completed` ставится в true только после tour | аудит OnboardingPage |
| Smart-redirect после регистрации | OK через `useAuthFlow` | проверить e2e |

#### C. Главная и навигация

- `MainPage` — daily horoscope + advice + active pact + quick actions. Проверить, что блоки не падают при отсутствии данных (новый юзер без активного пакта).
- `BottomNavigation` — 5 табов (Аскеза/Вселенная/Главная/Медитация/Профиль). После фикса `ProtectedRoute` должно работать.
- `TopBar` — ранг, очки энергии, аватар. Проверить корректность отображения для нового юзера (rank=`seeker`, energy=0).

#### D. Платная/бесплатная модель (PRO)

Сейчас в коде используется `RevenueCat` (`SubscriptionManager.tsx`, `useRevenueCatStore`), плюс таблица `subscriptions` с `is_pro`. Это **iOS/Android-only** интеграция и она не работает в web preview.

**Что есть:**
- `subscriptions.is_pro` — флаг в БД
- `ProFeatureOverlay`, `ProBadge`, `PaywallButton`, `UpgradePrompt` — UI заглушки
- `LimitIndicator` + `daily_limits` table — лимиты для бесплатных юзеров
- PRO-страницы: `MeditationProPage`, `UniverseChatPage` (в `UniverseChatProWrapper`), `FullHoroscopePage`, `NumerologyPage`, `AffirmationsPage`

**Проблемы:**
- В web нет работающего платежа — кнопка «Subscribe» в `SubscriptionManager` бросает ошибку в браузере.
- Нет реального backend webhook'а для синхронизации `is_pro`.
- Лимиты для бесплатного тарифа разбросаны и нигде не enforced на server-side (можно обойти через прямые запросы).

**Рекомендации:**
1. **Для web-версии** включить **встроенные платежи Lovable (Stripe или Paddle)** через `recommend_payment_provider`. Создать продукты:
   - PRO Monthly (~$9.99/мес)
   - PRO Yearly (~$79.99/год — экономия 33%)
2. **На server-side** добавить edge function `check-subscription` и проверять `is_pro` перед каждым PRO-запросом (генерация horoscope/numerology/AI-чат), а не только в UI.
3. **RevenueCat оставить только для нативных приложений** (Capacitor iOS/Android) — детектить платформу и показывать нужный paywall.
4. Synchroнизировать webhook RevenueCat → Stripe → таблица `subscriptions` через edge function `sync-subscription`.

#### E. Страницы данных и сохранения

| Страница | Что проверить |
|---|---|
| `ProfilePage` | редактирование имени/даты/места рождения сохраняется в `profiles` + `astro_profiles` |
| `AccountSettingsPage` | смена email/пароля, уведомления, язык, звук |
| `DeleteAccountPage` | вызов `batch_delete_user_data` + `auth.admin.deleteUser` через edge function |
| `LanguagePage` | сохранение в localStorage + Zustand, не требует auth |
| `PrivacyPolicyPage` / `TermsOfServicePage` | публичные, статичный контент — проверить наличие |

#### F. Edge functions и AI

| Функция | Статус | Замечания |
|---|---|---|
| `text-to-speech` | пофикшен (graceful 503 при ElevenLabs 401) | OK |
| `generate-horoscope`, `fetch-horoscope` | работает (логи показывают cache hit) | OK |
| `universe-answer`, `universe-dialogue` | проверить лимиты для free-юзеров |
| `generate-numerology` | проверить наличие |
| `generate-daily-advice` | проверить кэширование на день |
| `delete-user-account` | должна быть, чтобы удалять auth.user через service role | проверить наличие |
| `send-otp-email` | работает через RESEND | проверить rate-limit |

#### G. Push-уведомления (PWA)

- `push_subscriptions` table — есть RLS, OK.
- `PWAInstallPrompt` + `PWAUpdateNotification` — есть в App.tsx.
- Service Worker регистрируется (виден в логах).
- **Нет** edge function для отправки push (например, `send-push-notification`).

**Рекомендация:** добавить edge function для server-side push через Web Push API (VAPID keys в secrets).

#### H. Миссии, артефакты, ачивки, рефлексии

Большой пласт таблиц: `missions`, `mission_progress`, `mission_progress_detailed`, `mission_choices`, `cosmic_artifacts`, `achievements`, `daily_reflections`. Нужен функциональный smoke-test:
1. Принять миссию → завершить день → получить артефакт → разблокировать ачивку.
2. Проверить, что reward правильно начисляет energy_points в `profiles`.

#### I. Безопасность и линтер

Запустить `supabase--linter` и закрыть все warnings (особенно про search_path и RLS). Проверить, что:
- Все `SECURITY DEFINER` функции имеют `SET search_path = public`.
- Нет таблиц без RLS.
- Bucket `avatars` имеет ровно 4 политики (после миграции 20260422200107 — должно быть OK).

#### J. Оптимизация бандла (после фикса Блокера #1)

Вместо `manualChunks` использовать `React.lazy` для тяжёлых страниц:
- `MeditationProPage`, `NumerologyPage`, `FullHoroscopePage`, `AffirmationsPage`, `CosmicMissionsPage`, `ArtifactCollectionPage`, `UniverseChatPage`, `CallPage`, `AchievementsPage`.
- В `App.tsx` обернуть `<Routes>` в `<Suspense fallback={<LoadingScreen/>}>`.

---

### Поэтапный план выполнения

**Этап 1 — Разблокировать приложение (P0, делать первым)**
1. Удалить `manualChunks` из `vite.config.ts` (вернуться к авто-разбиению).
2. Переписать `ProtectedRoute`: редирект только при `needs_profile`/`needs_onboarding`, иначе рендерить children.
3. Применить миграцию для триггера `on_auth_user_created` (если опять не доехал) + бэкфилл `profiles`.
4. **Проверка:** регистрация → профиль → онбординг → /main → клик по всем 5 нижним табам — всё открывается.

**Этап 2 — Очистка профиля и онбординга (P1)**
5. Аудит `ProfilePage`, `AccountSettingsPage`, `DeleteAccountPage` — каждое поле сохраняется и перезагружается корректно.
6. Проверка `OnboardingPage` (3 шага) — что `onboarding_step_completed=true` ставится только в конце.
7. Создать страницу `/reset-password` если её нет.
8. Добавить Google OAuth (если бизнес требует).

**Этап 3 — Платная модель (P1)**
9. Запустить `payments--recommend_payment_provider` → подключить Stripe/Paddle.
10. Создать продукты PRO Monthly + PRO Yearly.
11. Edge function `check-subscription` + middleware на всех PRO edge functions.
12. RevenueCat оставить только для Capacitor iOS/Android (detect platform).

**Этап 4 — Edge functions и push (P2)**
13. Аудит всех edge functions: добавить rate-limit, проверить CORS, валидацию через Zod.
14. Создать `send-push-notification` для server-side push.
15. Создать `delete-user-account` если её нет.

**Этап 5 — Производительность и UX (P2)**
16. `React.lazy` + `Suspense` для тяжёлых страниц.
17. Запустить `supabase--linter`, закрыть warnings.
18. Проверить мобильный viewport (390x740) на каждой странице.
19. Глобальный `LoadingScreen` для `status === 'initializing'`.

**Этап 6 — Финальная QA перед публикацией (P0 после остальных)**
20. E2E руками: регистрация → онбординг → создание пакта → отметить день → задать вопрос Вселенной → послушать медитацию (graceful если TTS 503) → посмотреть гороскоп → редактировать профиль → loaded аватар → logout → login → попытка купить PRO → активация PRO-фичи.
21. F5 на каждой странице — данные на месте.
22. `tsc --noEmit` 0 ошибок, `vite build` успех.
23. Проверка консоли: 0 React-ошибок, 0 необработанных 500.

### Что НЕ трогаем
- Cosmic дизайн-токены и тему
- Промпты Lovable AI и ElevenLabs Agent IDs
- `useAuthFlow` (только что стабилизирован)
- Структуру таблиц БД (только добавляем триггеры/функции)

### Файлы под изменение (только Этап 1)
- `vite.config.ts` — убрать manualChunks
- `src/components/auth/ProtectedRoute.tsx` — переписать логику редиректа
- Новая миграция: повторное применение триггера `on_auth_user_created`

### Ожидаемый результат
После Этапа 1 — приложение перестаёт падать, навигация по всем защищённым страницам работает. После всех этапов — стабильное, безопасное, монетизированное приложение, готовое к публикации в web и сторах.

