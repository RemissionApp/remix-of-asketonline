
// Sample responses for universe questions
const universeResponses = [
  "В глубине своего сознания вы уже знаете ответ на этот вопрос.",
  "Путь к ответу лежит через самопознание и принятие истины внутри себя.",
  "Вселенная слышит ваше намерение. Доверьтесь ее мудрости.",
  "То, что вы ищете, само найдет вас, когда придет время.",
  "Иногда самый мудрый ответ — это новый вопрос к самому себе.",
  "Ответ придет к вам через неожиданный источник. Будьте внимательны к знакам.",
  "Вселенная уже направляет вас к ответу. Следуйте за интуицией.",
  "Ваши мысли формируют реальность. Выбирайте их с мудростью.",
  "Всё происходит именно так, как должно происходить. Доверьтесь процессу.",
  "Истинная мудрость приходит через внутреннюю тишину и медитацию."
];

// Get a response to a universe question
export const getUniverseResponse = async (question: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For now, just return a random response
  return universeResponses[Math.floor(Math.random() * universeResponses.length)];
};
