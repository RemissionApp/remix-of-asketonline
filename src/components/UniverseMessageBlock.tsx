
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { generateUniverseAnswer } from '@/utils/universeMessages';

export const UniverseMessageBlock: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { language } = useAppStore();
  const navigate = useNavigate();

  // Translations for button text and loading states
  const moreDetailsText = {
    ru: 'Подробнее',
    en: 'More Details',
    es: 'Más Detalles',
  }[language] || 'More Details';

  const loadingText = {
    ru: 'Соединяемся с Вселенной...',
    en: 'Connecting with the Universe...',
    es: 'Conectando con el Universo...',
  }[language] || 'Connecting with the Universe...';

  // Fetch message from the universe
  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true);
      try {
        // Default daily wisdom question based on language
        const question = language === 'ru' ? 'Какая мудрость дня для меня сегодня?' : 
                        language === 'es' ? '¿Cuál es la sabiduría del día para mí hoy?' : 
                        'What is today\'s wisdom for me?';
        
        const universeMessage = await generateUniverseAnswer(question);
        setMessage(universeMessage);
      } catch (error) {
        console.error('Error fetching universe message:', error);
        // Fallback message if there's an error
        setMessage(language === 'ru' ? 'Звезды молчат сегодня. Загляни позже.' : 
                  language === 'es' ? 'Las estrellas están en silencio hoy. Vuelve más tarde.' : 
                  'The stars are silent today. Check back later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [language]);

  const handleMoreDetails = () => {
    // Navigate to the universe page for more details
    navigate('/universe');
  };

  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto">
      <h3 className="text-cosmic-gold/90 text-center mb-2 text-lg font-medium">
        {language === 'ru' ? 'Послание Вселенной' : 
         language === 'es' ? 'Mensaje del Universo' : 
         'Message from the Universe'}
      </h3>
      
      {loading ? (
        <p className="text-cosmic-accent/80 italic text-center">{loadingText}</p>
      ) : (
        <p className="cosmic-gradient-text text-lg italic font-serif leading-relaxed text-center">
          {message}
        </p>
      )}
      
      <div className="flex justify-center mt-3">
        <Button 
          onClick={handleMoreDetails}
          variant="outline" 
          className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {moreDetailsText}
        </Button>
      </div>
    </div>
  );
};
