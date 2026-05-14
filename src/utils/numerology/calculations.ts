/**
 * Asceta numerology — core calculations.
 *
 * Implements:
 *  - Pythagorean system (Life Path, Soul, Personality, Expression,
 *    Maturity, Personal Year, Balance, Birthday)
 *  - Chaldean system (compound + single)
 *  - Pythagorean Square (Psychomatrix) with working numbers A/B/C/D
 *  - Karma Matrix (22-arcana based)
 *
 * Reference test date: 14.03.1995
 *   Life Path = 5
 *   Pythagorean Square cells: 1:2, 2:1, 3:2, 4:3, 5:2, 6:0, 7:0, 8:0, 9:2
 *   Working numbers: A=32, B=5, C=4, D=4
 */

/* ────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────── */

const sumDigits = (n: number): number =>
  String(Math.abs(n))
    .split('')
    .reduce((a, b) => a + Number(b || 0), 0);

/** Pythagorean reduction — keeps master numbers 11, 22, 33 intact. */
export function pythagoreanReduce(n: number): number {
  const v = Math.abs(Math.trunc(n));
  if (v === 11 || v === 22 || v === 33) return v;
  if (v <= 9) return v;
  return pythagoreanReduce(sumDigits(v));
}

/** Returns true for 11/22/33. */
export const isMasterNumber = (n: number): boolean =>
  n === 11 || n === 22 || n === 33;

/* ────────────────────────────────────────────────────────────────────
   Pythagorean letter tables (RU + EN)
   ──────────────────────────────────────────────────────────────────── */

export const PYTHAGOREAN_EN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

export const PYTHAGOREAN_RU: Record<string, number> = {
  А: 1, Б: 2, В: 3, Г: 4, Д: 5, Е: 6, Ж: 7, З: 8, И: 9,
  Й: 1, К: 2, Л: 3, М: 4, Н: 5, О: 6, П: 7, Р: 8, С: 9,
  Т: 1, У: 2, Ф: 3, Х: 4, Ц: 5, Ч: 6, Ш: 7, Щ: 8, Ъ: 9,
  Ы: 1, Ь: 2, Э: 3, Ю: 4, Я: 5, Ё: 6,
};

const VOWELS = 'АЕИОУЭЮЯЁAEIOUY';

const isLetter = (c: string) => /[А-ЯЁA-Z]/.test(c);
const isVowel = (c: string) => VOWELS.includes(c);

const letterValuePythagorean = (c: string): number => {
  const u = c.toUpperCase();
  if (PYTHAGOREAN_RU[u] != null) return PYTHAGOREAN_RU[u];
  if (PYTHAGOREAN_EN[u] != null) return PYTHAGOREAN_EN[u];
  return 0;
};

const sumLetters = (
  fullName: string,
  filterFn: (c: string) => boolean
): number =>
  fullName
    .toUpperCase()
    .split('')
    .filter(c => isLetter(c) && filterFn(c))
    .reduce((acc, c) => acc + letterValuePythagorean(c), 0);

/* ────────────────────────────────────────────────────────────────────
   Pythagorean numbers
   ──────────────────────────────────────────────────────────────────── */

/**
 * Life Path — reduce day, month, year separately (preserving master),
 * then sum and reduce.
 */
export function lifePathNumber(
  day: number,
  month: number,
  year: number
): number {
  const d = pythagoreanReduce(sumDigits(day));
  const m = pythagoreanReduce(sumDigits(month));
  const y = pythagoreanReduce(sumDigits(year));
  return pythagoreanReduce(d + m + y);
}

/** Expression / Destiny number — all letters of full name. */
export const expressionNumber = (fullName: string): number =>
  pythagoreanReduce(sumLetters(fullName, () => true));

/** Soul / Heart's Desire — only vowels. */
export const soulNumber = (fullName: string): number =>
  pythagoreanReduce(sumLetters(fullName, isVowel));

/** Personality — only consonants. */
export const personalityNumber = (fullName: string): number =>
  pythagoreanReduce(sumLetters(fullName, c => !isVowel(c)));

/** Maturity = Life Path + Expression. */
export const maturityNumber = (
  lifePath: number,
  expression: number
): number => pythagoreanReduce(lifePath + expression);

/** Personal Year — day + month + current year. */
export function personalYearNumber(
  day: number,
  month: number,
  currentYear: number
): number {
  const d = pythagoreanReduce(sumDigits(day));
  const m = pythagoreanReduce(sumDigits(month));
  const y = pythagoreanReduce(sumDigits(currentYear));
  return pythagoreanReduce(d + m + y);
}

