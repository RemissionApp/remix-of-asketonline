
export interface DetailedHoroscope {
  description: string;
  sections?: {
    work_finance: string;
    love_relationships: string;
    health_wellbeing: string;
    daily_advice: string;
  };
  lucky_number: string;
  lucky_time: string;
  color: string;
  mood: string;
}

export interface HoroscopeTranslations {
  title: Record<string, string>;
  backButton: Record<string, string>;
  loading: Record<string, string>;
  luckyNumber: Record<string, string>;
  luckyTime: Record<string, string>;
  color: Record<string, string>;
  mood: Record<string, string>;
  workFinance: Record<string, string>;
  loveRelationships: Record<string, string>;
  healthWellbeing: Record<string, string>;
  dailyAdvice: Record<string, string>;
  proTitle: Record<string, string>;
  proMessage: Record<string, string>;
}
