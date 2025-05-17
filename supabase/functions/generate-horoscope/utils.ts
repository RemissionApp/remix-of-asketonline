// Парсер для извлечения секций из текста гороскопа

// Обновленная функция для извлечения секций с улучшенной обработкой ошибок и дополнительными логами
export function extractSections(horoscopeText: string, sectionName: string): string {
  console.log(`Extracting section "${sectionName}" from text...`);
  
  // Определение различных паттернов заголовков для разных секций
  const sectionHeaders: { [key: string]: string[] } = {
    'general_atmosphere': [
      'Общая атмосфера дня', 'Общая атмосфера', 'Общее', 'General Day Atmosphere', 'General Atmosphere'
    ],
    'work_finance': [
      'Советы по работе и финансам', 'Работа и финансы', 'Work & Finance', 'Work and Finance', 'Career', 'Карьера'
    ],
    'love_relationships': [
      'Рекомендации по отношениям и любви', 'Любовь и отношения', 'Отношения', 'Love & Relationships', 'Relationships', 'Love'
    ],
    'health_wellbeing': [
      'Состояние здоровья и эмоционального баланса', 'Здоровье', 'Health', 'Wellbeing', 'Health & Wellbeing', 'Здоровье и благополучие'
    ],
    'daily_advice': [
      'Практичный совет дня', 'Совет дня', 'Advice', 'Daily Advice', 'Практический совет'
    ]
  };
  
  // Получаем возможные заголовки для данной секции
  const possibleHeaders = sectionHeaders[sectionName] || [];
  
  // Логируем все возможные заголовки для секции
  console.log(`Looking for section "${sectionName}" with headers:`, possibleHeaders);
  
  let sectionText = "";
  
  // Пробуем найти секцию по любому из возможных заголовков
  for (const header of possibleHeaders) {
    console.log(`Searching for header: "${header}"`);
    
    // Пытаемся найти секцию с названием и заканчивающуюся пустой строкой
    // Регулярное выражение для заголовка (с двоеточием или без)
    const headerPatternWithColon = new RegExp(`${header}:\\s*([\\s\\S]*?)(?:\\n\\s*\\n|$)`, 'i');
    const headerPatternNoColon = new RegExp(`${header}\\s*([\\s\\S]*?)(?:\\n\\s*\\n|$)`, 'i');
    const numberPatternWithDot = new RegExp(`\\d\\.\\s*${header}[:\\s]*([\\s\\S]*?)(?:\\n\\s*\\n|\\d\\.\\s*|$)`, 'i');
    
    let match = horoscopeText.match(headerPatternWithColon);
    if (!match) {
      match = horoscopeText.match(headerPatternNoColon);
    }
    if (!match) {
      match = horoscopeText.match(numberPatternWithDot);
    }
    
    if (match && match[1]) {
      console.log(`Found match for "${header}"!`);
      
      // Очищаем найденный текст от лишних пробелов и переносов строк
      sectionText = match[1].trim();
      
      // Нормализуем переносы строк и удаляем маркеры списков
      sectionText = sectionText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/^\s*[-*•]\s*/gm, '')
        .replace(/^\s*\d+\.\s*/gm, '')
        .trim();
        
      console.log(`Extracted section text (${sectionText.length} chars): "${sectionText.substring(0, 50)}..."`);
      break;
    }
  }
  
  // Если текст не найден, ищем по позиции в тексте
  if (!sectionText) {
    console.log("Section not found by headers, trying positional extraction...");
    
    // Определяем порядок секций в зависимости от имени
    const sectionOrder = {
      'general_atmosphere': 1,
      'work_finance': 2,
      'love_relationships': 3,
      'health_wellbeing': 4,
      'daily_advice': 5
    };
    
    // Разбиваем текст на параграфы по двойным переносам строк
    const paragraphs = horoscopeText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    console.log(`Found ${paragraphs.length} paragraphs in the horoscope`);
    
    // Если количество параграфов совпадает с ожидаемым количеством секций, пробуем извлечь по порядку
    if (paragraphs.length >= 5) {
      const sectionIndex = sectionOrder[sectionName] - 1;
      if (paragraphs[sectionIndex]) {
        sectionText = paragraphs[sectionIndex].trim();
        console.log(`Extracted section text by position (${sectionText.length} chars): "${sectionText.substring(0, 50)}..."`);
      }
    }
  }
  
  // Обработка особого случая для русского языка: заголовок может быть слит с текстом
  if (!sectionText && horoscopeText.includes('русск')) {
    console.log("Trying special case extraction for Russian language...");
    
    const russianSectionNames = {
      'general_atmosphere': 'Общая атмосфера дня',
      'work_finance': 'Советы по работе и финансам',
      'love_relationships': 'Рекомендации по отношениям и любви',
      'health_wellbeing': 'Состояние здоровья и эмоционального баланса',
      'daily_advice': 'Практичный совет дня'
    };
    
    const russianTitle = russianSectionNames[sectionName];
    if (russianTitle) {
      const index = horoscopeText.indexOf(russianTitle);
      if (index !== -1) {
        // Найдем начало секции (после заголовка)
        const sectionStart = index + russianTitle.length;
        
        // Найдем конец секции (начало следующей секции или конец текста)
        let sectionEnd = horoscopeText.length;
        
        // Ищем следующую секцию
        for (const nextSectionTitle of Object.values(russianSectionNames)) {
          if (nextSectionTitle !== russianTitle) {
            const nextIndex = horoscopeText.indexOf(nextSectionTitle, sectionStart);
            if (nextIndex !== -1 && nextIndex < sectionEnd) {
              sectionEnd = nextIndex;
            }
          }
        }
        
        // Извлекаем текст секции
        sectionText = horoscopeText.substring(sectionStart, sectionEnd).trim();
        console.log(`Extracted section text by Russian title (${sectionText.length} chars): "${sectionText.substring(0, 50)}..."`);
      }
    }
  }
  
  // Если секция все равно не найдена, ищем по номерам
  if (!sectionText) {
    console.log("Section not found by headers or position, trying numbered sections...");
    
    const sectionNumbers = {
      'general_atmosphere': 1,
      'work_finance': 2,
      'love_relationships': 3,
      'health_wellbeing': 4,
      'daily_advice': 5
    };
    
    const sectionNumber = sectionNumbers[sectionName];
    if (sectionNumber) {
      // Ищем раздел, начинающийся с номера
      const numberPattern = new RegExp(`\\s*${sectionNumber}[.:]\\s*([\\s\\S]*?)(?:\\s*\\d+[.:]|$)`, 'i');
      const match = horoscopeText.match(numberPattern);
      
      if (match && match[1]) {
        sectionText = match[1].trim();
        console.log(`Extracted section text by number (${sectionText.length} chars): "${sectionText.substring(0, 50)}..."`);
      }
    }
  }
  
  // Если секция не найдена, возвращаем пустую строку
  if (!sectionText) {
    console.warn(`Section "${sectionName}" not found in horoscope text`);
    return "";
  }
  
  return sectionText;
}
