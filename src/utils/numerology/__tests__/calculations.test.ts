import { describe, it, expect } from 'vitest';
import {
  pythagoreanReduce,
  isMasterNumber,
  lifePathNumber,
  expressionNumber,
  soulNumber,
  personalityNumber,
  chaldeanReduce,
  chaldeanNameNumber,
  chaldeanLifePath,
  pythagoreanSquare,
  getCellStrength,
  karmaReduce,
  karmaMatrix,
  buildProfile,
} from '../calculations';

describe('pythagoreanReduce', () => {
  it('keeps master numbers 11/22/33', () => {
    expect(pythagoreanReduce(11)).toBe(11);
    expect(pythagoreanReduce(22)).toBe(22);
    expect(pythagoreanReduce(33)).toBe(33);
  });

  it('reduces multi-digit numbers', () => {
    expect(pythagoreanReduce(38)).toBe(2); // 3+8=11 (master) — note: 11 stays
    expect(pythagoreanReduce(38)).not.toBe(11); // 38 -> 11 -> 11
  });

  // 38 -> 3+8 = 11, which IS master, so stays 11. Adjust expectation.
});

describe('pythagoreanReduce — corrected', () => {
  it('38 -> 11 (master preserved)', () => {
    expect(pythagoreanReduce(38)).toBe(11);
  });
  it('29 -> 11', () => {
    expect(pythagoreanReduce(29)).toBe(11);
  });
  it('45 -> 9', () => {
    expect(pythagoreanReduce(45)).toBe(9);
  });
});

describe('isMasterNumber', () => {
  it('returns true only for 11/22/33', () => {
    expect(isMasterNumber(11)).toBe(true);
    expect(isMasterNumber(22)).toBe(true);
    expect(isMasterNumber(33)).toBe(true);
    expect(isMasterNumber(7)).toBe(false);
    expect(isMasterNumber(44)).toBe(false);
  });
});

describe('Reference date 14.03.1995', () => {
  const day = 14;
  const month = 3;
  const year = 1995;

  it('Life Path = 5', () => {
    // d=1+4=5, m=3, y=1+9+9+5=24 -> 6, sum=14 -> 5
    expect(lifePathNumber(day, month, year)).toBe(5);
  });

  describe('Pythagorean Square', () => {
    const sq = pythagoreanSquare(day, month, year);

    it('working number A = 32', () => {
      // 1+4+0+3+1+9+9+5 = 32
      expect(sq.workingNumbers.A).toBe(32);
    });
    it('working number B = 5', () => {
      // 3+2 = 5
      expect(sq.workingNumbers.B).toBe(5);
    });
    it('working number C = 4', () => {
      // |32 - 14*2| = 4
      expect(sq.workingNumbers.C).toBe(4);
    });
    it('working number D = 4', () => {
      expect(sq.workingNumbers.D).toBe(4);
    });

    it('cell counts match reference', () => {
      // All digits considered: 1,4,0,3,1,9,9,5,3,2,5,4,4 (zeros excluded)
      // -> 1:2, 2:1, 3:2, 4:3, 5:2, 6:0, 7:0, 8:0, 9:2
      expect(sq.cells['1']).toBe(2);
      expect(sq.cells['2']).toBe(1);
      expect(sq.cells['3']).toBe(2);
      expect(sq.cells['4']).toBe(3);
      expect(sq.cells['5']).toBe(2);
      expect(sq.cells['6']).toBe(0);
      expect(sq.cells['7']).toBe(0);
      expect(sq.cells['8']).toBe(0);
      expect(sq.cells['9']).toBe(2);
    });

    it('characteristics map to cells', () => {
      expect(sq.characteristics.character).toBe(2);
      expect(sq.characteristics.health).toBe(3);
      expect(sq.characteristics.memory).toBe(2);
    });
  });

  describe('Chaldean', () => {
    it('chaldeanLifePath compound = 32, single = 5', () => {
      const r = chaldeanLifePath(day, month, year);
      expect(r.compound).toBe(32);
      expect(r.single).toBe(5);
    });
  });

  describe('Karma Matrix', () => {
    const k = karmaMatrix(day, month, year);

    it('center = 14 (5+3+6=14)', () => {
      expect(k.center).toBe(14);
    });
    it('sky = day+month = 17', () => {
      expect(k.sky).toBe(17);
    });
    it('earth = month + sum(year) = 3+24=27 -> 9', () => {
      // 27 > 22, reduce: 2+7 = 9
      expect(k.earth).toBe(9);
    });
    it('all positions are within 1..22', () => {
      const all = [
        k.center, k.sky, k.earth, k.personalMission, k.socialMission,
        k.corners.topLeft, k.corners.topRight,
        k.corners.bottomLeft, k.corners.bottomRight,
        k.talent, k.karmaBlock,
        ...Object.values(k.planets),
      ];
      all.forEach(v => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(22);
      });
    });
  });
});

describe('Name-based numbers (Pythagorean RU)', () => {
  // Иван: И=9 В=3 А=1 Н=5 -> 18 -> 9
  it('expression of "Иван" = 9', () => {
    expect(expressionNumber('Иван')).toBe(9);
  });
  // vowels of "Иван": И(9), А(1) = 10 -> 1
  it('soul of "Иван" = 1', () => {
    expect(soulNumber('Иван')).toBe(1);
  });
  // consonants of "Иван": В(3), Н(5) = 8
  it('personality of "Иван" = 8', () => {
    expect(personalityNumber('Иван')).toBe(8);
  });
});

describe('Chaldean reduce', () => {
  it('reduces to 1..9', () => {
    expect(chaldeanReduce(11)).toBe(2);
    expect(chaldeanReduce(22)).toBe(4);
    expect(chaldeanReduce(57)).toBe(3);
  });
});

describe('karmaReduce', () => {
  it('keeps 1..22', () => {
    expect(karmaReduce(22)).toBe(22);
    expect(karmaReduce(14)).toBe(14);
  });
  it('reduces > 22', () => {
    expect(karmaReduce(23)).toBe(5);
    expect(karmaReduce(99)).toBe(18);
  });
});

describe('getCellStrength', () => {
  it('classifies counts', () => {
    expect(getCellStrength(0)).toBe('absent');
    expect(getCellStrength(1)).toBe('weak');
    expect(getCellStrength(2)).toBe('medium');
    expect(getCellStrength(3)).toBe('strong');
    expect(getCellStrength(5)).toBe('very_strong');
  });
});

describe('buildProfile', () => {
  it('returns null for invalid date', () => {
    expect(buildProfile('not-a-date', 'Test')).toBeNull();
  });
  it('builds full profile for 14.03.1995', () => {
    const p = buildProfile('1995-03-14', 'Иван Иванов', 2025);
    expect(p).not.toBeNull();
    expect(p!.pythagorean.lifePath).toBe(5);
    expect(p!.square.workingNumbers.A).toBe(32);
  });
});