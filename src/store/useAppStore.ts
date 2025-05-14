import { create } from 'zustand';
import { Pact, UniverseQuestion, UserProfile, SpiritualRank, Achievement, Mission } from '@/types';
import { generateUniverseAnswer } from '@/utils/universeMessages';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

type AppLanguage = 'ru' | 'en' | 'es';

// Update the type definition to include 'comparison' and 'meditation'
type ActiveScreen = 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation' | 'login' | 'signup';

interface AppState {
  pacts: Pact[];
  activeQuestions: UniverseQuestion[];
  dailyQuote: string;
  userProfile: UserProfile;
  user: any | null;
  loading: boolean;
  
  addPact: (pact: Omit<Pact, 'id' | 'createdAt' | 'days'>) => Promise<void>;
  markDayComplete: (pactId: string) => Promise<void>;
  askUniverse: (question: string) => Promise<UniverseQuestion>;
  setActiveScreen: (screen: ActiveScreen) => void;
  activeScreen: ActiveScreen;
  onboardingComplete: boolean;
  setOnboardingComplete: (completed: boolean) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  syncPactsWithCurrentDate: () => Promise<void>;
  
  // Auth methods - Update signIn return type to Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Data loading methods
  loadUserProfile: () => Promise<void>;
  loadPacts: () => Promise<void>;
  loadUniverseQuestions: () => Promise<void>;
  
  // Existing functions for gamification
  addEnergyPoints: (points: number) => Promise<void>;
  checkRankProgress: () => SpiritualRank;
  unlockAchievement: (achievementId: string) => Promise<void>;
  assignMission: () => Promise<void>;
  completeMission: () => Promise<void>;
  
  // New functions for PRO features
  upgradeToPro: () => Promise<void>;
  cancelProSubscription: () => Promise<void>;
}

// Example quotes
const quotes = [
  "Ты отказываешься от малого, чтобы вместить великое.",
  "В искушении ты проверяешь намерение. Иди до конца.",
  "Каждый день твоей аскезы — нить, соединяющая тебя с высшим.",
  "Истинная сила не в овладении, а в осознанном отказе.",
  "Отбрось то, что тянет тебя вниз, и воспари над обыденностью.",
  "Твоя воля — это мост между намерением и реальностью.",
  "Ограничивая себя внешне, ты расширяешься внутренне."
];

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: 'first-pact',
    title: 'Первый договор',
    description: 'Заключите свой первый договор с Вселенной',
    icon: 'scroll',
    unlocked: false
  },
  {
    id: '7-days-streak',
    title: '7 дней подряд',
    description: 'Соблюдайте аскезу 7 дней подряд',
    icon: 'calendar',
    unlocked: false
  },
  {
    id: '30-days-streak',
    title: '30 дней подряд',
    description: 'Соблюдайте аскезу 30 дней подряд',
    icon: 'award',
    unlocked: false
  },
  {
    id: 'first-question',
    title: 'Первый р����зговор',
    description: 'Задайте перв��й вопрос Вселенной',
    icon: 'message-square',
    unlocked: false
  }
];

// Available missions
const availableMissions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Первые шаги аскета',
    description: 'Соблюдайте свою первую аскезу три дня подряд и получите энергетические очки',
    requirements: ['Соблюдать аскезу 3 дня подряд'],
    reward: {
      energyPoints: 30
    },
    completed: false
  },
  {
    id: 'mission-2',
    title: 'Разговор с Вселенной',
    description: 'Задайте три вопроса Вселенной и получите дополнительную мудрость',
    requirements: ['Задать 3 вопроса Вселенной'],
    reward: {
      energyPoints: 50,
      achievement: 'universe-seeker'
    },
    completed: false
  }
];

// Rank requirements
const rankRequirements = {
  seeker: 0,
  pilgrim: 10,
  warrior: 30,
  master: 90,
  enlightened: 365
};

// Helper function to get date string in YYYY-MM-DD format
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to compare two dates (ignoring time)
const isSameDay = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] === date2.split('T')[0];
};

