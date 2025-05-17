
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { CosmicButton } from './CosmicButton';
import { useNavigate } from 'react-router-dom';

export const NumerologyDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    return null;
  }
  
  // Calculate life path number (simple numerology)
  const calculateLifePathNumber = (birthDate: string) => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const year = date.getFullYear();
    
    // Sum all digits
    const sumDigits = (num: number): number => {
      let sum = 0;
      while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
      }
      return sum;
    };
    
    // Reduce to single digit (except 11, 22, 33 which are master numbers)
    const reduceToSingleDigit = (num: number): number => {
      if (num === 11 || num === 22 || num === 33) return num;
      while (num > 9) {
        num = sumDigits(num);
      }
      return num;
    };
    
    let sum = sumDigits(day) + sumDigits(month) + sumDigits(year);
    return reduceToSingleDigit(sum);
  };
  
  // We need to pass a string to calculateLifePathNumber, not a Date object
  const lifePathNumber = calculateLifePathNumber(userProfile.birthDate);
  
  // Get numerology meaning based on life path number
  const getNumerologyMeaning = () => {
    const meanings: Record<number, { 
      title: {ru: string, en: string, es: string}, 
      description: {ru: string, en: string, es: string}
    }> = {
      1: {
        title: {
          ru: "Лидер", 
          en: "The Leader", 
          es: "El Líder"
        },
        description: {
          ru: "Энергичность, независимость, оригинальность", 
          en: "Energy, independence, originality", 
          es: "Energía, independencia, originalidad"
        }
      },
      2: {
        title: {
          ru: "Дипломат", 
          en: "The Diplomat", 
          es: "El Diplomático"
        },
        description: {
          ru: "Сотрудничество, интуиция, гармония", 
          en: "Cooperation, intuition, harmony", 
          es: "Cooperación, intuición, armonía"
        }
      },
      3: {
        title: {
          ru: "Творец", 
          en: "The Creator", 
          es: "El Creador"
        },
        description: {
          ru: "Выражение, радость, творчество", 
          en: "Expression, joy, creativity", 
          es: "Expresión, alegría, creatividad"
        }
      },
      4: {
        title: {
          ru: "Строитель", 
          en: "The Builder", 
          es: "El Constructor"
        },
        description: {
          ru: "Стабильность, организованность, надежность", 
          en: "Stability, organization, reliability", 
          es: "Estabilidad, organización, fiabilidad"
        }
      },
      5: {
        title: {
          ru: "Искатель", 
          en: "The Adventurer", 
          es: "El Aventurero"
        },
        description: {
          ru: "Свобода, перемены, приключения", 
          en: "Freedom, change, adventure", 
          es: "Libertad, cambio, aventura"
        }
      },
      6: {
        title: {
          ru: "Хранитель", 
          en: "The Nurturer", 
          es: "El Protector"
        },
        description: {
          ru: "Забота, ответственность, гармония", 
          en: "Nurturing, responsibility, harmony", 
          es: "Cuidado, responsabilidad, armonía"
        }
      },
      7: {
        title: {
          ru: "Мыслитель", 
          en: "The Thinker", 
          es: "El Pensador"
        },
        description: {
          ru: "Анализ, интроспекция, духовность", 
          en: "Analysis, introspection, spirituality", 
          es: "Análisis, introspección, espiritualidad"
        }
      },
      8: {
        title: {
          ru: "Достигатель", 
          en: "The Achiever", 
          es: "El Triunfador"
        },
        description: {
          ru: "Амбиции, материальный успех, власть", 
          en: "Ambition, material success, power", 
          es: "Ambición, éxito material, poder"
        }
      },
      9: {
        title: {
          ru: "Гуманист", 
          en: "The Humanitarian", 
          es: "El Humanitario"
        },
        description: {
          ru: "Сочувствие, альтруизм, мудрость", 
          en: "Compassion, altruism, wisdom", 
          es: "Compasión, altruismo, sabiduría"
        }
      },
      11: {
        title: {
          ru: "Интуитивный Лидер", 
          en: "The Intuitive Leader", 
          es: "El Líder Intuitivo"
        },
        description: {
          ru: "Вдохновение, интуиция, духовность высокого уровня", 
          en: "Inspiration, intuition, high spirituality", 
          es: "Inspiración, intuición, alta espiritualidad"
        }
      },
      22: {
        title: {
          ru: "Мастер-Строитель", 
          en: "The Master Builder", 
          es: "El Maestro Constructor"
        },
        description: {
          ru: "Практичность, лидерство, крупные достижения", 
          en: "Practicality, leadership, major achievements", 
          es: "Practicidad, liderazgo, grandes logros"
        }
      },
      33: {
        title: {
          ru: "Мастер Учитель", 
          en: "The Master Teacher", 
          es: "El Maestro Instructor"
        },
        description: {
          ru: "Служение, исцеление, альтруизм самого высокого уровня", 
          en: "Service, healing, highest level of altruism", 
          es: "Servicio, curación, máximo nivel de altruismo"
        }
      }
    };
    
    return meanings[lifePathNumber] || {
      title: {ru: "Загадка", en: "Mystery", es: "Misterio"},
      description: {ru: "Уникальное число", en: "Unique number", es: "Número único"}
    };
  };
  
  const numerologyMeaning = getNumerologyMeaning();
  const title = numerologyMeaning.title[language as keyof typeof numerologyMeaning.title] || numerologyMeaning.title.en;
  const description = numerologyMeaning.description[language as keyof typeof numerologyMeaning.description] || numerologyMeaning.description.en;
  
  const handleMoreDetails = () => {
    navigate('/numerology');
  };
  
  const numerologyContent = (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full max-w-lg mx-auto">
      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <span className="text-3xl">{lifePathNumber}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cosmic-accent">{language === 'ru' ? 'Нумерология' : language === 'es' ? 'Numerología' : 'Numerology'}</h3>
            <p className="text-sm text-cosmic-secondary">
              {language === 'ru' ? 'Путь жизни' : language === 'es' ? 'Sendero de vida' : 'Life Path'}: {lifePathNumber}
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-cosmic-secondary mt-2">{description}</p>
        </div>
        
        <div className="mt-4 flex justify-center">
          <CosmicButton 
            onClick={handleMoreDetails} 
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            {language === 'ru' ? 'Подробнее' : language === 'es' ? 'Más detalles' : 'More details'}
          </CosmicButton>
        </div>
      </div>
    </div>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    const titleText = language === 'ru' ? 'Нумерология' : language === 'es' ? 'Numerología' : 'Numerology';
    const messageText = language === 'ru' 
      ? 'Разблокируй PRO чтобы получить полный доступ к нумерологии' 
      : language === 'es' 
        ? 'Desbloquea PRO para obtener acceso completo a la numerología' 
        : 'Unlock PRO to get full access to numerology';
        
    return (
      <ProFeatureOverlay 
        title={titleText}
        message={messageText}
        className="mb-6 w-full max-w-lg mx-auto"
      >
        {numerologyContent}
      </ProFeatureOverlay>
    );
  }
  
  return numerologyContent;
};
