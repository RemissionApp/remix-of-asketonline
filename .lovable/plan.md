## 1. Экран Вселенная (UniverseHubPage) — заполнить пустоту

Под двумя карточками «Позвонить» / «Задать вопрос» добавить два секционных блока в едином cosmic-glass стиле:

**Блок «Последние разговоры»** (`Recent calls`)
- Тянем из таблицы `call_summaries` (last 5, order by `called_at desc`).
- Карточка списка: аватар-иконка `Phone`, заголовок (короткая суммаризация / первые 60 символов `summary`), длительность из `duration_seconds`, относительное время («сегодня», «вчера», «3 дня назад» — i18n).
- Tap → открывает раскрывающую карточку с полным `summary` и `key_topics` чипами.
- Empty state: иллюстрация (Phone в круге) + «Твой первый разговор с Вселенной изменит многое» (ru/en/es).

**Блок «Последние вопросы»** (`Recent questions`)
- Уже есть `PreviousQuestions` на `/universe`, но в hub его нет. Тянем `universe_questions` (last 5).
- Карточка: иконка `MessageCircleQuestion`, текст вопроса (truncate 2 lines), дата.
- Tap → expand, показать `answer`.
- Empty state: «Задай свой первый вопрос — Вселенная всегда отвечает».

Стиль карточек идентичен `UniverseMessageBlock` / `PactsPage` (rounded-3xl, border white/10, gradient cosmic-accent/15 → cosmic-dark/60 → cosmic-gold/10, backdrop-blur-md).

Новые файлы:
- `src/components/universe/RecentCallsBlock.tsx`
- `src/components/universe/RecentQuestionsBlock.tsx`

Изменения:
- `src/pages/UniverseHubPage.tsx` — добавить секции после двух CTA.

## 2. Главная — уменьшить вертикальные отступы

`src/components/MainPageComponents/UserGreetingSection.tsx`
- Убрать лишние `pt-3 sm:pt-6` и `mb-3 sm:mb-6` → `pt-1 mb-1 sm:pt-2 sm:mb-2`.
- Уменьшить `mt-1 sm:mt-2` у `<h2>` до `mt-0.5`.

`src/components/MainPageComponents/MainContent.tsx`
- `pt-16 sm:pt-20` → `pt-10 sm:pt-12`, `gap-3 sm:gap-4` → `gap-2 sm:gap-3`.

`src/components/AdaptivePactDisplay.tsx`
- `gap-3` → `gap-1.5`, между title и кругом убрать лишний `mb-1`.

## 3. Снять ограничение на создание аскез

Триал теперь даёт полный доступ 3 дня — лимита на количество аскез нет.

`src/pages/CreatePactPage.tsx`
- Убрать импорт `useDailyLimits`, `UpgradePrompt`.
- Удалить переменную `canCreatePact` и весь блок `!canCreatePact ? <UpgradePrompt …/> : renderStep()`.
- Всегда рендерить `renderStep()` и кнопку «Next».

`src/hooks/useDailyLimits.ts`
- Поле `pacts` оставляем в типе для обратной совместимости, но больше нигде не используется. (Серверная функция `check-daily-limits` остаётся as-is.)

## 4. Профиль — план редактирования и аудит кнопок

Цель: каждая строка профиля редактируема, все кнопки рабочие.

### 4.1 Универсальный inline-edit
Новый компонент `src/components/profile/ui/EditableRow.tsx`:
- расширяет `ProfileRow`, при tap открывает `Dialog` с полем (text / date / textarea / select).
- prop `onSave(value) => Promise<void>` — обновляет через `updateUserProfile` в zustand-сторе и Supabase `profiles`.
- Валидация через zod (имя 1–60, дата 1900–today, цель ≤ 200).

### 4.2 ProfileIdentityTab
Сделать редактируемыми:
- **Имя** → inline (`name`).
- **Дата рождения** → date picker (`birth_date`).
- **Цель** → textarea (`goal`).
- Аватар уже работает.

### 4.3 ProfileSpiritualTab
Карты Астро/Нумерология вычисляются из `birthDate` и `name` — изменяются автоматически. Добавить кнопку «Открыть подробный гороскоп» → `/detailed-horoscope`, «Матрица судьбы» → `/numerology`.

### 4.4 ProfileNotificationsTab
- Каждый toggle сохраняет в `profiles.notification_settings` (jsonb merge) через `updateUserProfile`. Привязать `PushNotificationManager` к разделу.

### 4.5 ProfilePrivacyTab
- Toggles → `profiles.privacy_settings` jsonb merge.
- Кнопка «Политика конфиденциальности» → `/privacy-policy`, «Пользовательское соглашение» → `/terms-of-service`.

### 4.6 ProfileSubscriptionTab
- Кнопка «Оформить подписку» → существующий flow сравнения / `/comparison`.
- Показ статуса триала (`trial_ends_at`).

### 4.7 ProfileAccountTab
Уже работает (logout, export, delete, language). Добавить:
- «Сменить email» → диалог с `supabase.auth.updateUser({ email })` + toast.
- «Сменить пароль» → диалог (для email-провайдера) с `supabase.auth.updateUser({ password })`.

### 4.8 Аудит существующих кнопок
Пройти по всем `ProfileRow` во всех табах, убедиться что у каждой есть `onPress` или `to`. Те, что сейчас декоративные (без обработчика), либо подключаем, либо удаляем.

## Файлы

**Создать**
- `src/components/universe/RecentCallsBlock.tsx`
- `src/components/universe/RecentQuestionsBlock.tsx`
- `src/components/profile/ui/EditableRow.tsx`
- `src/components/profile/dialogs/EditFieldDialog.tsx`
- `src/components/profile/dialogs/ChangeEmailDialog.tsx`
- `src/components/profile/dialogs/ChangePasswordDialog.tsx`

**Изменить**
- `src/pages/UniverseHubPage.tsx`
- `src/components/MainPageComponents/UserGreetingSection.tsx`
- `src/components/MainPageComponents/MainContent.tsx`
- `src/components/AdaptivePactDisplay.tsx`
- `src/pages/CreatePactPage.tsx`
- `src/components/profile/ProfileIdentityTab.tsx`
- `src/components/profile/ProfileNotificationsTab.tsx`
- `src/components/profile/ProfilePrivacyTab.tsx`
- `src/components/profile/ProfileSubscriptionTab.tsx`
- `src/components/profile/ProfileAccountTab.tsx`

Подтверди — реализую.