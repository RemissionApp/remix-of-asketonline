
import { useAppStore } from '@/store/useAppStore';
import { UniverseQuestion } from '@/types';
import { useState } from 'react';

export const useUniverseQuestions = () => {
  const { activeQuestions, setActiveQuestions, universeQuestions, setUniverseQuestions } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askUniverse = async (question: string): Promise<UniverseQuestion> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate asking the universe
      const responses = [
        "The universe hears your question. Be patient for your answer.",
        "Look within yourself for the answer you seek.",
        "The stars align in your favor. Your question will be answered soon.",
        "The path is unclear, but time will bring clarity.",
        "The answer you seek is already within you.",
      ];
      
      // Generate a random response
      const randomIndex = Math.floor(Math.random() * responses.length);
      const answer = responses[randomIndex];
      
      // Store the question and answer
      const newQuestion: UniverseQuestion = {
        id: Math.random().toString(),
        question,
        answer,
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };
      
      setActiveQuestions([newQuestion, ...activeQuestions]);
      setUniverseQuestions([newQuestion, ...universeQuestions]);
      
      return newQuestion;
    } catch (err: any) {
      console.error("Error asking universe:", err);
      setError(err.message || "Failed to ask universe");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    askUniverse,
    activeQuestions,
    loading,
    error
  };
};