/** Balance — sum of initial letters of each word in the name. */
export function balanceNumber(fullName: string): number {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase())
    .filter(Boolean) as string[];
  const sum = initials.reduce(
    (acc, c) => acc + (isLetter(c) ? letterValuePythagorean(c) : 0),
    0
  );
  return pythagoreanReduce(sum);
}

/** Birthday number — reduced day of birth. */
export const birthdayNumber = (day: number): number =>
  pythagoreanReduce(day);

/* ────────────────────────────────────────────────────────────────────
   Chaldean system
   ──────────────────────────────────────────────────────────────────── */

export const CHALDEAN_EN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
};

export const CHALDEAN_RU: Record<string, number> = {
  А: 1, Б: 2, В: 6, Г: 3, Д: 4, Е: 5, Ж: 7, З: 7, И: 1,
  Й: 1, К: 2, Л: 3, М: 4, Н: 5, О: 7, П: 8, Р: 2, С: 3,
  Т: 4, У: 6, Ф: 8, Х: 5, Ц: 7, Ч: 6, Ш: 3, Щ: 3, Ъ: 1,
  Ы: 1, Ь: 3, Э: 5, Ю: 6, Я: 1, Ё: 5,
};

const letterValueChaldean = (c: string): number => {
  const u = c.toUpperCase();
  if (CHALDEAN_RU[u] != null) return CHALDEAN_RU[u];
  if (CHALDEAN_EN[u] != null) return CHALDEAN_EN[u];
  return 0;
};

/** Reduce to single 1-9 (no master numbers in Chaldean). */
export function chaldeanReduce(n: number): number {
  const v = Math.abs(Math.trunc(n));
  if (v <= 9) return v;
  return chaldeanReduce(sumDigits(v));
}

export interface ChaldeanResult {
  /** The compound 2-digit number — hidden / inner forces. */
  compound: number;
  /** The reduced single digit — outer expression. */
  single: number;
}

/** Chaldean numerology of a name. */
export function chaldeanNameNumber(name: string): ChaldeanResult {
  const sum = name
    .toUpperCase()
    .split('')
    .filter(isLetter)
    .reduce((acc, c) => acc + letterValueChaldean(c), 0);
  return { compound: sum, single: chaldeanReduce(sum) };
}

/** Chaldean Life Path — sum of all digits of the date. */
export function chaldeanLifePath(
  day: number,
  month: number,
  year: number
): ChaldeanResult {
  const sum = `${day}${month}${year}`
    .split('')
    .reduce((a, b) => a + Number(b || 0), 0);
  return { compound: sum, single: chaldeanReduce(sum) };
}

/* ────────────────────────────────────────────────────────────────────
   Pythagorean Square (Psychomatrix)
   ──────────────────────────────────────────────────────────────────── */

export interface PythagoreanSquare {
  digits: number[];
  workingNumbers: { A: number; B: number; C: number; D: number };
  cells: Record<string, number>;
  rows: {
    top: [number, number, number];
    middle: [number, number, number];
    bottom: [number, number, number];
  };
  diagonals: {
    main: [number, number, number];
    secondary: [number, number, number];
  };
  characteristics: {
    character: number;
    energy: number;
    interest: number;
    health: number;
    logic: number;
    work: number;
    luck: number;
    duty: number;
    memory: number;
  };
}

export function pythagoreanSquare(
  day: number,
  month: number,
  year: number
): PythagoreanSquare {
  const dateStr =
    String(day).padStart(2, '0') +
    String(month).padStart(2, '0') +
    String(year);
  const digits = dateStr.split('').map(Number).filter(n => !isNaN(n));

  const A = digits.reduce((a, b) => a + b, 0);
  const B = sumDigits(A);
  const C = Math.abs(A - day * 2);
  const D = sumDigits(C);

  const allDigits = [
    ...digits,
    ...String(A).split('').map(Number),
    ...String(B).split('').map(Number),
    ...String(C).split('').map(Number),
    ...String(D).split('').map(Number),
  ].filter(n => n > 0);

  const cells: Record<string, number> = {};
  for (let i = 1; i <= 9; i++) {
    cells[String(i)] = allDigits.filter(d => d === i).length;
  }

  return {
    digits,
    workingNumbers: { A, B, C, D },
    cells,
    rows: {
      top: [cells['1'], cells['2'], cells['3']],
      middle: [cells['4'], cells['5'], cells['6']],
      bottom: [cells['7'], cells['8'], cells['9']],
    },
    diagonals: {
      main: [cells['1'], cells['5'], cells['9']],
      secondary: [cells['3'], cells['5'], cells['7']],
    },
    characteristics: {
      character: cells['1'],
      energy: cells['2'],
      interest: cells['3'],
      health: cells['4'],
      logic: cells['5'],
      work: cells['6'],
      luck: cells['7'],
      duty: cells['8'],
      memory: cells['9'],
    },
  };
}

