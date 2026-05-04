// Stub: cosmic artifacts UI removed. Returning no-op surface to keep
// existing mission code (useEnhancedMissionState, useMissionState) compiling.
export const useCosmicArtifacts = () => ({
  artifacts: [] as any[],
  loading: false,
  saveArtifact: async (_artifact: any) => null,
  removeArtifact: async (_id: string) => null,
  addArtifact: async (_artifact: any) => null,
  refresh: async () => {},
});

export default useCosmicArtifacts;