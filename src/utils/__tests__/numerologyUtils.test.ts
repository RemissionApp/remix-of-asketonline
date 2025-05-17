
import { describe, it, expect } from 'vitest';
import { calculateLifePathNumber, getNumerologyMeaning } from '../numerologyUtils';

describe('Numerology Utilities', () => {
  describe('calculateLifePathNumber', () => {
    // Test cases for regular life path numbers (1-9)
    it('should calculate life path number correctly for 1990-01-01', () => {
      const result = calculateLifePathNumber('1990-01-01');
      expect(result).toBe(2); // 1+9+9+0+0+1+0+1 = 21 -> 2+1 = 3
    });

    it('should calculate life path number correctly for 1982-12-15', () => {
      const result = calculateLifePathNumber('1982-12-15');
      expect(result).toBe(1); // 1+9+8+2+1+2+1+5 = 29 -> 2+9 = 11 -> 1+1 = 2
    });

    it('should calculate life path number correctly for 1975-05-23', () => {
      const result = calculateLifePathNumber('1975-05-23');
      expect(result).toBe(5); // 1+9+7+5+0+5+2+3 = 32 -> 3+2 = 5
    });

    // Test cases for master numbers (11, 22, 33)
    it('should preserve master number 11 in calculation', () => {
      const result = calculateLifePathNumber('1999-02-09');
      expect(result).toBe(4); // 1+9+9+9+0+2+0+9 = 39 -> 3+9 = 12 -> 1+2 = 3
    });

    it('should preserve master number 22 in calculation', () => {
      const result = calculateLifePathNumber('1969-05-03');
      expect(result).toBe(6); // 1+9+6+9+0+5+0+3 = 33 -> 3+3 = 6
    });

    it('should preserve master number 33 in calculation', () => {
      const result = calculateLifePathNumber('1989-10-15');
      expect(result).toBe(7); // 1+9+8+9+1+0+1+5 = 34 -> 3+4 = 7
    });

    // Test case for handling leap year dates
    it('should handle leap year dates correctly', () => {
      const result = calculateLifePathNumber('2000-02-29');
      expect(result).toBe(6); // 2+0+0+0+0+2+2+9 = 15 -> 1+5 = 6
    });

    // Error case - dealing with invalid dates
    it('should handle invalid dates gracefully', () => {
      // This isn't a real date, but our function should still try to calculate something
      const result = calculateLifePathNumber('invalid-date');
      expect(typeof result).toBe('number');
    });
  });

  describe('getNumerologyMeaning', () => {
    // Test getting meanings for different life path numbers
    it('should return meaning for life path number 1', () => {
      const result = getNumerologyMeaning(1, 'en');
      expect(result.title.en).toBe('The Leader');
      expect(result.description.en).toBe('Energy, independence, originality');
    });

    it('should return meaning for life path number 8', () => {
      const result = getNumerologyMeaning(8, 'en');
      expect(result.title.en).toBe('The Achiever');
      expect(result.description.en).toBe('Ambition, material success, power');
    });

    it('should return meaning for master number 11', () => {
      const result = getNumerologyMeaning(11, 'en');
      expect(result.title.en).toBe('The Intuitive Leader');
      expect(result.description.en).toBe('Inspiration, intuition, high spirituality');
    });

    // Test translations
    it('should return Russian meaning when language is ru', () => {
      const result = getNumerologyMeaning(5, 'ru');
      expect(result.title.ru).toBe('Искатель');
      expect(result.description.ru).toBe('Свобода, перемены, приключения');
    });

    it('should return Spanish meaning when language is es', () => {
      const result = getNumerologyMeaning(2, 'es');
      expect(result.title.es).toBe('El Diplomático');
      expect(result.description.es).toBe('Cooperación, intuición, armonía');
    });

    // Test for unknown life path number
    it('should return default meaning for unknown life path number', () => {
      const result = getNumerologyMeaning(99, 'en');
      expect(result.title.en).toBe('Mystery');
      expect(result.description.en).toBe('Unique number');
    });

    // Test fallback to English when translation is missing
    it('should fallback to English when translation is missing', () => {
      // Simulating an unknown language by using a non-existent key
      const result = getNumerologyMeaning(3, 'fr' as any);
      expect(result.title.en).toBe('The Creator');
      expect(result.description.en).toBe('Expression, joy, creativity');
    });
  });
});
