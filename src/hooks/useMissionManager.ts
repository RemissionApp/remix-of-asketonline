import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { enhancedMissions } from '@/data/enhancedMissions';
import { Mission } from '@/types';
import { toast } from 'sonner';

export const useMissionManager = () => {
  const { language, userProfile } = useAppStore();

  // Получить доступные миссии с учетом уровня пользователя
  const getAvailableMissions = (): Mission[] => {
    const userRank = userProfile?.rank || 'seeker';
    const userEnergyPoints = userProfile?.energyPoints || 0;

    return enhancedMissions.filter(mission => {
      // Проверка минимального ранга
      if (mission.minRank) {
        const rankOrder = ['seeker', 'pilgrim', 'warrior', 'master', 'enlightened'];
        const userRankIndex = rankOrder.indexOf(userRank);
        const requiredRankIndex = rankOrder.indexOf(mission.minRank);
        
        if (userRankIndex < requiredRankIndex) {
          return false;
        }
      }

      // Проверка условий разблокировки
      if (mission.unlockConditions) {
        for (const condition of mission.unlockConditions) {
          if (condition.type === 'energy' && userEnergyPoints < condition.value) {
            return false;
          }
          // Добавить другие условия по необходимости
        }
      }

      return true;
    });
  };

  // Получить персонализированные миссии на основе знака зодиака
  const getPersonalizedMissions = (): Mission[] => {
    const zodiacSign = userProfile?.zodiacSign;
    const availableMissions = getAvailableMissions();

    if (!zodiacSign) return availableMissions;

    // Применить бонусы для подходящих знаков зодиака
    return availableMissions.map(mission => {
      if (mission.zodiacBonus) {
        const bonus = mission.zodiacBonus.find(b => 
          b.signs.includes(zodiacSign.toLowerCase())
        );
        
        if (bonus) {
          return {
            ...mission,
            reward: {
              ...mission.reward,
              energyPoints: mission.reward.energyPoints 
                ? Math.floor(mission.reward.energyPoints * bonus.multiplier)
                : undefined
            }
          };
        }
      }
      
      return mission;
    });
  };

  // Получить рекомендованную миссию
  const getRecommendedMission = (): Mission | null => {
    const availableMissions = getPersonalizedMissions();
    const userRank = userProfile?.rank || 'seeker';
    
    console.log('Available missions:', availableMissions.length);
    console.log('User rank:', userRank);
    
    // Фильтровать по сложности - исправлены значения сложности
    const suitableMissions = availableMissions.filter(mission => {
      console.log(`Mission ${mission.id} difficulty: ${mission.difficulty}`);
      switch (userRank) {
        case 'seeker':
          return ['explorer', 'master'].includes(mission.difficulty); // Начинающие могут брать explorer и master
        case 'pilgrim':
          return ['explorer', 'master'].includes(mission.difficulty);
        case 'warrior':
          return ['explorer', 'master'].includes(mission.difficulty);
        case 'master':
        case 'enlightened':
          return ['master', 'explorer'].includes(mission.difficulty);
        default:
          return ['explorer', 'master'].includes(mission.difficulty);
      }
    });

    console.log('Suitable missions:', suitableMissions.length);

    if (suitableMissions.length === 0) {
      // Fallback: возвращаем первую доступную миссию
      return availableMissions.length > 0 ? availableMissions[0] : null;
    }

    // Выбрать случайную подходящую миссию
    const randomIndex = Math.floor(Math.random() * suitableMissions.length);
    return suitableMissions[randomIndex];
  };

  // Получить все подходящие миссии (не только одну)
  const getAllSuitableMissions = (): Mission[] => {
    const availableMissions = getPersonalizedMissions();
    const userRank = userProfile?.rank || 'seeker';
    
    // Возвращаем все доступные миссии для пользователя
    return availableMissions.filter(mission => {
      switch (userRank) {
        case 'seeker':
          return ['explorer', 'master'].includes(mission.difficulty);
        case 'pilgrim':
          return ['explorer', 'master'].includes(mission.difficulty);
        case 'warrior':
          return ['explorer', 'master'].includes(mission.difficulty);
        case 'master':
        case 'enlightened':
          return ['master', 'explorer'].includes(mission.difficulty);
        default:
          return ['explorer', 'master'].includes(mission.difficulty);
      }
    });
  };

  // Проверить, может ли пользователь принять миссию
  const canAcceptMission = (mission: Mission): boolean => {
    // Проверить, есть ли уже активная миссия
    if (userProfile?.activeMission) {
      toast.error(
        language === 'ru'
          ? 'У вас уже есть активная миссия. Завершите её перед принятием новой.'
          : language === 'es'
            ? 'Ya tienes una misión activa. Complétala antes de aceptar una nueva.'
            : 'You already have an active mission. Complete it before accepting a new one.'
      );
      return false;
    }

    // Проверить условия разблокировки
    const availableMissions = getAvailableMissions();
    return availableMissions.some(m => m.id === mission.id);
  };

  // Получить миссии по категории
  const getMissionsByCategory = (category: Mission['category']): Mission[] => {
    return getPersonalizedMissions().filter(mission => mission.category === category);
  };

  // Получить миссии по сложности
  const getMissionsByDifficulty = (difficulty: Mission['difficulty']): Mission[] => {
    return getPersonalizedMissions().filter(mission => mission.difficulty === difficulty);
  };

  // Сгенерировать мотивирующее сообщение для миссии
  const getMissionMotivation = (mission: Mission): string => {
    const motivations = {
      ru: {
        ritual: 'Ритуалы создают священное пространство для трансформации.',
        research: 'Знание — это сила, открывающая новые горизонты.',
        social: 'Ваше влияние на мир начинается с малых добрых дел.',
        mystical: 'Тайны Вселенной раскрываются тем, кто готов их принять.',
        challenge: 'Каждый вызов — это возможность стать сильнее.'
      },
      en: {
        ritual: 'Rituals create sacred space for transformation.',
        research: 'Knowledge is power that opens new horizons.',
        social: 'Your impact on the world starts with small kind acts.',
        mystical: 'Universe mysteries reveal themselves to those ready to receive.',
        challenge: 'Every challenge is an opportunity to become stronger.'
      },
      es: {
        ritual: 'Los rituales crean espacio sagrado para la transformación.',
        research: 'El conocimiento es poder que abre nuevos horizontes.',
        social: 'Tu impacto en el mundo comienza con pequeños actos bondadosos.',
        mystical: 'Los misterios del Universo se revelan a quienes están listos.',
        challenge: 'Cada desafío es una oportunidad de volverse más fuerte.'
      }
    };

    return motivations[language][mission.category] || motivations.en[mission.category];
  };

  return {
    getAvailableMissions,
    getPersonalizedMissions,
    getRecommendedMission,
    getAllSuitableMissions,
    canAcceptMission,
    getMissionsByCategory,
    getMissionsByDifficulty,
    getMissionMotivation
  };
};