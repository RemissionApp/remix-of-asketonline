import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { persistentStorage } from '@/utils/persistentStorage';
import { Mission } from '@/types';

interface MissionStateCache {
  currentDay: number;
  lastSyncTime: number;
  isCompleted: boolean;
  progressData: Record<number, any>;
  choicesData: Record<string, any>;
  reflectionsData: Record<number, any>;
}

interface PersistentMissionState {
  state: MissionStateCache;
  isLoading: boolean;
  isSaving: boolean;
  isOnline: boolean;
  lastSyncTime: Date | null;
  updateState: (updates: Partial<MissionStateCache>) => Promise<void>;
  forcSync: () => Promise<void>;
  clearCache: () => Promise<void>;
}

const STORAGE_KEY_PREFIX = 'mission_state_';
const SYNC_INTERVAL = 30000; // 30 seconds
const OFFLINE_RETRY_INTERVAL = 5000; // 5 seconds

export const usePersistentMissionState = (mission: Mission): PersistentMissionState => {
  const { user } = useAppStore();
  const [state, setState] = useState<MissionStateCache>({
    currentDay: 1,
    lastSyncTime: 0,
    isCompleted: false,
    progressData: {},
    choicesData: {},
    reflectionsData: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  const syncTimeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const pendingUpdatesRef = useRef<Partial<MissionStateCache>[]>([]);

  const storageKey = `${STORAGE_KEY_PREFIX}${mission.id}`;

  // Save specific updates to database
  const saveToDatabase = useCallback(async (updates: Partial<MissionStateCache>) => {
    if (!user?.id || !isOnline) return;

    try {
      // Save progress updates
      if (updates.progressData) {
        for (const [dayStr, progressData] of Object.entries(updates.progressData)) {
          const dayNumber = parseInt(dayStr);
          const { error } = await supabase
            .from('mission_progress_detailed')
            .upsert({
              user_id: user.id,
              mission_id: mission.id,
              day_number: dayNumber,
              completed: progressData.completed,
              completed_at: progressData.completedAt,
              data: progressData.data || {},
            });
          
          if (error) throw error;
        }
      }

      // Save choice updates
      if (updates.choicesData) {
        for (const [eventId, choiceData] of Object.entries(updates.choicesData)) {
          const { error } = await supabase
            .from('mission_choices')
            .upsert({
              user_id: user.id,
              mission_id: mission.id,
              choice_event_id: eventId,
              choice_id: choiceData.choiceId,
              consequences: choiceData.consequences || [],
            });
          
          if (error) throw error;
        }
      }

      // Save reflection updates
      if (updates.reflectionsData) {
        for (const [dayStr, reflectionData] of Object.entries(updates.reflectionsData)) {
          const dayNumber = parseInt(dayStr);
          const { error } = await supabase
            .from('daily_reflections')
            .upsert({
              user_id: user.id,
              mission_id: mission.id,
              day_number: dayNumber,
              question: reflectionData.question,
              answer: reflectionData.answer,
              reflection_type: reflectionData.reflectionType || 'text',
            });
          
          if (error) throw error;
        }
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  }, [user?.id, mission.id, isOnline]);

  // Sync with database
  const syncWithDatabase = useCallback(async () => {
    if (!user?.id || !isOnline) return;

    try {
      // Load progress data
      const { data: progressData, error: progressError } = await supabase
        .from('mission_progress_detailed')
        .select('*')
        .eq('user_id', user.id)
        .eq('mission_id', mission.id)
        .order('day_number', { ascending: true });

      if (progressError) throw progressError;

      // Load choices data
      const { data: choicesData, error: choicesError } = await supabase
        .from('mission_choices')
        .select('*')
        .eq('user_id', user.id)
        .eq('mission_id', mission.id);

      if (choicesError) throw choicesError;

      // Load reflections data
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from('daily_reflections')
        .select('*')
        .eq('user_id', user.id)
        .eq('mission_id', mission.id);

      if (reflectionsError) throw reflectionsError;

      // Build state from DB data
      const progressDataMap: Record<number, any> = {};
      let currentDay = 1;
      let isCompleted = false;

      progressData?.forEach(progress => {
        progressDataMap[progress.day_number] = {
          completed: progress.completed,
          completedAt: progress.completed_at,
          data: progress.data,
        };
        
        if (progress.completed) {
          currentDay = Math.max(currentDay, progress.day_number + 1);
        }
      });

      // Check if mission is fully completed
      isCompleted = currentDay > mission.duration;

      const choicesDataMap: Record<string, any> = {};
      choicesData?.forEach(choice => {
        choicesDataMap[choice.choice_event_id] = {
          choiceId: choice.choice_id,
          consequences: choice.consequences,
          chosenAt: choice.chosen_at,
        };
      });

      const reflectionsDataMap: Record<number, any> = {};
      reflectionsData?.forEach(reflection => {
        reflectionsDataMap[reflection.day_number] = {
          question: reflection.question,
          answer: reflection.answer,
          reflectionType: reflection.reflection_type,
        };
      });

      const newState: MissionStateCache = {
        currentDay,
        lastSyncTime: Date.now(),
        isCompleted,
        progressData: progressDataMap,
        choicesData: choicesDataMap,
        reflectionsData: reflectionsDataMap,
      };

      setState(newState);
      setLastSyncTime(new Date());
      
      // Save to local storage
      localStorage.setItem(storageKey, JSON.stringify(newState));

      // Request persistent storage
      await persistentStorage.request();

    } catch (error) {
      console.error('Error syncing with database:', error);
      throw error;
    }
  }, [user?.id, mission.id, mission.duration, isOnline, storageKey]);

  // Force sync function
  const forceSync = useCallback(async () => {
    if (!isOnline) return;

    try {
      // Process any pending updates first
      if (pendingUpdatesRef.current.length > 0) {
        for (const update of pendingUpdatesRef.current) {
          await saveToDatabase(update);
        }
        pendingUpdatesRef.current = [];
      }

      // Sync with database
      await syncWithDatabase();
    } catch (error) {
      console.error('Error during force sync:', error);
    }
  }, [isOnline, saveToDatabase, syncWithDatabase]);

  // Load initial state from local storage and DB
  const loadInitialState = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    
    try {
      // Try to load from local storage first for instant UI
      const cachedData = localStorage.getItem(storageKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData) as MissionStateCache;
          setState(parsed);
          setLastSyncTime(new Date(parsed.lastSyncTime));
        } catch (error) {
          console.warn('Failed to parse cached mission state:', error);
        }
      }

      // Then sync with database
      await syncWithDatabase();
    } catch (error) {
      console.error('Error loading initial mission state:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, mission.id, storageKey, syncWithDatabase]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync when coming back online
      forceSync();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [forceSync]);

  // Update state with auto-save
  const updateState = useCallback(async (updates: Partial<MissionStateCache>) => {
    if (!user?.id) return;

    setIsSaving(true);
    
    try {
      // Update local state immediately
      const newState = { ...state, ...updates, lastSyncTime: Date.now() };
      setState(newState);
      setLastSyncTime(new Date());

      // Save to local storage immediately
      localStorage.setItem(storageKey, JSON.stringify(newState));

      if (isOnline) {
        // Save to database immediately if online
        await saveToDatabase(updates);
      } else {
        // Queue updates for when we come back online
        pendingUpdatesRef.current.push(updates);
      }
    } catch (error) {
      console.error('Error updating mission state:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [state, user?.id, isOnline, storageKey, saveToDatabase]);

  // Clear local cache
  const clearCache = useCallback(async () => {
    localStorage.removeItem(storageKey);
    setState({
      currentDay: 1,
      lastSyncTime: 0,
      isCompleted: false,
      progressData: {},
      choicesData: {},
      reflectionsData: {},
    });
    setLastSyncTime(null);
  }, [storageKey]);

  // Auto-sync setup
  useEffect(() => {
    if (!isOnline) return;

    // Set up periodic sync
    syncTimeoutRef.current = setInterval(() => {
      if (isOnline && !isSaving) {
        syncWithDatabase().catch(console.error);
      }
    }, SYNC_INTERVAL);

    return () => {
      if (syncTimeoutRef.current) {
        clearInterval(syncTimeoutRef.current);
      }
    };
  }, [isOnline, isSaving, syncWithDatabase]);

  // Retry mechanism for offline updates
  useEffect(() => {
    if (isOnline && pendingUpdatesRef.current.length > 0) {
      retryTimeoutRef.current = setTimeout(() => {
        forceSync();
      }, OFFLINE_RETRY_INTERVAL);
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [isOnline, forceSync]);

  // Load initial state on mount
  useEffect(() => {
    loadInitialState();
  }, [loadInitialState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) clearInterval(syncTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  return {
    state,
    isLoading,
    isSaving,
    isOnline,
    lastSyncTime,
    updateState,
    forcSync: forceSync,
    clearCache,
  };
};