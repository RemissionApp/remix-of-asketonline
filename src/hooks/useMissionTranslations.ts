import { useTranslations } from '@/hooks/useTranslations';
import { translations } from '@/i18n/translations';
import { MissionTranslations } from '@/i18n/types/translationTypes';
import { MissionRequirement } from '@/types';

export const useMissionTranslations = () => {
  const { t } = useTranslations();
  
  const getMissionTranslation = (missionId: string): MissionTranslations | null => {
    const missionTranslations = t?.missions;
    if (!missionTranslations || !missionTranslations[missionId]) {
      // Fallback to Russian if translation not found
      const fallbackTranslations = translations.ru?.missions;
      return fallbackTranslations?.[missionId] || null;
    }
    return missionTranslations[missionId];
  };

  const getTranslatedMissionTitle = (missionId: string, fallbackTitle?: string): string => {
    const translation = getMissionTranslation(missionId);
    return translation?.title || fallbackTitle || missionId;
  };

  const getTranslatedMissionDescription = (missionId: string, fallbackDescription?: string): string => {
    const translation = getMissionTranslation(missionId);
    return translation?.description || fallbackDescription || '';
  };

  const getTranslatedMissionRequirements = (missionId: string, fallbackRequirements?: MissionRequirement[] | string[]): string[] => {
    const translation = getMissionTranslation(missionId);
    if (translation?.requirements) {
      return translation.requirements;
    }
    
    // Handle fallback - convert MissionRequirement[] to string[] if needed
    if (!fallbackRequirements) return [];
    
    if (typeof fallbackRequirements[0] === 'string') {
      return fallbackRequirements as string[];
    } else {
      // Convert MissionRequirement[] to string[]
      return (fallbackRequirements as any[]).map((req: any) => 
        typeof req === 'string' ? req : req.type || req.toString()
      );
    }
  };

  const getTranslatedDailyQuestion = (missionId: string, day: number, fallbackQuestion?: string): string => {
    const translation = getMissionTranslation(missionId);
    return translation?.dailyQuestions?.[day] || fallbackQuestion || '';
  };

  const getTranslatedChoiceEvent = (missionId: string, eventId: string) => {
    const translation = getMissionTranslation(missionId);
    return translation?.choiceEvents?.[eventId] || null;
  };

  const getTranslatedMilestoneReward = (missionId: string, day: number, fallbackMessage?: string): string => {
    const translation = getMissionTranslation(missionId);
    return translation?.milestoneRewards?.[day] || fallbackMessage || '';
  };

  return {
    getMissionTranslation,
    getTranslatedMissionTitle,
    getTranslatedMissionDescription,
    getTranslatedMissionRequirements,
    getTranslatedDailyQuestion,
    getTranslatedChoiceEvent,
    getTranslatedMilestoneReward,
  };
};