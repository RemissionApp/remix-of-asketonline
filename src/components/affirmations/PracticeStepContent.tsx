import React from 'react';
import { ChevronRight, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PracticeStepContentProps {
  instruction: string;
  visualGuide: string;
  guideImage: string;
  language: string;
  affirmationText?: string;
  isStep3?: boolean;
  onPlayAffirmation?: () => void;
  isGeneratingVoice?: boolean;
  isPlayingVoice?: boolean;
}

export const PracticeStepContent: React.FC<PracticeStepContentProps> = ({
  instruction,
  visualGuide,
  guideImage,
  language,
  affirmationText,
  isStep3 = false,
  onPlayAffirmation,
  isGeneratingVoice = false,
  isPlayingVoice = false,
}) => {
  const visualGuideLabel =
    language === 'ru'
      ? 'Визуальное руководство: '
      : language === 'es'
        ? 'Guía visual: '
        : 'Visual guide: ';

  const universeVoiceLabel =
    language === 'ru'
      ? 'Голос Вселенной'
      : language === 'es'
        ? 'Voz del Universo'
        : 'Voice of the Universe';

  const playVoiceLabel =
    language === 'ru'
      ? 'Слушать голос вселенной'
      : language === 'es'
        ? 'Escuchar la voz del universo'
        : 'Listen to the voice of the universe';

  return (
    <div className="mt-6 space-y-4">
      <div className="bg-cosmic-dark/80 rounded-md p-4 border border-cosmic-accent/20">
        <div className="flex flex-col md:flex-row gap-4 items-start mb-4">
          <div className="flex-shrink-0">
            <img
              src={guideImage}
              alt="Visual practice guide"
              className="w-32 h-32 object-cover rounded-lg border border-cosmic-accent/30"
            />
          </div>
          <div className="flex-1">
            <p className="text-white/90">{instruction}</p>
          </div>
        </div>

        {/* Voice of Universe button for step 3 */}
        {isStep3 && affirmationText && onPlayAffirmation && (
          <div className="mb-4 p-4 bg-gradient-to-r from-cosmic-accent/20 to-purple-600/20 border border-cosmic-accent/40 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-cosmic-accent font-medium text-sm mb-1">
                  {universeVoiceLabel}
                </h4>
                <p className="text-white/80 text-sm italic mb-3">
                  "{affirmationText}"
                </p>
              </div>
              <Button
                onClick={onPlayAffirmation}
                disabled={isGeneratingVoice || isPlayingVoice}
                className="flex items-center gap-2 bg-cosmic-accent hover:bg-cosmic-accent/90 text-white"
              >
                {isGeneratingVoice ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlayingVoice ? (
                  <Volume2 className="h-4 w-4 animate-pulse" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {isGeneratingVoice 
                    ? (language === 'ru' ? 'Генерация...' : language === 'es' ? 'Generando...' : 'Generating...')
                    : isPlayingVoice 
                    ? (language === 'ru' ? 'Воспроизведение...' : language === 'es' ? 'Reproduciendo...' : 'Playing...')
                    : playVoiceLabel}
                </span>
              </Button>
            </div>
          </div>
        )}

        <div className="bg-purple-900/30 border border-purple-500/30 rounded p-3 flex items-start">
          <div className="bg-purple-500 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
            <ChevronRight size={12} />
          </div>
          <p className="text-purple-200 text-sm">
            <span className="font-medium">{visualGuideLabel}</span>
            {visualGuide}
          </p>
        </div>
      </div>
    </div>
  );
};
