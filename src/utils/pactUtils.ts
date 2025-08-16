/**
 * Utility functions for pact-related calculations and operations
 */

import { Pact } from '@/types';

/**
 * Calculate penalty points for breaking an ascesis
 * @param completedDays Number of days already completed
 * @param totalDays Total duration of the pact
 * @returns Calculated penalty points
 */
export const calculateBreakPenalty = (
  completedDays: number,
  totalDays: number
): number => {
  const basePenalty = 100;
  const progressPenalty = Math.floor(completedDays * 10); // 10 points per completed day
  return basePenalty + progressPenalty;
};

/**
 * Get completed days count from a pact
 * @param pact The pact object with days array
 * @returns Number of completed days
 */
export const getCompletedDaysCount = (pact: Pact): number => {
  return pact.days?.filter(day => day.completed).length || 0;
};

/**
 * Calculate break penalty for a specific pact
 * @param pact The pact to calculate penalty for
 * @returns Object with penalty details
 */
export const getPactBreakPenalty = (pact: Pact) => {
  const completedDays = getCompletedDaysCount(pact);
  const totalDays = pact.duration || 1;
  const basePenalty = 100;
  const progressPenalty = Math.floor(completedDays * 10);
  const totalPenalty = calculateBreakPenalty(completedDays, totalDays);

  return {
    completedDays,
    totalDays,
    basePenalty,
    progressPenalty,
    totalPenalty,
  };
};

/**
 * Get formatted penalty description for UI
 * @param penalty Penalty calculation result
 * @param language Current language
 * @returns Formatted penalty description
 */
export const formatPenaltyDescription = (
  penalty: ReturnType<typeof getPactBreakPenalty>,
  language: string
): string => {
  const { basePenalty, progressPenalty, totalPenalty } = penalty;

  switch (language) {
    case 'ru':
      return `Вы потеряете ${totalPenalty} энергетических очков (${basePenalty} базовый штраф + ${progressPenalty} за прогресс)`;
    case 'es':
      return `Perderás ${totalPenalty} puntos de energía (${basePenalty} penalización base + ${progressPenalty} por progreso)`;
    default:
      return `You will lose ${totalPenalty} energy points (${basePenalty} base penalty + ${progressPenalty} for progress)`;
  }
};
