
import { useAppStore } from '@/store/useAppStore';
import { Pact } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const usePacts = () => {
  const pacts = useAppStore(state => state.pacts);
  const setPacts = useAppStore(state => state.setPacts);
  
  // Add new pact
  const addPact = (pact: { title: string, duration: number, reward: string, status: string }) => {
    // Create a new pact with days array
    const now = new Date();
    const days = [];
    
    // Generate days for the pact duration
    for (let i = 0; i < pact.duration; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        completed: false
      });
    }
    
    const newPact: Pact = {
      id: uuidv4(),
      title: pact.title,
      duration: pact.duration,
      reward: pact.reward,
      status: pact.status as 'active' | 'completed' | 'broken',
      createdAt: new Date().toISOString(),
      days
    };
    
    setPacts([...pacts, newPact]);
  };
  
  // Mark a day complete for a specific pact
  const markDayComplete = (pactId: string) => {
    const updatedPacts = pacts.map(pact => {
      if (pact.id === pactId) {
        // Find today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        // Update the days array
        const updatedDays = pact.days.map(day => {
          if (day.date === today) {
            return { ...day, completed: true };
          }
          return day;
        });
        
        return { ...pact, days: updatedDays };
      }
      return pact;
    });
    
    setPacts(updatedPacts);
  };
  
  // Sync pacts with current date
  const syncPactsWithCurrentDate = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Update pacts status based on current date
    const updatedPacts = pacts.map(pact => {
      // Check if pact is still active
      const lastDay = pact.days[pact.days.length - 1].date;
      
      // If last day is before today and status is still active, mark as completed
      if (lastDay < today && pact.status === 'active') {
        // Check if all days are completed
        const allCompleted = pact.days.every(day => day.completed);
        return { ...pact, status: allCompleted ? 'completed' : 'broken' };
      }
      
      return pact;
    }) as Pact[]; // Add type assertion here
    
    setPacts(updatedPacts);
  };
  
  return {
    pacts,
    addPact,
    markDayComplete,
    syncPactsWithCurrentDate
  };
};