/** Categorize a cell count into a strength level. */
export type CellStrength =
  | 'absent'
  | 'weak'
  | 'medium'
  | 'strong'
  | 'very_strong';

export function getCellStrength(count: number): CellStrength {
  if (count <= 0) return 'absent';
  if (count === 1) return 'weak';
  if (count === 2) return 'medium';
  if (count === 3) return 'strong';
  return 'very_strong';
}

/* ────────────────────────────────────────────────────────────────────
   Karma Matrix (22 arcana)
   ──────────────────────────────────────────────────────────────────── */

/** Reduce to 1..22. */
export function karmaReduce(n: number): number {
  const v = Math.abs(Math.trunc(n));
  if (v === 0) return 22;
  if (v <= 22) return v;
  return karmaReduce(sumDigits(v));
}

export interface KarmaMatrix {
  center: number;
  sky: number;
  earth: number;
  personalMission: number;
  socialMission: number;
  corners: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
  talent: number;
  karmaBlock: number;
  planets: {
    sun: number;
    moon: number;
    mars: number;
    venus: number;
    mercury: number;
    jupiter: number;
    saturn: number;
  };
}

export function karmaMatrix(
  day: number,
  month: number,
  year: number
): KarmaMatrix {
  const dSum = sumDigits(day);
  const mSum = sumDigits(month);
  const ySum = sumDigits(year);

  const center = karmaReduce(dSum + mSum + ySum);
  const sky = karmaReduce(day + month);
  const earth = karmaReduce(month + ySum);
  const personalMission = karmaReduce(day + ySum);
  const socialMission = karmaReduce(sky + earth);

  const corners = {
    topLeft: karmaReduce(day),
    topRight: karmaReduce(month),
    bottomLeft: karmaReduce(ySum),
    bottomRight: karmaReduce(center),
  };

  const talent = karmaReduce(
    corners.topLeft +
      corners.topRight +
      corners.bottomLeft +
      corners.bottomRight
  );

  const karmaBlock = karmaReduce(Math.abs(sky - earth) || 22);

  // Planetary positions follow the classical Chaldean numerology:
  // reduce to 1..9 but preserve master numbers 11/22/33. This keeps
  // archetypal planetary correspondences (1=Sun, 2=Moon, 3=Jupiter…)
  // while still surfacing rare master-number activations.
  const planets = {
    sun: pythagoreanReduce(day),
    moon: pythagoreanReduce(month),
    mars: pythagoreanReduce(ySum),
    venus: pythagoreanReduce(day + month),
    mercury: pythagoreanReduce(day + ySum),
    jupiter: pythagoreanReduce(month + ySum),
    saturn: pythagoreanReduce(center),
  };

  return {
    center, sky, earth,
    personalMission, socialMission,
    corners, talent, karmaBlock, planets,
  };
}

/* ────────────────────────────────────────────────────────────────────
   High-level convenience
   ──────────────────────────────────────────────────────────────────── */

export interface NumerologyProfile {
  birthDate: { day: number; month: number; year: number };
  fullName: string;

  pythagorean: {
    lifePath: number;
    expression: number;
    soul: number;
    personality: number;
    maturity: number;
    personalYear: number;
    balance: number;
    birthday: number;
  };

  chaldean: {
    name: ChaldeanResult;
    lifePath: ChaldeanResult;
  };

  square: PythagoreanSquare;
  karma: KarmaMatrix;
}

export function buildProfile(
  birthDateInput: string | Date,
  fullName: string,
  currentYear: number = new Date().getFullYear()
): NumerologyProfile | null {
  const date =
    typeof birthDateInput === 'string'
      ? new Date(birthDateInput)
      : birthDateInput;
  if (!date || isNaN(date.getTime())) return null;

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const lifePath = lifePathNumber(day, month, year);
  const expression = expressionNumber(fullName);

  return {
    birthDate: { day, month, year },
    fullName,
    pythagorean: {
      lifePath,
      expression,
      soul: soulNumber(fullName),
      personality: personalityNumber(fullName),
      maturity: maturityNumber(lifePath, expression),
      personalYear: personalYearNumber(day, month, currentYear),
      balance: balanceNumber(fullName),
      birthday: birthdayNumber(day),
    },
    chaldean: {
      name: chaldeanNameNumber(fullName),
      lifePath: chaldeanLifePath(day, month, year),
    },
    square: pythagoreanSquare(day, month, year),
    karma: karmaMatrix(day, month, year),
  };
}