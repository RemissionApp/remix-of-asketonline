
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { PactOath } from '@/components/PactOath';
import MultiSelectWithCustomInput from '@/components/MultiSelectWithCustomInput';
import { usePacts } from '@/hooks/usePacts';

// Update the PactOath interface to match the expected props
interface PactOathProps {
  rejections?: string[];
  duration: number;
  onCreatePact: () => void;
}

const CreatePactPage: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveScreen } = useAppStore();
  const { addPact } = usePacts();
  const { t } = useTranslations();
  
  const [selectedRejections, setSelectedRejections] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showOath, setShowOath] = useState(false);
  
  const rejectionOptions = [
    'sugar',
    'phone_after_22',
    'cigarettes',
    'procrastination',
    'social_media',
    'alcohol',
    'junk_food'
  ];
  
  const durationOptions = [7, 14, 21, 30, 60, 90];
  
  const handleGoBack = () => {
    setActiveScreen('main');
    navigate('/main');
  };
  
  const handleRejectionChange = (values: string[]) => {
    setSelectedRejections(values);
  };
  
  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
  };
  
  const handleShowOath = () => {
    if (selectedDuration === 0 || !selectedRejections || selectedRejections.length === 0) {
      setError(t.createPact.errorMessage);
      return;
    }
    setShowOath(true);
  };
  
  const handleCreatePact = () => {
    // Validate form
    if (selectedDuration === 0 || !selectedRejections || selectedRejections.length === 0) {
      setError(t.createPact.errorMessage);
      return;
    }
    
    // Create title from rejections
    const title = selectedRejections.join(', ');
    
    // Add the pact
    addPact({
      title,
      duration: selectedDuration,
      reward: '',
      status: 'active'
    });
    
    // Navigate back to main screen
    navigate('/main');
    setActiveScreen('main');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={150} />
      
      {/* Header */}
      <div className="relative z-10 px-4 py-4 flex items-center">
        <button
          className="p-2 text-cosmic-accent"
          onClick={handleGoBack}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
          {t.createPact.title}
        </h1>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 max-w-lg mx-auto w-full">
        {!showOath ? (
          <div className="w-full animate-fade-in">
            <h2 className="text-2xl font-serif text-white mb-6 text-center">
              {t.createPact.subtitle}
            </h2>
            
            {error && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-serif text-cosmic-accent mb-2">
                {t.createPact.rejections}
              </h3>
              
              <MultiSelectWithCustomInput
                options={rejectionOptions}
                value={selectedRejections}
                onChange={handleRejectionChange}
              />
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-serif text-cosmic-accent mb-2">
                {t.createPact.duration}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {durationOptions.map((duration) => (
                  <button
                    key={duration}
                    className={`cosmic-button-sm ${selectedDuration === duration ? 'active' : ''}`}
                    onClick={() => handleDurationSelect(duration)}
                  >
                    {duration} {t.createPact.days}
                  </button>
                ))}
              </div>
            </div>
            
            <CosmicButton 
              onClick={handleShowOath}
              className="w-full"
            >
              {t.createPact.nextButton}
            </CosmicButton>
          </div>
        ) : (
          <PactOath 
            rejections={selectedRejections}
            duration={selectedDuration}
            onCreatePact={handleCreatePact}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePactPage;
