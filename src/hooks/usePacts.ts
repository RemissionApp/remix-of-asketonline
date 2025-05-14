
import { useAppStore } from '@/store/useAppStore';
import { Pact } from '@/types';
import { useState } from 'react';

export const usePacts = () => {
  const { pacts, setPacts, userProfile, setUserProfile } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPact = (pactData: { title: string, duration: number, reward: string, status: string }) => {
    const newPact: Pact = {
      id: Math.random().toString(),
      title: pactData.title,
      duration: pactData.duration,
      reward: pactData.reward,
      status: pactData.status as 'active' | 'completed' | 'broken',
      createdAt: new Date().toISOString(),
      days: Array.from({ length: pactData.duration }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          completed: false
        };
      })
    };
    
    setPacts([...pacts, newPact]);
    
    // Increase user's energyPoints for creating a pact
    setUserProfile({
      ...userProfile,
      energyPoints: (userProfile.energyPoints || 0) + 5
    });
    
    return newPact;
  };
  
  const markDayComplete = (pactId: string) => {
    // Find the pact
    const pactIndex = pacts.findIndex(p => p.id === pactId);
    if (pactIndex === -1) return;
    
    const pact = pacts[pactIndex];
    
    // Find today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Find the day index that matches today
    const dayIndex = pact.days.findIndex(d => d.date === today);
    if (dayIndex === -1) return;
    
    // If day is already completed, do nothing
    if (pact.days[dayIndex].completed) return;
    
    // Clone the pact and update the day
    const updatedPact = { ...pact };
    updatedPact.days = [...pact.days];
    updatedPact.days[dayIndex] = { ...updatedPact.days[dayIndex], completed: true };
    
    // Update the pacts array
    const updatedPacts = [...pacts];
    updatedPacts[pactIndex] = updatedPact;
    
    setPacts(updatedPacts);
    
    // Increase user's energy points
    setUserProfile({
      ...userProfile,
      energyPoints: (userProfile.energyPoints || 0) + 10,
      totalDays: (userProfile.totalDays || 0) + 1
    });
  };
  
  const syncPactsWithCurrentDate = () => {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Update all active pacts
    const updatedPacts = pacts.map(pact => {
      if (pact.status !== 'active') return pact;
      
      // Check if today already exists in days
      const todayExists = pact.days.some(day => day.date === today);
      if (todayExists) return pact;
      
      // Add today to the days array
      const updatedDays = [...pact.days, { date: today, completed: false }];
      return { ...pact, days: updatedDays };
    });
    
    setPacts(updatedPacts);
  };

  return {
    pacts,
    addPact,
    markDayComplete,
    syncPactsWithCurrentDate,
    loading,
    error
  };
};
