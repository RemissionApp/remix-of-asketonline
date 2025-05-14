
import { useAppStore } from '@/store/useAppStore';
import { UniverseQuestion } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getUniverseResponse } from '@/utils/universeMessages';

export const useUniverseQuestions = () => {
  const setActiveQuestions = useAppStore(state => state.setActiveQuestions);
  const activeQuestions = useAppStore(state => state.activeQuestions);
  const universeQuestions = useAppStore(state => state.universeQuestions);
  const setUniverseQuestions = useAppStore(state => state.setUniverseQuestions);
  
  // Ask a question to the universe
  const askUniverse = async (question: string): Promise<UniverseQuestion> => {
    // Generate a response to the question
    const answer = await getUniverseResponse(question);
    
    // Create a new question object
    const newQuestion: UniverseQuestion = {
      id: uuidv4(),
      question,
      answer,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString()
    };
    
    // Add to existing questions
    setUniverseQuestions([...universeQuestions, newQuestion]);
    setActiveQuestions([...activeQuestions, newQuestion]);
    
    return newQuestion;
  };
  
  return {
    activeQuestions,
    universeQuestions,
    askUniverse
  };
};
