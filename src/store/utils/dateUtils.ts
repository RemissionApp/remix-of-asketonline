
// Helper function to get date string in YYYY-MM-DD format
export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to compare two dates (ignoring time)
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] === date2.split('T')[0];
};

// Helper function to check if date1 is before or equal to date2
export const isDateBeforeOrEqual = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] <= date2.split('T')[0];
};
