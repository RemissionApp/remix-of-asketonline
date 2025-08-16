import { Pact } from '@/types';

export interface PactsState {
  pacts: Pact[];
}

export interface AddPactParams {
  title: string;
  duration: number;
  reward?: string;
  type?: string;
}
