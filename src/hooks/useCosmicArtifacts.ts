import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CosmicArtifactData {
  id: string;
  user_id: string;
  artifact_id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  effects: string[];
  obtained_from_mission?: string;
  obtained_at: string;
  is_active: boolean;
}

export const useCosmicArtifacts = () => {
  const queryClient = useQueryClient();

  const { data: artifacts, isLoading } = useQuery({
    queryKey: ['cosmic-artifacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cosmic_artifacts')
        .select('*')
        .order('obtained_at', { ascending: false });

      if (error) throw error;
      return data as CosmicArtifactData[];
    },
  });

  const addArtifactMutation = useMutation({
    mutationFn: async ({
      artifactId,
      name,
      description,
      type,
      rarity,
      effects,
      obtainedFromMission
    }: {
      artifactId: string;
      name: string;
      description: string;
      type: string;
      rarity: string;
      effects: string[];
      obtainedFromMission?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('cosmic_artifacts')
        .insert({
          user_id: user.id,
          artifact_id: artifactId,
          name,
          description,
          type,
          rarity,
          effects: effects as any,
          obtained_from_mission: obtainedFromMission,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cosmic-artifacts'] });
    },
  });

  const toggleArtifactMutation = useMutation({
    mutationFn: async ({ artifactId, isActive }: { artifactId: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('cosmic_artifacts')
        .update({ is_active: isActive })
        .eq('artifact_id', artifactId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cosmic-artifacts'] });
    },
  });

  const activeArtifacts = artifacts?.filter(a => a.is_active) || [];
  const artifactsByRarity = artifacts?.reduce((acc, artifact) => {
    acc[artifact.rarity] = (acc[artifact.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return {
    artifacts,
    isLoading,
    addArtifact: addArtifactMutation.mutate,
    isAdding: addArtifactMutation.isPending,
    toggleArtifact: toggleArtifactMutation.mutate,
    isToggling: toggleArtifactMutation.isPending,
    activeArtifacts,
    artifactsByRarity,
  };
};