// Helper function to get date string in YYYY-MM-DD format using LOCAL date
// components. Using toISOString() converts to UTC and shifts the calendar day
// for users east/west of UTC, breaking streak math near midnight.
export const getDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper function to compare two dates (ignoring time)
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] === date2.split('T')[0];
};

// Helper function to check if date1 is before or equal to date2
export const isDateBeforeOrEqual = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] <= date2.split('T')[0];
};
