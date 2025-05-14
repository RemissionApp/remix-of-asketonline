
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { useTranslations } from '@/hooks/useTranslations';

export const ZodiacInfo: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  const birthDate = userProfile?.birthDate;
  const zodiacSign = getZodiacSign(birthDate || null);
  
  if (!zodiacSign) return null;
  
  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName = zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en;
  
  // Translate element based on language
  const translateElement = (element: string): string => {
    if (language === 'ru') {
      switch (element) {
        case 'Fire': return 'Огонь';
        case 'Earth': return 'Земля';
        case 'Air': return 'Воздух';
        case 'Water': return 'Вода';
        default: return element;
      }
    } else if (language === 'es') {
      switch (element) {
        case 'Fire': return 'Fuego';
        case 'Earth': return 'Tierra';
        case 'Air': return 'Aire';
        case 'Water': return 'Agua';
        default: return element;
      }
    }
    return element;
  };
  
  // Translate ruler based on language
  const translateRuler = (ruler: string): string => {
    if (language === 'ru') {
      switch (ruler) {
        case 'Mars': return 'Марс';
        case 'Venus': return 'Венера';
        case 'Mercury': return 'Меркурий';
        case 'Moon': return 'Луна';
        case 'Sun': return 'Солнце';
        case 'Jupiter': return 'Юпитер';
        case 'Saturn': return 'Сатурн';
        case 'Uranus': return 'Уран';
        case 'Neptune': return 'Нептун';
        case 'Pluto': return 'Плутон';
        case 'Pluto, Mars': return 'Плутон, Марс';
        case 'Neptune, Jupiter': return 'Нептун, Юпитер';
        case 'Uranus, Saturn': return 'Уран, Сатурн';
        default: return ruler;
      }
    } else if (language === 'es') {
      switch (ruler) {
        case 'Mars': return 'Marte';
        case 'Venus': return 'Venus';
        case 'Mercury': return 'Mercurio';
        case 'Moon': return 'Luna';
        case 'Sun': return 'Sol';
        case 'Jupiter': return 'Júpiter';
        case 'Saturn': return 'Saturno';
        case 'Uranus': return 'Urano';
        case 'Neptune': return 'Neptuno';
        case 'Pluto': return 'Plutón';
        case 'Pluto, Mars': return 'Plutón, Marte';
        case 'Neptune, Jupiter': return 'Neptuno, Júpiter';
        case 'Uranus, Saturn': return 'Urano, Saturno';
        default: return ruler;
      }
    }
    return ruler;
  };
  
  // Translate traits based on language
  const translateTraits = (traits: string[]): string[] => {
    if (language === 'ru') {
      return traits.map(trait => {
        switch (trait) {
          case 'Courageous': return 'Смелый';
          case 'Determined': return 'Решительный';
          case 'Passionate': return 'Страстный';
          case 'Confident': return 'Уверенный';
          case 'Reliable': return 'Надежный';
          case 'Patient': return 'Терпеливый';
          case 'Practical': return 'Практичный';
          case 'Devoted': return 'Преданный';
          case 'Adaptable': return 'Адаптивный';
          case 'Outgoing': return 'Общительный';
          case 'Curious': return 'Любознательный';
          case 'Intelligent': return 'Умный';
          case 'Empathetic': return 'Эмпатичный';
          case 'Nurturing': return 'Заботливый';
          case 'Intuitive': return 'Интуитивный';
          case 'Protective': return 'Защищающий';
          case 'Creative': return 'Творческий';
          case 'Generous': return 'Щедрый';
          case 'Charismatic': return 'Харизматичный';
          case 'Analytical': return 'Аналитический';
          case 'Diligent': return 'Усердный';
          case 'Detail-oriented': return 'Внимательный к деталям';
          case 'Diplomatic': return 'Дипломатичный';
          case 'Fair-minded': return 'Справедливый';
          case 'Harmonious': return 'Гармоничный';
          case 'Social': return 'Социальный';
          case 'Resourceful': return 'Находчивый';
          case 'Intense': return 'Интенсивный';
          case 'Optimistic': return 'Оптимистичный';
          case 'Freedom-loving': return 'Свободолюбивый';
          case 'Adventurous': return 'Авантюрный';
          case 'Philosophical': return 'Философский';
          case 'Disciplined': return 'Дисциплинированный';
          case 'Responsible': return 'Ответственный';
          case 'Self-controlled': return 'Самоконтролируемый';
          case 'Ambitious': return 'Амбициозный';
          case 'Progressive': return 'Прогрессивный';
          case 'Original': return 'Оригинальный';
          case 'Independent': return 'Независимый';
          case 'Humanitarian': return 'Гуманист';
          case 'Compassionate': return 'Сострадательный';
          case 'Gentle': return 'Нежный';
          case 'Artistic': return 'Артистичный';
          default: return trait;
        }
      });
    } else if (language === 'es') {
      return traits.map(trait => {
        switch (trait) {
          case 'Courageous': return 'Valiente';
          case 'Determined': return 'Determinado';
          case 'Passionate': return 'Apasionado';
          case 'Confident': return 'Seguro';
          case 'Reliable': return 'Confiable';
          case 'Patient': return 'Paciente';
          case 'Practical': return 'Práctico';
          case 'Devoted': return 'Devoto';
          case 'Adaptable': return 'Adaptable';
          case 'Outgoing': return 'Extrovertido';
          case 'Curious': return 'Curioso';
          case 'Intelligent': return 'Inteligente';
          case 'Empathetic': return 'Empático';
          case 'Nurturing': return 'Nutritivo';
          case 'Intuitive': return 'Intuitivo';
          case 'Protective': return 'Protector';
          case 'Creative': return 'Creativo';
          case 'Generous': return 'Generoso';
          case 'Charismatic': return 'Carismático';
          case 'Analytical': return 'Analítico';
          case 'Diligent': return 'Diligente';
          case 'Detail-oriented': return 'Detallista';
          case 'Diplomatic': return 'Diplomático';
          case 'Fair-minded': return 'Justo';
          case 'Harmonious': return 'Armonioso';
          case 'Social': return 'Social';
          case 'Resourceful': return 'Ingenioso';
          case 'Intense': return 'Intenso';
          case 'Optimistic': return 'Optimista';
          case 'Freedom-loving': return 'Amante de la libertad';
          case 'Adventurous': return 'Aventurero';
          case 'Philosophical': return 'Filosófico';
          case 'Disciplined': return 'Disciplinado';
          case 'Responsible': return 'Responsable';
          case 'Self-controlled': return 'Autocontrolado';
          case 'Ambitious': return 'Ambicioso';
          case 'Progressive': return 'Progresista';
          case 'Original': return 'Original';
          case 'Independent': return 'Independiente';
          case 'Humanitarian': return 'Humanitario';
          case 'Compassionate': return 'Compasivo';
          case 'Gentle': return 'Gentil';
          case 'Artistic': return 'Artístico';
          default: return trait;
        }
      });
    }
    return traits;
  };
  
  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl text-cosmic-accent">{zodiacInfo.symbol}</div>
        <div>
          <h3 className="text-white font-medium">{zodiacName}</h3>
          <p className="text-sm text-cosmic-secondary">{zodiacInfo.dates}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-cosmic-secondary">{t.zodiac?.element || "Element"}:</span>
          <span className="text-white ml-2">{translateElement(zodiacInfo.element)}</span>
        </div>
        <div>
          <span className="text-cosmic-secondary">{t.zodiac?.ruler || "Ruler"}:</span>
          <span className="text-white ml-2">{translateRuler(zodiacInfo.ruler)}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-cosmic-secondary mb-1">{t.zodiac?.traits || "Traits"}:</div>
        <div className="flex flex-wrap gap-2">
          {translateTraits(zodiacInfo.traits).map(trait => (
            <span 
              key={trait} 
              className="bg-cosmic-accent/20 text-white px-2 py-1 rounded-full text-xs"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
