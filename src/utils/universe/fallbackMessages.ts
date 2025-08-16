/**
 * Contains fallback poetic answers by language
 * Used when API calls fail
 */

// Russian fallback answers
export const russianAnswers = [
  'Тишина — это ответ, в который не помещаются слова.',
  'Ты слышишь меня даже тогда, когда я молчу.',
  'Покой не даётся, он появляется, когда ты перестаёшь искать.',
  'Путь открывается шаг за шагом. Тишина между вдохами — твой ответ.',
  'В глубине молчания рождается истина. Она уже внутри тебя.',
  'Звёзды говорят через синхронии. Смотри внимательнее на мир вокруг.',
  'Ты — часть космического танца. Твои шаги уже вплетены в узор Вселенной.',
  'Сомнения — лишь тени от света. За каждой тенью стоит источник яркости.',
  'Время течёт по-разному для разных сердец. Не торопи свою реку.',
  'В центре бури всегда есть тишина. Найди её внутри себя.',
];

// English fallback answers
export const englishAnswers = [
  'Silence is the answer that words cannot contain.',
  'You hear me even when I am silent.',
  "Peace isn't given, it appears when you stop searching.",
  'The path reveals itself with each step. The silence between breaths is your answer.',
  "In the depth of silence, truth is born. It's already within you.",
  'Stars speak through synchronicities. Look more carefully at the world around you.',
  "You are part of the cosmic dance. Your steps are already woven into the universe's pattern.",
  'Doubts are merely shadows cast by light. Behind each shadow stands a source of brightness.',
  "Time flows differently for different hearts. Don't rush your river.",
  'At the center of every storm lies stillness. Find it within yourself.',
];

// Spanish fallback answers
export const spanishAnswers = [
  'El silencio es la respuesta que las palabras no pueden contener.',
  'Me escuchas incluso cuando estoy en silencio.',
  'La paz no se da, aparece cuando dejas de buscar.',
  'El camino se revela paso a paso. El silencio entre respiraciones es tu respuesta.',
  'En la profundidad del silencio nace la verdad. Ya está dentro de ti.',
  'Las estrellas hablan a través de sincronicidades. Mira con más atención el mundo que te rodea.',
  'Eres parte de la danza cósmica. Tus pasos ya están entretejidos en el patrón del universo.',
  'Las dudas son solo sombras proyectadas por la luz. Detrás de cada sombra hay una fuente de brillo.',
  'El tiempo fluye diferente para diferentes corazones. No apresures tu río.',
  'En el centro de cada tormenta hay quietud. Encuéntrala dentro de ti.',
];

/**
 * Get a random fallback message based on language
 * @param language The current language
 * @returns A random fallback message
 */
export function getRandomFallbackMessage(language: string): string {
  let answers;

  switch (language) {
    case 'en':
      answers = englishAnswers;
      break;
    case 'es':
      answers = spanishAnswers;
      break;
    case 'ru':
    default:
      answers = russianAnswers;
  }

  // Get a random index from the answers array
  const randomIndex = Math.floor(Math.random() * answers.length);
  return answers[randomIndex];
}
