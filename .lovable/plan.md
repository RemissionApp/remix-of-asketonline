# Translation audit & fix

## Goal

Every screen should display strings strictly in the active UI language (RU / EN / ES). No mixed-language UI. The "Universe Call" screen should use the agent's name **Lyra** in EN/ES and **Лира** in RU.

## Scope of issues found

A scan of `src/pages/` and `src/components/` revealed two classes of problems.

### 1. Hardcoded Russian strings (visible to EN/ES users)

These files contain literal Russian text that never gets translated:

- `src/pages/LoginPage.tsx` — toast titles/descriptions, "Введите 6-значный код", "Проверьте вашу почту", "← Назад к регистрации", "Продолжить с Google/Apple", "Регистрация...", "Выполняется вход...", "Повторите пароль", "Пароли не совпадают", etc. (~20 strings)
- `src/pages/OnboardingPage.tsx` — "Шаг 2 из 2", "Доступно сразу после регистрации", "Открывается по подписке Pro", `aria-label={`Шаг ${i + 1}`}`, error toast.
- `src/pages/WelcomePage.tsx` — "Загрузка..." fallback.
- `src/pages/AccountSettingsPage.tsx` — "Уведомления" header, "Функция удаления данных будет реализована" toast.
- `src/pages/UniversePage.tsx` — fallback answer "Вот тебе мой ответ…", placeholder description "Опиши свою ситуацию подробно…".
- `src/components/ProfilePage/LogoutButton.tsx` — Russian code comments are fine, but the fallback `'Выход'` is shown when translation missing — verify EN/ES translations exist.
- `src/components/ProfilePage/ProfileSection.tsx` & `SubscriptionManager.tsx` — fully hardcoded Russian. **Confirmed dead code** (not imported anywhere except each other). Delete.
- Misc smaller pages (`FullHoroscopePage`, `DetailedHoroscopePage`, `CosmicMissionsPage`, `CosmosPage`) — a few `language === 'ru' ? ... : 'English'` ternaries missing the `es` branch (Spanish falls through to English).

### 2. Call-screen naming (the user's main complaint)

The ElevenLabs agent's name is **Lyra**, but the call screen header still says "Universe Call" / "Звонок Вселенной" / "Llamada al Universo". The user wants the agent's name to appear:

- RU: `Звонок Лиры`
- EN: `Lyra's Call`
- ES: `Llamada de Lyra`

Affected files (title is duplicated in 3 places):
- `src/pages/CallPage.tsx` (`PageHeader` title)
- `src/components/voice/VoiceCallInterface.tsx` (`getTitle()`)
- `src/components/ProFeatures/UniverseChatPreview.tsx` (preview card title)
- `src/i18n/languages/{ru,en,es}.ts` — `voiceCall.callScreen` field

## Plan

### Step 1 — Rename the call screen everywhere

Update the three components above and the `voiceCall.callScreen` translation key to:
RU "Звонок Лиры", EN "Lyra's Call", ES "Llamada de Lyra".
Source the title from `t.voiceCall.callScreen` instead of inline ternaries so it's defined once.

### Step 2 — Profile pages: ensure 100 % localization

- The new `src/components/profile/*` tabs (Identity, Spiritual, Subscription, Notifications, Privacy, Account) already use inline RU/EN/ES dictionaries — verify each label has all three languages and that no English fallback leaks into RU/ES (spot-check confirms they do, but Account/Notifications tabs need a full pass).
- `ProfilePage.tsx` header: keep the inline ternary but extract to `t.userProfile.title` for consistency.
- Delete dead files `src/components/ProfilePage/ProfileSection.tsx` and `src/components/ProfilePage/SubscriptionManager.tsx` (not used by router).
- `LogoutButton.tsx`: ensure `t.userProfile.logout` exists in EN/ES (add if missing).
- `AccountSettingsPage.tsx`: replace "Уведомления" and the toast text with `t.*` keys; add EN/ES translations.

### Step 3 — Auth & onboarding pages

- `LoginPage.tsx`: route every hardcoded Russian string through `t.auth.*`. Add the missing keys to all three language files (`signingIn`, `signingUp`, `passwordsDontMatch`, `repeatPassword`, `continueWithGoogle`, `continueWithApple`, `enter6DigitCode`, `checkYourEmail`, `checkEmailDescription`, `backToSignUp`, `backToLogin`, plus toast titles).
- `OnboardingPage.tsx`: replace "Шаг X из Y", "Доступно сразу…", "Открывается по подписке Pro", aria-labels, and the error toast with translation keys.
- `WelcomePage.tsx`: localize "Загрузка...".

### Step 4 — Other pages with partial coverage

- `UniversePage.tsx`: localize fallback answer & description.
- `FullHoroscopePage.tsx`, `DetailedHoroscopePage.tsx`, `CosmicMissionsPage.tsx`, `CosmosPage.tsx`: complete the `es` branch in every `ru ? ... : 'English'` ternary.
- `LanguagePage.tsx`: localize "Выберите язык приложения" / "Продолжить" via `t.*`.

### Step 5 — Verification

- `rg -nP "[А-Яа-яЁё]" src/pages src/components` returns only legitimate hits inside `i18n/languages/ru.ts`, the inline RU branches of trilingual dictionaries, and code comments.
- Manually switch language to EN and ES in the running preview, walk through: Welcome → Login → Onboarding → Main → Profile (all 6 tabs) → Universe Call → Universe Hub → Numerology → Horoscope → Settings. No Cyrillic should appear, no English should leak into Spanish.
- Run lint on touched files.

## Technical notes

- All new keys go into `src/i18n/types/translationTypes.ts` first, then into all three language files in the same shape so TypeScript catches any missing translation.
- For trilingual inline dictionaries (existing pattern in `profile/*` and `PactsPage.tsx`), keep using the `tr(ru, en, es)` helper rather than expanding `translations.ts` — that's already the project convention for page-local strings.
- The agent name "Lyra" stays in Latin script in all languages except Russian, where it's transliterated as "Лира" (already used in `ProfileSubscriptionTab`).

## Out of scope

- Legal documents (Privacy Policy / Terms) — already split into `*-legal.ts` files per language.
- Backend strings (edge function responses) — only UI surfaces are addressed.
- Marketing copy on landing/published page.
