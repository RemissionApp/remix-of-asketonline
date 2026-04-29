## Universe Call — Redesign («Живая Вселенная-собеседник»)

Концепция: экран превращается в кинематографичную сцену общения с Вселенной. Большой аватар, эмоции через глаза/свечение, живые субтитры её речи как Apple Live Captions. Только одна кнопка — «положить трубку». Лимиты убираем (триал-only).

---

### 1. Layout (mobile-first, 390×618 baseline)

```text
┌─────────────────────────────┐
│  ←  Звонок Вселенной        │  ← компактный header
│                             │
│        ╭─────────╮          │
│       │  AVATAR  │          │  ~55% ширины экрана
│        ╰─────────╯          │  лёгкое дыхание (scale 1↔1.03)
│   • статус соединения •     │  «Соединение…» / «На связи · 00:42»
│                             │
│   ░░ wave visualization ░░  │  тонкая, только при isSpeaking
│                             │
│ ┌─────────────────────────┐ │
│ │ «Я здесь. Расскажи,    │ │  ← LIVE CAPTIONS
│ │  что тебя тревожит…»   │ │     fade-in по словам
│ └─────────────────────────┘ │
│                             │
│           ( 📞 )            │  одна красная кнопка hangup
│                             │
└─────────────────────────────┘
```

До звонка — то же самое, но вместо субтитров мягкая подсказка «Коснитесь, чтобы Вселенная услышала вас», а вместо красной кнопки — большая зелёная пульсирующая «Позвонить».

---

### 2. Аватар как живое существо

Состояния (управляются через `conversation.status` и `conversation.isSpeaking`):

| Состояние | Поведение |
|---|---|
| `disconnected` | Глаза закрыты, спокойное дыхание, тёплое золотистое свечение |
| `connecting` | Глаза приоткрываются, аура пульсирует быстрее, спиннер-кольцо |
| `connected` + слушает | Глаза открыты, мягкое зелёное мерцание, медленное дыхание |
| `connected` + `isSpeaking` | Зелёное свечение пульсирует в такт волне, аура расширяется кольцами |

Реализация: уже есть два изображения (`universe-avatar-call.jpg` закрытые / `universe-avatar-call-open.jpg` открытые). Добавить:
- слой `<div>` с `radial-gradient` зелёного свечения, `opacity` зависит от состояния
- 2–3 расходящихся `ring` через `@keyframes` (масштаб + fade) когда `isSpeaking`
- плавный кросс-фейд между closed/open eyes (250ms)

---

### 3. Live Captions (главная новая фича)

Новый компонент `src/components/voice/UniverseCaptions.tsx`:
- Слушает события `agent_response` и `user_transcript` через `onMessage` в `useElevenLabsConversation`
- Показывает **последнюю реплику Вселенной** крупным шрифтом по центру внизу
- Реплика пользователя — мелким серым текстом сверху от реплики Вселенной (опционально)
- Каждая новая фраза появляется через `animate-fade-in` (уже есть в tailwind config)
- Старые реплики плавно затухают через 8 секунд (или при появлении новой)
- Glass-карточка с тонкой зелёной рамкой когда Вселенная говорит

Хранение в хуке: добавить `lastAgentMessage`, `lastUserMessage` как `useState`, обновлять в `onMessage`.

Важно: чтобы события `user_transcript` и `agent_response` приходили — они должны быть включены в настройках агентов в ElevenLabs dashboard. Если выключены, субтитры просто не появятся, остальное работает.

---

### 4. Управление (упрощение)

Удаляем: кнопки mute, speaker, индикатор лимитов, UpgradePrompt, LimitIndicator с CallPage.

Оставляем:
- До звонка: одна большая зелёная кнопка `Phone` с pulse-анимацией
- Во время звонка: одна красная кнопка `PhoneOff` снизу по центру

Громкость по умолчанию 0.8, mute-функции вырезаем из `VoiceCallInterface`.

---

### 5. Состояния и переходы

- При нажатии «позвонить»: кнопка превращается в spinner-кольцо, аватар начинает «просыпаться» (глаза приоткрываются), статус — «Соединение со Вселенной…»
- При `onConnect`: лёгкая виброотдача, статус → «На связи · 00:00», запускается таймер, появляется красная кнопка
- При ошибке: тост + аватар возвращается в спящее состояние, кнопка снова зелёная
- При `onDisconnect`: плавный fade-out субтитров и волны, аватар закрывает глаза

---

### 6. Очистка лимитов (по запросу «у нас триал»)

- Из `CallPage.tsx` удалить `useDailyLimits`, `LimitIndicator`, `UpgradePrompt` и условие `limits.voice_calls.canUse`
- Из `VoiceCallInterface.tsx` убрать `updateUsage('voice_call')` (или оставить телеметрию без блокировки)

---

### 7. Файлы, которые меняем

- `src/components/voice/VoiceCallInterface.tsx` — убрать mute/speaker, добавить captions, упростить layout
- `src/components/voice/UniverseAvatar.tsx` — добавить кольца, слой свечения, плавные переходы глаз
- `src/components/voice/UniverseCaptions.tsx` — **новый** компонент субтитров
- `src/components/voice/CallStatus.tsx` — упростить до строки «На связи · MM:SS»
- `src/hooks/useElevenLabsConversation.ts` — экспортировать `lastAgentMessage`, `lastUserMessage`, расширить `onMessage` (`user_transcript`, `agent_response`, `agent_response_correction`)
- `src/pages/CallPage.tsx` — убрать лимиты и upgrade-блок

Edge function и токены WebRTC уже работают после прошлой миграции, ничего не трогаем.

---

### 8. Технические детали (для разработки)

```typescript
// useElevenLabsConversation.ts — расширение onMessage
onMessage: (message) => {
  switch (message.type) {
    case 'agent_response':
      setLastAgentMessage(message.agent_response_event.agent_response);
      break;
    case 'agent_response_correction':
      setLastAgentMessage(
        message.agent_response_correction_event.corrected_agent_response
      );
      break;
    case 'user_transcript':
      setLastUserMessage(
        message.user_transcription_event.user_transcript
      );
      break;
  }
}
```

```tsx
// UniverseCaptions.tsx — каркас
{lastAgentMessage && (
  <div className="animate-fade-in glass border border-green-400/30 rounded-2xl px-5 py-4 max-w-md">
    <p className="text-white text-base leading-relaxed">{lastAgentMessage}</p>
  </div>
)}
```

---

### Что нужно от тебя помимо кода

1. **В ElevenLabs dashboard** для каждого из трёх агентов (RU/EN/ES):
   - Включить события `user_transcript` и `agent_response` в Client Events
   - Убедиться, что WebRTC включён как transport
2. Больше ничего — `ELEVENLABS_API_KEY` уже в секретах, edge function развёрнута.

После одобрения переключаюсь в build-режим и применяю изменения.
