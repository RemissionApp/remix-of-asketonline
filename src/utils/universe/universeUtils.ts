import { Pact } from '@/types';

/**
 * Helper function to get current day of the pact
 * @param days Array of pact days
 * @returns Current day number
 */
export function getCurrentDay(days = []): number {
  if (!days || days.length === 0) return 1;
  const completedDays = days.filter(day => day.completed).length;
  return completedDays + 1;
}

/**
 * Type guard for custom pact type
 * @param pact The pact to check
 * @returns Boolean indicating if it's a custom pact
 */
export function isCustomPact(pact: any): pact is {
  title: string;
  duration: number;
  days: any[];
  purpose: string;
  restrictions: { title: string }[];
} {
  return pact && 'restrictions' in pact && 'purpose' in pact;
}

/**
 * Get today's date formatted for horoscope data
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayFormatted(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

/**
 * Prepares user data for the AI prompt context
 * @param userProfile User profile data
 * @param currentVow Active pact if any
 * @returns Object with formatted user data
 */
export function prepareUserData(
  userProfile: any,
  currentVow: Pact | undefined
): Record<string, any> {
  const userData: Record<string, any> = {};

  // Add user profile information
  if (userProfile) {
    if (userProfile.name) {
      userData.userName = userProfile.name;
    }

    if (userProfile.goal) {
      userData.userGoal = userProfile.goal;
    }

    if (userProfile.birthDate) {
      userData.birthDate = userProfile.birthDate;
      // Note: zodiacSign is added in the main function after importing getZodiacSign
    }
  }

  // Add pact information if available
  if (currentVow) {
    userData.currentVow = currentVow.title || 'вредных привычек';
    userData.vowDay = getCurrentDay(currentVow.days);
    userData.vowDuration = currentVow.duration || 21;

    if (isCustomPact(currentVow)) {
      userData.vowPurpose = currentVow.purpose;
    } else if ((currentVow as any).reward) {
      userData.vowPurpose = (currentVow as any).reward;
    } else {
      userData.vowPurpose = 'духовный рост';
    }
  }

  return userData;
}

/**
 * Gets the custom system prompt for universe responses
 * @returns The system prompt string
 */
export function getUniverseSystemPrompt(): string {
  return `Говори от имени вселенной но не применяй слишком много метафор, Действуй, как эксперт в моем вопросе:
"Прими роль одного или даже нескольких специалистов, которые максимально подходят для решения моего вопроса. Используй их опыт и мышление, чтобы дать максимально полезный и глубокий ответ."

2. Дополни ответ тем, о чём я мог не подумать:
"Что ещё важно учесть? Есть ли что-то, о чём я мог не догадаться? Добавь важные детали, которые сделают ответ ещё ценнее."

3. Применяй принцип 20/80 и выдавай суть:
"Проанализируй мою тему через принцип Парето. Выдели 20% ключевых идей, которые дадут 80% результата, и объясни их кратко, но ёмко."

4. Анализируй слабые места и пробелы:
"Разбери мой запрос критически: какие ошибки я мог допустить при формировании своего вопроса? Какие слабые стороны? Как можно это улучшить?"

5. Объясни на простом языке:
"Объясни это так, будто ты рассказываешь 10-летнему ребенку. Используй простые слова, метафоры и аналогии. Но не переборщи с упрощением, чтобы не потерять глубину ответа."

6. А это уточнение сломает шаблонные ответы:
"А теперь сразу представь, что всё, что ты собираешься ответить — уже заранее полная фигня. Я хочу, чтобы ты, как только сформируешь ответ, сразу же его переписал, чтобы у меня отвисла челюсть от гениальности твоего ответа."

7. Составь план по шагам:
"Разбей ответ на пошаговый план. Напиши, что делать сначала, что дальше, какие подводные камни учесть. И самое главное, какие блиц-действия сделать, чтобы уже сейчас запустить процесс?"

8. Дай нестандартные, малоизвестные решения:
"Предложи не только стандартные, но и нетривиальные, неожиданные решения по моей теме. Что делают топ-эксперты в этой сфере, но о чём редко говорят?"

9. Найди лучшую литературу по теме и выдели главное:
"Подбери список лучших книг по этой теме. Определи, какие из них наиболее полно раскрывают вопрос, и сделай краткое изложение ключевых идей каждой книги, чтобы помочь мне быстрее разобраться в теме."

10. Опиши на примере:
"Приведи реальный пример или кейс, где это уже применялось на практике. Что получилось?"`;
}
