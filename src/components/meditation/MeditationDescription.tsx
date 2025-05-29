
import React, { useState } from 'react';
import { Music, User, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MeditationDescriptionProps {
  description: string;
  backgroundMusic: string[];
  voiceOptions: string[];
  onMusicChange: (music: string) => void;
  onVoiceChange: (voice: string) => void;
}

export const MeditationDescription: React.FC<MeditationDescriptionProps> = ({
  description,
  backgroundMusic,
  voiceOptions,
  onMusicChange,
  onVoiceChange
}) => {
  const [selectedMusic, setSelectedMusic] = useState(backgroundMusic[0]);
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0]);
  const [feelings, setFeelings] = useState('');

  return (
    <div className="p-6 space-y-6">
      {/* Curator Message */}
      <div className="bg-cosmic-dark/40 backdrop-blur-sm border border-cosmic-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-cosmic-accent/20 flex items-center justify-center flex-shrink-0">
            <Leaf size={16} className="text-cosmic-accent" />
          </div>
          <div>
            <p className="text-white font-medium mb-2">Сообщение от куратора:</p>
            <p className="text-cosmic-secondary leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Background Music Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Music size={20} className="text-cosmic-accent" />
          <h3 className="text-white font-medium">Фоновая музыка</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {backgroundMusic.map((music) => (
            <Button
              key={music}
              variant={selectedMusic === music ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedMusic(music);
                onMusicChange(music);
              }}
              className={selectedMusic === music 
                ? "bg-cosmic-accent/20 border-cosmic-accent text-cosmic-accent" 
                : "border-cosmic-accent/40 text-cosmic-secondary hover:text-cosmic-accent"
              }
            >
              {music}
            </Button>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User size={20} className="text-cosmic-accent" />
          <h3 className="text-white font-medium">Голос</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {voiceOptions.map((voice) => (
            <Button
              key={voice}
              variant={selectedVoice === voice ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedVoice(voice);
                onVoiceChange(voice);
              }}
              className={selectedVoice === voice 
                ? "bg-cosmic-accent/20 border-cosmic-accent text-cosmic-accent" 
                : "border-cosmic-accent/40 text-cosmic-secondary hover:text-cosmic-accent"
              }
            >
              {voice}
            </Button>
          ))}
        </div>
      </div>

      {/* Feelings Journal */}
      <div className="space-y-3">
        <h3 className="text-white font-medium">Записать ощущения</h3>
        <Textarea
          placeholder="Как вы себя чувствуете? Что приходит в голову?"
          value={feelings}
          onChange={(e) => setFeelings(e.target.value)}
          className="bg-cosmic-dark/40 border-cosmic-accent/20 text-white placeholder:text-cosmic-secondary"
          rows={4}
        />
        <Button 
          size="sm" 
          className="bg-cosmic-accent/20 hover:bg-cosmic-accent/30 text-cosmic-accent border border-cosmic-accent/40"
        >
          Сохранить запись
        </Button>
      </div>
    </div>
  );
};