// Helper function to check if date1 is before or equal to date2
const isDateBeforeOrEqual = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] <= date2.split('T')[0];
};

export const useAppStore = create<AppState>()((set, get) => ({
  pacts: [],
  activeQuestions: [],
  dailyQuote: quotes[Math.floor(Math.random() * quotes.length)],
  userProfile: {
    name: 'Искатель',
    totalDays: 0,
    energyPoints: 0,
    goal: 'Познать свою истинную силу',
    isPro: false,
    rank: 'seeker',
    achievements: [...defaultAchievements]
  },
  activeScreen: 'welcome',
  onboardingComplete: false,
  language: 'ru',
  user: null,
  loading: false,
  
  // Set language
  setLanguage: (language) => set({ language }),
  
  // Set onboarding status
  setOnboardingComplete: (completed) => set({ onboardingComplete: completed }),
  
  // Set active screen
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  
  // Update user profile
  updateUserProfile: async (profileData) => {
    const { user } = get();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему для обновления профиля",
        variant: "destructive"
      });
      return;
    }
    
    set({ loading: true });
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          birth_date: profileData.birthDate,
          goal: profileData.goal,
          total_days: profileData.totalDays,
          energy_points: profileData.energyPoints,
          rank: profileData.rank
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      set((state) => ({
        userProfile: { ...state.userProfile, ...profileData }
      }));
      
      toast({
        title: "Профиль обновлен",
        description: "Ваш профиль был успешно обновлен"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить профиль",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // Add a new pact
  addPact: async (pact) => {
    const { user, loadPacts } = get();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "��ы должны войти в систему для создания аскезы",
        variant: "destructive"
      });
      return;
    }
    
    set({ loading: true });
    
    try {
      // Insert the new pact
      const { data: newPact, error: pactError } = await supabase
        .from('pacts')
        .insert({
          user_id: user.id,
          title: pact.title,
          duration: pact.duration,
          reward: pact.reward,
          status: 'active'
        })
        .select()
        .single();
      
      if (pactError) throw pactError;
      
      // Create pact days
      const pactDays = Array.from({ length: pact.duration }, (_, i) => ({
        pact_id: newPact.id,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false
      }));
      
      const { error: daysError } = await supabase
        .from('pact_days')
        .insert(pactDays);
      
      if (daysError) throw daysError;
      
      // Check if this is the first pact for achievement
      const { data: pactCount } = await supabase
        .from('pacts')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
      
      if (pactCount && pactCount.length === 1) {
        // This is the first pact, unlock achievement
        await get().unlockAchievement('first-pact');
        // Add bonus energy points
        await get().addEnergyPoints(20);
      }
      
      // Reload pacts
      await loadPacts();
      
      toast({
        title: "Аскеза создана",
        description: "Ваша аскеза была успешно создана"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать аскезу",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // Mark a day as complete
  markDayComplete: async (pactId) => {
    const { user, loadPacts, addEnergyPoints, checkRankProgress, userProfile } = get();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему для отметки дня",
        variant: "destructive"
      });
      return;
    }
    
    set({ loading: true });
    
    try {
      // Find the first incomplete day for this pact
      const { data: days, error: daysError } = await supabase
        .from('pact_days')
        .select('*')
        .eq('pact_id', pactId)
        .eq('completed', false)
        .order('date', { ascending: true })
        .limit(1);
      
      if (daysError) throw daysError;
      
      if (days && days.length > 0) {
        const day = days[0];
        
        // Mark the day as completed
        const { error: updateError } = await supabase
          .from('pact_days')
          .update({ completed: true })
          .eq('id', day.id);
        
        if (updateError) throw updateError;
        
        // Add energy points
        await addEnergyPoints(10);
        
        // Check if all days are completed for this pact
        const { data: remainingDays, error: remainingError } = await supabase
          .from('pact_days')
          .select('id')
          .eq('pact_id', pactId)
          .eq('completed', false);
        
        if (remainingError) throw remainingError;
        
        if (remainingDays && remainingDays.length === 0) {
          // All days are completed, mark the pact as completed
          const { error: pactError } = await supabase
            .from('pacts')
            .update({ status: 'completed' })
            .eq('id', pactId);
          
          if (pactError) throw pactError;
        }
        
        // Check for streak achievements
        const { data: completedDays, error: streakError } = await supabase
          .from('pact_days')
          .select('id')
          .eq('pact_id', pactId)
          .eq('completed', true);
        
        if (streakError) throw streakError;
        
        const consecutiveDays = completedDays?.length || 0;
        
        // Check for 7-day streak achievement
        if (consecutiveDays >= 7) {
          await get().unlockAchievement('7-days-streak');
        }
        
        // Check for 30-day streak achievement
        if (consecutiveDays >= 30) {
          await get().unlockAchievement('30-days-streak');
        }
        
        // Update total days in profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('total_days')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        const newTotalDays = (profile.total_days || 0) + 1;
        
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ 
            total_days: newTotalDays,
          })
          .eq('id', user.id);
        
        if (updateProfileError) throw updateProfileError;
        
        // Check if rank needs to be updated
        const currentRank = userProfile.rank;
        const newRank = checkRankProgress();
        
        if (newRank !== currentRank) {
          // Rank has changed, update profile
          const { error: rankError } = await supabase
            .from('profiles')
            .update({ rank: newRank })
            .eq('id', user.id);
          
          if (rankError) throw rankError;
          
          // Add bonus for rank upgrade
          await addEnergyPoints(50);
          
          toast({
            title: "Новый ранг!",
            description: `Поздравляем! Вы достигли ранга ${newRank}`
          });
        }
        
        // Reload pacts to reflect changes
        await loadPacts();
        
        toast({
          title: "День отмечен",
          description: "День аскезы успешно отмечен как выполненный"
        });
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отметить день",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // Ask a question to the universe
  askUniverse: async (question: string) => {
    if (!question || question.trim().length < 3) {
      throw new Error('Question too short');
    }

    try {
      // Получаем ответ от нашей функции universe message
      const answer = await generateUniverseAnswer(question);
      
      // Создаем запись вопроса
      const id = Date.now().toString();
      const newQuestion = {
        id,
        question,
        answer,
        date: new Date().toISOString()
      };

      // Добавляем вопрос в хранилище
      set((state) => ({
        activeQuestions: [newQuestion, ...state.activeQuestions].slice(0, 20) // Ограничение до 20 вопросов
      }));

      return newQuestion;
    } catch (error) {
      console.error('Error in askUniverse:', error);
      throw error;
    }
  },
  
  // Sync pacts with current date
  syncPactsWithCurrentDate: async () => {
    const { user, loadPacts, addEnergyPoints, checkRankProgress, userProfile } = get();
    
    if (!user) return;
    
    set({ loading: true });
    
    try {
      const today = new Date();
      const todayString = getDateString(today);
      
      // Get all active pacts
      const { data: pacts, error: pactsError } = await supabase
        .from('pacts')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (pactsError) throw pactsError;
      
      if (!pacts || pacts.length === 0) {
        set({ loading: false });
        return;
      }
      
      let totalNewCompletedDays = 0;
      
      // For each pact, check for days that should be automatically marked as completed
      for (const pact of pacts) {
        const { data: days, error: daysError } = await supabase
          .from('pact_days')
          .select('id, date')
          .eq('pact_id', pact.id)
          .eq('completed', false)
          .lte('date', todayString);
        
        if (daysError) throw daysError;
        
        if (days && days.length > 0) {
          // Mark days as completed
          const dayIds = days.map(d => d.id);
          
          const { error: updateError } = await supabase
            .from('pact_days')
            .update({ completed: true })
            .in('id', dayIds);
          
          if (updateError) throw updateError;
          
          totalNewCompletedDays += days.length;
          
          // Check if all days are now completed
          const { data: remainingDays, error: remainingError } = await supabase
            .from('pact_days')
            .select('id')
            .eq('pact_id', pact.id)
            .eq('completed', false);
          
          if (remainingError) throw remainingError;
          
          if (remainingDays && remainingDays.length === 0) {
            // All days are completed, mark the pact as completed
            const { error: pactError } = await supabase
              .from('pacts')
              .update({ status: 'completed' })
              .eq('id', pact.id);
            
            if (pactError) throw pactError;
          }
        }
      }
      
      // If days were updated, update the user profile
      if (totalNewCompletedDays > 0) {
        // Update total days and add energy points
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('total_days, energy_points')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        const newTotalDays = (profile.total_days || 0) + totalNewCompletedDays;
        const newEnergyPoints = (profile.energy_points || 0) + (totalNewCompletedDays * 10);
        
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ 
            total_days: newTotalDays,
            energy_points: newEnergyPoints
          })
          .eq('id', user.id);
        
        if (updateProfileError) throw updateProfileError;
        
        // Check if rank needs to be updated
        const currentRank = userProfile.rank;
        const newRank = checkRankProgress();
        
        if (newRank !== currentRank) {
          // Rank has changed, update profile
          const { error: rankError } = await supabase
            .from('profiles')
            .update({ rank: newRank })
            .eq('id', user.id);
          
          if (rankError) throw rankError;
          
          // Add bonus for rank upgrade
          await addEnergyPoints(50);
          
          toast({
            title: "Новый ранг!",
            description: `Поздравляем! Вы достигли ранга ${newRank}`
          });
        }
      }
      
      // Reload pacts to reflect changes
      await loadPacts();
    } catch (error: any) {
      console.error("Error syncing pacts:", error);
    } finally {
      set({ loading: false });
    }
  },
  
  // Add energy points
  addEnergyPoints: async (points) => {
    const { user, userProfile } = get();
    
    if (!user) return;
    
    try {
      const newTotal = (userProfile.energyPoints || 0) + points;
      
      // Update in database
      const { error } = await supabase
        .from('profiles')
        .update({ energy_points: newTotal })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      set((state) => ({
        userProfile: {
          ...state.userProfile,
          energyPoints: newTotal
        }
      }));
    } catch (error) {
      console.error("Error adding energy points:", error);
    }
  },
  
  // Check rank progress
  checkRankProgress: () => {
    const { userProfile } = get();
    const { totalDays } = userProfile;
    
    if (totalDays >= rankRequirements.enlightened) return 'enlightened';
    if (totalDays >= rankRequirements.master) return 'master';
    if (totalDays >= rankRequirements.warrior) return 'warrior';
    if (totalDays >= rankRequirements.pilgrim) return 'pilgrim';
    return 'seeker';
  },
  
  // Unlock achievement
  unlockAchievement: async (achievementId) => {
    const { user, userProfile } = get();
    
    if (!user) return;
    
    try {
      // Check if achievement is already unlocked
      const achievementExists = userProfile.achievements.find(a => a.id === achievementId && a.unlocked);
      
      if (achievementExists) return; // Already unlocked
      
      // Find the achievement in the default list
      const achievement = defaultAchievements.find(a => a.id === achievementId);
      
      if (!achievement) return; // Achievement not found
      
      // Check if this achievement is already in the database
      const { data: existingAchievements, error: checkError } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_type', achievementId);
      
      if (checkError) throw checkError;
      
      if (!existingAchievements || existingAchievements.length === 0) {
        // Insert the achievement
        const { error } = await supabase
          .from('achievements')
          .insert({
            user_id: user.id,
            achievement_type: achievementId,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            unlocked_at: new Date().toISOString()
          });
        
        if (error) throw error;
      } else {
        // Update the existing achievement
        const { error } = await supabase
          .from('achievements')
          .update({ unlocked_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('achievement_type', achievementId);
        
        if (error) throw error;
      }
      
      // Add energy points for achievement
      await get().addEnergyPoints(20);
      
      // Update local state
      set((state) => {
        const updatedAchievements = state.userProfile.achievements.map(a => 
          a.id === achievementId 
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } 
            : a
        );
        
        return {
          userProfile: {
            ...state.userProfile,
            achievements: updatedAchievements
          }
        };
      });
      
      toast({
        title: "Достижение разблокировано!",
        description: achievement.title
      });
    } catch (error) {
      console.error("Error unlocking achievement:", error);
    }
  },
  
  // Assign mission
  assignMission: async () => {
    const { user, userProfile } = get();
    
    if (!user) return;
    
    try {
      // Check if user already has an active mission
      if (userProfile.activeMission) return;
      
      // Get all completed missions
      const { data: completedMissions, error: missionsError } = await supabase
        .from('missions')
        .select('title')
        .eq('user_id', user.id)
        .eq('completed', true);
      
      if (missionsError) throw missionsError;
      
      // Filter available missions that haven't been completed
      const completedTitles = completedMissions?.map(m => m.title) || [];
      const availableMissionsCopy = availableMissions.filter(
        m => !completedTitles.includes(m.title)
      );
      
      if (availableMissionsCopy.length === 0) return; // No available missions
      
      // Select a random mission
      const randomIndex = Math.floor(Math.random() * availableMissionsCopy.length);
      const selectedMission = { ...availableMissionsCopy[randomIndex] };
      
      // Save to database
      const { error } = await supabase
        .from('missions')
        .insert({
          user_id: user.id,
          title: selectedMission.title,
          description: selectedMission.description,
          requirements: selectedMission.requirements,
          reward: selectedMission.reward,
          completed: false
        });
      
      if (error) throw error;
      
      // Update local state
      set((state) => ({
        userProfile: {
          ...state.userProfile,
          activeMission: selectedMission
        }
      }));
    } catch (error) {
      console.error("Error assigning mission:", error);
    }
  },
  
  // Complete mission
  completeMission: async () => {
    const { user, userProfile } = get();
    
    if (!user || !userProfile.activeMission) return;
    
    try {
      const { reward } = userProfile.activeMission;
      
      // Mark mission as completed in database
      const { error } = await supabase
        .from('missions')
        .update({ completed: true })
        .eq('user_id', user.id)
        .eq('title', userProfile.activeMission.title);
      
      if (error) throw error;
      
      // Add energy points
      await get().addEnergyPoints(reward.energyPoints);
      
      // If mission gives an achievement, unlock it
      if (reward.achievement) {
        await get().unlockAchievement(reward.achievement);
      }
      
      // Update local state
      set((state) => ({
        userProfile: {
          ...state.userProfile,
          activeMission: undefined
        }
      }));
      
      toast({
        title: "Миссия выполнена!",
        description: `Вы получили ${reward.energyPoints} энергетических очков`
      });
    } catch (error) {
      console.error("Error completing mission:", error);
    }
  },
  
  // Upgrade to PRO - modified to fix state reference
  upgradeToPro: async (): Promise<void> => {
    // For demo purposes, just set isPro to true in the userProfile
    set(state => ({
      userProfile: {
        ...state.userProfile,
        isPro: true
      }
    }));
    
    // Persist to Supabase if connected
    const { user } = get();
    if (user) {
      try {
        const { error } = await supabase
          .from('subscriptions')
          .update({ is_pro: true })
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error upgrading to PRO:', error);
        }
      } catch (e) {
        console.error('Exception upgrading to PRO:', e);
      }
    }
  },
  
  // Cancel PRO subscription - fixed state reference
  cancelProSubscription: async (): Promise<void> => {
    // For demo purposes, just set isPro to false in the userProfile
    set(state => ({
      userProfile: {
        ...state.userProfile,
        isPro: false
      }
    }));
    
    // Persist to Supabase if connected
    const { user } = get();
    if (user) {
      try {
        const { error } = await supabase
          .from('subscriptions')
          .update({ is_pro: false })
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error cancelling PRO subscription:', error);
        }
      } catch (e) {
        console.error('Exception cancelling PRO subscription:', e);
      }
    }
  },
  
  // Authentication Methods - Update signIn method
  signIn: async (email, password) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      
      // Load user data
      await get().loadUserProfile();
      await get().loadPacts();
      await get().loadUniverseQuestions();
      
      const { userProfile } = get();
      
      toast({
        title: "Вход выполнен",
        description: "Вы успешно вошли в систему"
      });
      
      // Don't set activeScreen here - we'll handle navigation in the component
      // based on the profile data that's loaded
      
      return true; // Return true on success
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти в систему",
        variant: "destructive"
      });
      return false; // Return false on error
    } finally {
      set({ loading: false });
    }
  },
  
  signUp: async (email, password) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      
      toast({
        title: "Ре��истрация выполнена",
        description: "Ваш аккаунт был создан. Пожалуйста, проверьте вашу почту для подтверждения."
      });
      
      set({ activeScreen: 'onboarding' });
    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось создать аккаунт",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    set({ loading: true });
    
    try {
      await supabase.auth.signOut();
      
      set({ 
        user: null,
        pacts: [],
        activeQuestions: [],
        activeScreen: 'welcome'
      });
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка выхода",
        description: error.message || "Не удалось выйти из системы",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // Data loading methods
  loadUserProfile: async () => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      // Get profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('is_pro, subscription_end')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const isPro = subscription?.is_pro && 
        new Date(subscription.subscription_end) > new Date();
      
      // Get achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (achievementsError) throw achievementsError;
      
      // Map achievements to our app's format
      const mappedAchievements = defaultAchievements.map(defaultAch => {
        const foundAch = achievements?.find(a => a.achievement_type === defaultAch.id);
        return foundAch ? {
          id: defaultAch.id,
          title: defaultAch.title,
          description: defaultAch.description,
          icon: defaultAch.icon,
          unlocked: !!foundAch.unlocked_at,
          unlockedAt: foundAch.unlocked_at
        } : defaultAch;
      });
      
      // Get active mission
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (missionsError) throw missionsError;
      
      const activeMission = missions && missions.length > 0 ? {
        id: missions[0].id,
        title: missions[0].title,
        description: missions[0].description,
        requirements: missions[0].requirements as any,
        reward: missions[0].reward as any,
        completed: false
      } : undefined;
      
      // Update local state
      set({
        userProfile: {
          name: data.name,
          birthDate: data.birth_date ? new Date(data.birth_date) : undefined,
          totalDays: data.total_days,
          energyPoints: data.energy_points,
          goal: data.goal || 'Познать свою истинную силу',
          isPro: isPro,
          rank: data.rank,
          achievements: mappedAchievements,
          activeMission
        }
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  },
  
  loadPacts: async () => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      // Get all pacts
      const { data: pacts, error: pactsError } = await supabase
        .from('pacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (pactsError) throw pactsError;
      
      if (!pacts || pacts.length === 0) {
        set({ pacts: [] });
        return;
      }
      
      // For each pact, get its days
      const pactsWithDays = await Promise.all(pacts.map(async (pact) => {
        const { data: days, error: daysError } = await supabase
          .from('pact_days')
          .select('*')
          .eq('pact_id', pact.id)
          .order('date', { ascending: true });
        
        if (daysError) throw daysError;
        
        // Transform to our app's format
        return {
          id: pact.id,
          title: pact.title,
          duration: pact.duration,
          reward: pact.reward || '',
          status: pact.status as 'active' | 'completed' | 'broken',
          createdAt: pact.created_at,
          days: days?.map(d => ({
            date: d.date,
            completed: d.completed
          })) || []
        };
      }));
      
      // Update local state
      set({ pacts: pactsWithDays });
    } catch (error) {
      console.error("Error loading pacts:", error);
    }
  },
  
  loadUniverseQuestions: async () => {
    const { user } = get();
    
    if (!user) return;
    
    try {
      // Get all universe questions
      const { data, error } = await supabase
        .from('universe_questions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        set({ activeQuestions: [] });
        return;
      }
      
      // Transform to our app's format
      const questions: UniverseQuestion[] = data.map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        date: q.created_at
      }));
      
      // Update local state
      set({ activeQuestions: questions });
    } catch (error) {
      console.error("Error loading universe questions:", error);
    }
  }
}));
