// Request and response types for the horoscope API

export interface HoroscopeRequest {
  sign: string;
  language: string;
  detailed?: boolean;
  birthDate?: string;
}

export interface HoroscopeResponse {
  success: boolean;
  data?: {
    description: string;
    sections?: {
      general_atmosphere: string;
      work_finance: string;
      love_relationships: string;
      health_wellbeing: string;
      daily_advice: string;
    };
    lucky_number?: string;
    lucky_time?: string;
    color?: string;
    mood?: string;
  };
  error?: string;
}
