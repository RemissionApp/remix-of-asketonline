import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { ArrowLeft, LoaderCircle, Send, Clock, MapPin, User, Calendar, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { CosmicButton } from '@/components/CosmicButton';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { toast } from 'sonner';
import { 
  getAstroProfile, 
  saveAstroProfile, 
  getUniverseDecoding,
  getLastReading
} from '@/services/universeDecodeService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type ChatStep = 'intro' | 'name' | 'birthdate' | 'birthtime' | 'birthplace' | 'processing' | 'reading';

interface Message {
  sender: 'universe' | 'user';
  content: string;
  type?: 'input' | 'text';
  inputType?: string;
  field?: string;
}

const UniverseDecodePage: React.FC = () => {
  const { userProfile, setActiveScreen } = useAppStore();
  const isUserPro = userProfile?.isPro || false;
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const [chatStep, setChatStep] = useState<ChatStep>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  
  // Form schema
  const formSchema = z.object({
    name: z.string().min(2, {
      message: t.universe.decode.nameRequired || "Name is required"
    }),
    birthDate: z.string().min(8, {
      message: t.universe.decode.dateRequired || "Birth date is required"
    }),
    birthTime: z.string().optional().nullable(),
    birthPlace: z.string().optional().nullable()
  });
  
  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: ""
    }
  });
  
  useEffect(() => {
    const checkProfile = async () => {
      // Check if user has a profile
      const profile = await getAstroProfile();
      
      if (profile) {
        setHasProfile(true);
        form.reset({
          name: profile.name,
          birthDate: profile.birthDate,
          birthTime: profile.birthTime || "",
          birthPlace: profile.birthPlace || ""
        });
        
        // Check if there's a saved reading
        const lastReading = await getLastReading();
        if (lastReading) {
          setReading(lastReading);
        }
        
        // Add initial messages
        setMessages([
          {
            sender: 'universe',
            content: t.universe.decode.welcomeBack || "Welcome back, seeker. Would you like to see your previous reading or create a new one?"
          }
        ]);
      } else {
        // Start the conversation
        setMessages([
          {
            sender: 'universe',
            content: t.universe.decode.welcome || "Welcome, seeker. I am the Universe. I will reveal the cosmic patterns in your life through numerology and astrology."
          },
          {
            sender: 'universe',
            content: t.universe.decode.askName || "What is your name?",
            type: 'input',
            inputType: 'text',
            field: 'name'
          }
        ]);
        setChatStep('name');
      }
      
      setLoading(false);
    };
    
    checkProfile();
  }, [t, form]);
  
  const handleGoBack = () => {
    setActiveScreen('main');
    navigate('/main');
  };
  
  const handleViewReading = () => {
    setChatStep('reading');
  };
  
  const handleNewReading = () => {
    if (hasProfile) {
      // Start from the beginning but with pre-filled values
      setChatStep('name');
      
      // Update messages to start the conversation again
      setMessages([
        ...messages,
        {
          sender: 'universe',
          content: t.universe.decode.startNew || "Let's create a new reading. I already know some things about you, but feel free to update your information."
        },
        {
          sender: 'universe',
          content: t.universe.decode.confirmName || `Is your name still ${form.getValues('name')}?`,
          type: 'input',
          inputType: 'text',
          field: 'name'
        }
      ]);
    }
  };
  
  const processInput = async (value: string, field: string) => {
    // Add user's message to chat
    setMessages(prev => [...prev, {
      sender: 'user',
      content: value
    }]);
    
    // Update form value
    form.setValue(field as any, value);
    
    // Process based on current step
    switch (chatStep) {
      case 'name':
        setMessages(prev => [...prev, {
          sender: 'universe',
          content: t.universe.decode.askBirthdate || "When were you born? (YYYY-MM-DD)",
          type: 'input',
          inputType: 'date',
          field: 'birthDate'
        }]);
        setChatStep('birthdate');
        break;
        
      case 'birthdate':
        setMessages(prev => [...prev, {
          sender: 'universe',
          content: t.universe.decode.askBirthtime || "At what time were you born? (optional, format: HH:MM)",
          type: 'input',
          inputType: 'time',
          field: 'birthTime'
        }]);
        setChatStep('birthtime');
        break;
        
      case 'birthtime':
        setMessages(prev => [...prev, {
          sender: 'universe',
          content: t.universe.decode.askBirthplace || "Where were you born? (optional, city/country)",
          type: 'input',
          inputType: 'text',
          field: 'birthPlace'
        }]);
        setChatStep('birthplace');
        break;
        
      case 'birthplace':
        // All data collected, now generate reading
        setChatStep('processing');
        setMessages(prev => [...prev, {
          sender: 'universe',
          content: t.universe.decode.processing || "I understand. Now I will connect to the cosmic patterns and reveal your personal reading..."
        }]);
        
        // Save profile to database
        const formValues = form.getValues();
        await saveAstroProfile({
          name: formValues.name,
          birthDate: formValues.birthDate,
          birthTime: formValues.birthTime || null,
          birthPlace: formValues.birthPlace || null
        });
        
        // Generate reading
        try {
          const result = await getUniverseDecoding({
            name: formValues.name,
            birthDate: formValues.birthDate,
            birthTime: formValues.birthTime || null,
            birthPlace: formValues.birthPlace || null
          });
          
          if (result.error) {
            throw new Error(result.error);
          }
          
          setReading(result.reading);
          setChatStep('reading');
          
          setMessages(prev => [...prev, {
            sender: 'universe',
            content: t.universe.decode.readingReady || "Your cosmic reading is ready. Listen carefully to the Universe's message..."
          }]);
        } catch (error) {
          console.error("Error generating reading:", error);
          toast.error(t.universe.decode.errorReading || "The cosmic energies are disturbed. Please try again later.");
          
          setChatStep('intro');
          setMessages(prev => [...prev, {
            sender: 'universe',
            content: t.universe.decode.errorReading || "The cosmic energies are disturbed. Please try again later."
          }]);
        }
        break;
        
      default:
        break;
    }
  };
  
  const handleSubmit = (value: string, field: string) => {
    processInput(value, field);
  };
  
  // Render the universe decoding page
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
          {t.universe.decode.title || "Universe Decoding"}
        </h1>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
        {!isUserPro ? (
          <ProFeatureOverlay 
            title={t.universe.decode.proFeature || "PRO Feature"}
            message={t.universe.decode.upgradeMessage || "Unlock Universe Decoding with PRO"}
          >
            <div className="h-[500px] flex flex-col space-y-4">
              <div className="cosmic-card mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-cosmic-accent/20 flex items-center justify-center mr-3">
                    <Sparkles size={18} className="text-cosmic-accent" />
                  </div>
                  <h2 className="text-lg font-serif text-white">
                    {t.universe.decode.title || "Universe Decoding"}
                  </h2>
                </div>
                <p className="text-cosmic-secondary">
                  {t.universe.decode.description || "Discover your numerological and astrological patterns in a personalized reading from the Universe."}
                </p>
              </div>
              
              <div className="cosmic-card">
                <h3 className="text-lg font-serif text-cosmic-accent mb-3">
                  {t.universe.decode.whatYouGet || "What You'll Discover:"}
                </h3>
                <ul className="space-y-2 text-cosmic-secondary">
                  <li className="flex items-start">
                    <span className="text-cosmic-gold mr-2">•</span>
                    {t.universe.decode.feature1 || "Your Life Path Number and Soul Number"}
                  </li>
                  <li className="flex items-start">
                    <span className="text-cosmic-gold mr-2">•</span>
                    {t.universe.decode.feature2 || "Analysis of your Astrological Signs"}
                  </li>
                  <li className="flex items-start">
                    <span className="text-cosmic-gold mr-2">•</span>
                    {t.universe.decode.feature3 || "Personal Cosmic Potential"}
                  </li>
                  <li className="flex items-start">
                    <span className="text-cosmic-gold mr-2">•</span>
                    {t.universe.decode.feature4 || "Guidance for Your Current Life Phase"}
                  </li>
                </ul>
              </div>
            </div>
          </ProFeatureOverlay>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoaderCircle size={40} className="text-cosmic-accent animate-spin" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {hasProfile && chatStep === 'intro' && (
              <div className="mb-4 flex space-x-2">
                <CosmicButton onClick={handleViewReading} className="flex-1">
                  {t.universe.decode.viewReading || "View Reading"}
                </CosmicButton>
                <CosmicButton onClick={handleNewReading} variant="outline" className="flex-1">
                  {t.universe.decode.newReading || "New Reading"}
                </CosmicButton>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-cosmic-accent/20' : 'bg-cosmic-dark'} p-3 rounded-lg`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {chatStep === 'reading' && reading && (
                <div className="cosmic-card bg-cosmic-accent/10">
                  <h2 className="text-lg font-serif text-cosmic-gold mb-4">
                    {t.universe.decode.yourReading || "Your Cosmic Reading"}
                  </h2>
                  
                  <QuoteDisplay 
                    quote={reading} 
                    className="mb-8 whitespace-pre-line"
                  />
                  
                  <div className="mt-8 flex justify-center">
                    <CosmicButton 
                      onClick={handleNewReading} 
                      variant="outline"
                    >
                      {t.universe.decode.newReading || "New Reading"}
                    </CosmicButton>
                  </div>
                </div>
              )}
            </div>
            
            {chatStep !== 'intro' && chatStep !== 'reading' && chatStep !== 'processing' && (
              <div className="sticky bottom-0">
                {messages.filter(m => m.type === 'input').slice(-1).map((inputMsg, index) => (
                  <div key={index} className="cosmic-card">
                    <div className="flex items-center mb-2">
                      {inputMsg.field === 'name' && <User size={18} className="text-cosmic-gold mr-2" />}
                      {inputMsg.field === 'birthDate' && <Calendar size={18} className="text-cosmic-gold mr-2" />}
                      {inputMsg.field === 'birthTime' && <Clock size={18} className="text-cosmic-gold mr-2" />}
                      {inputMsg.field === 'birthPlace' && <MapPin size={18} className="text-cosmic-gold mr-2" />}
                      <Label htmlFor={inputMsg.field} className="text-cosmic-secondary">
                        {inputMsg.content}
                      </Label>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input
                        id={inputMsg.field}
                        type={inputMsg.inputType}
                        className="cosmic-input flex-1"
                        defaultValue={form.getValues(inputMsg.field as any) || ''}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmit((e.target as HTMLInputElement).value, inputMsg.field || '');
                          }
                        }}
                      />
                      <CosmicButton onClick={() => {
                        const input = document.getElementById(inputMsg.field || '') as HTMLInputElement;
                        handleSubmit(input.value, inputMsg.field || '');
                      }}>
                        <Send size={18} />
                      </CosmicButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {chatStep === 'processing' && (
              <div className="cosmic-card flex items-center justify-center p-8">
                <div className="energy-circle w-20 h-20 animate-pulse-slow">
                  <div className="absolute inset-0 rounded-full flex items-center justify-center">
                    <div className="text-cosmic-accent animate-pulse-slow">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V2M12 22v-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <span className="ml-4 text-cosmic-secondary">{t.universe.decode.analyzing || "Analyzing cosmic patterns..."}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniverseDecodePage;
