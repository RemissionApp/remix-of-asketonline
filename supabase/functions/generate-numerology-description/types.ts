// Request and response types for the numerology API

export interface NumerologyRequest {
  matrixData: any;
  userId: string;
  readingId: string;
  language?: string;
}

export interface NumerologyResponse {
  success: boolean;
  description?: any;
  error?: string;
}