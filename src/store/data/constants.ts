
import { Achievement, Mission } from '@/types';

// Example quotes
export const quotes = [
  "Ты отказываешься от малого, чтобы вместить великое.",
  "В искушении ты проверяешь намерение. Иди до конца.",
  "Каждый день твоей аскезы — нить, соединяющая тебя с высшим.",
  "Истинная сила не в овладении, а в осознанном отказе.",
  "Отбрось то, что тянет тебя вниз, и воспари над обыденностью.",
  "Твоя воля — это мост между намерением и реальностью.",
  "Ограничивая себя внешне, ты расширяешься внутренне."
];

// Default achievements
export const defaultAchievements: Achievement[] = [
  {
    id: 'first-pact',
    title: 'Первый договор',
    description: 'Заключите свой первый договор с Вселенной',
    icon: 'scroll',
    unlocked: false
  },
  {
    id: '7-days-streak',
    title: '7 дней подряд',
    description: 'Соблюдайте аскезу 7 дней подряд',
    icon: 'calendar',
    unlocked: false
  },
  {
    id: '30-days-streak',
    title: '30 дней подряд',
    description: 'Соблюдайте аскезу 30 дней подряд',
    icon: 'award',
    unlocked: false
  },
  {
    id: 'first-question',
    title: 'Первый разговор',
    description: 'Задайте первый вопрос Вселенной',
    icon: 'message-square',
    unlocked: false
  }
];

// Available missions
export const availableMissions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Первые шаги аскета',
    description: 'Соблюдайте свою первую аскезу три дня подряд и получите энергетические очки',
    requirements: ['Соблюдать аскезу 3 дня подряд'],
    reward: {
      energyPoints: 30
    },
    completed: false
  },
  {
    id: 'mission-2',
    title: 'Разговор с Вселенной',
    description: 'Задайте три вопроса Вселенной и получите дополнительную мудрость',
    requirements: ['Задать 3 вопроса Вселенной'],
    reward: {
      energyPoints: 50,
      achievement: 'universe-seeker'
    },
    completed: false
  }
];

// Rank requirements
export const rankRequirements = {
  seeker: 0,
  pilgrim: 10,
  warrior: 30,
  master: 90,
  enlightened: 365
};
