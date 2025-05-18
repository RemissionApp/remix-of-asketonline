
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { AffirmationPracticeModal } from './AffirmationPracticeModal';

interface Affirmation {
  id: number;
  text: string;
  instruction: string;
  action: string;
  image: string;
  categories: string[];
}

interface AffirmationCardProps {
  affirmation: Affirmation;
  language: string;
}

export const AffirmationCard: React.FC<AffirmationCardProps> = ({ affirmation, language }) => {
  const [open, setOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const { userProfile } = useAppStore();
  
  const instructionLabel = language === 'ru' ? 'Инструкция' : 
                          language === 'es' ? 'Instrucción' : 'Instruction';
  
  const actionLabel = language === 'ru' ? 'Действие' : 
                     language === 'es' ? 'Acción' : 'Action';
  
  const favoriteText = language === 'ru' ? (favorite ? 'Убрать из избранного' : 'Добавить в избранное') : 
                      language === 'es' ? (favorite ? 'Eliminar de favoritos' : 'Añadir a favoritos') : 
                      (favorite ? 'Remove from favorites' : 'Add to favorites');
  
  const practiceText = language === 'ru' ? 'Практиковать' : 
                      language === 'es' ? 'Practicar' : 'Practice';
  
  const toggleFavorite = () => {
    setFavorite(!favorite);
    // In a real app, you would save this to user preferences
  };
  
  return (
    <Card className="w-full backdrop-blur-sm bg-cosmic-dark/80 border-cosmic-accent/30 hover:border-cosmic-accent/50 transition-all">
      <div className="relative overflow-hidden">
        <img 
          src={affirmation.image} 
          alt={affirmation.text}
          className="w-full h-40 object-cover" 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-4">
          <CardTitle className="text-white px-6 text-lg text-shadow">{affirmation.text}</CardTitle>
        </div>
      </div>
      
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-center text-cosmic-accent border-t border-b border-cosmic-accent/20 rounded-none h-12"
          >
            {open ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
            {open 
              ? (language === 'ru' ? 'Скрыть детали' : language === 'es' ? 'Ocultar detalles' : 'Hide details')
              : (language === 'ru' ? 'Показать детали' : language === 'es' ? 'Mostrar detalles' : 'Show details')
            }
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="mb-4">
              <h3 className="text-cosmic-accent mb-1 text-sm font-medium">{instructionLabel}:</h3>
              <p className="text-white/80 text-sm">{affirmation.instruction}</p>
            </div>
            
            <div>
              <h3 className="text-cosmic-accent mb-1 text-sm font-medium">{actionLabel}:</h3>
              <p className="text-white/80 text-sm">{affirmation.action}</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-0 pb-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
              onClick={toggleFavorite}
            >
              {favoriteText}
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="bg-gradient-to-r from-purple-500/80 to-indigo-500/80 hover:from-purple-500 hover:to-indigo-500"
              onClick={() => setIsPracticeOpen(true)}
            >
              {practiceText}
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
      
      <AffirmationPracticeModal 
        affirmation={affirmation}
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
        language={language}
      />
    </Card>
  );
};
