import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, differenceInYears } from 'date-fns';
import { ru, es, enUS } from 'date-fns/locale';
import { CalendarIcon, Edit2Icon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/UserAvatar';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';

// Create a local ZodiacInfo component
const ZodiacInfo: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  const birthDate = userProfile?.birthDate;
  const zodiacSign = getZodiacSign(birthDate || null);
  
  if (!zodiacSign) return null;
  
  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName = zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en;
  
  // Translate element based on language
  const translateElement = (element: string): string => {
    if (language === 'ru') {
      switch (element) {
        case 'Fire': return 'Огонь';
        case 'Earth': return 'Земля';
        case 'Air': return 'Воздух';
        case 'Water': return 'Вода';
        default: return element;
      }
    } else if (language === 'es') {
      switch (element) {
        case 'Fire': return 'Fuego';
        case 'Earth': return 'Tierra';
        case 'Air': return 'Aire';
        case 'Water': return 'Agua';
        default: return element;
      }
    }
    return element;
  };
  
  // Translate ruler based on language
  const translateRuler = (ruler: string): string => {
    if (language === 'ru') {
      switch (ruler) {
        case 'Mars': return 'Марс';
        case 'Venus': return 'Венера';
        case 'Mercury': return 'Меркурий';
        case 'Moon': return 'Луна';
        case 'Sun': return 'Солнце';
        case 'Jupiter': return 'Юпитер';
        case 'Saturn': return 'Сатурн';
        case 'Uranus': return 'Уран';
        case 'Neptune': return 'Нептун';
        case 'Pluto': return 'Плутон';
        case 'Pluto, Mars': return 'Плутон, Марс';
        case 'Neptune, Jupiter': return 'Нептун, Юпитер';
        case 'Uranus, Saturn': return 'Уран, Сатурн';
        default: return ruler;
      }
    } else if (language === 'es') {
      switch (ruler) {
        case 'Mars': return 'Marte';
        case 'Venus': return 'Venus';
        case 'Mercury': return 'Mercurio';
        case 'Moon': return 'Luna';
        case 'Sun': return 'Sol';
        case 'Jupiter': return 'Júpiter';
        case 'Saturn': return 'Saturno';
        case 'Uranus': return 'Urano';
        case 'Neptune': return 'Neptuno';
        case 'Pluto': return 'Plutón';
        case 'Pluto, Mars': return 'Plutón, Marte';
        case 'Neptune, Jupiter': return 'Neptuno, Júpiter';
        case 'Uranus, Saturn': return 'Urano, Saturno';
        default: return ruler;
      }
    }
    return ruler;
  };
  
  // Translate traits based on language
  const translateTraits = (traits: string[]): string[] => {
    if (language === 'ru') {
      return traits.map(trait => {
        switch (trait) {
          case 'Courageous': return 'Смелый';
          case 'Determined': return 'Решительный';
          case 'Passionate': return 'Страстный';
          case 'Confident': return 'Уверенный';
          case 'Reliable': return 'Надежный';
          case 'Patient': return 'Терпеливый';
          case 'Practical': return 'Практичный';
          case 'Devoted': return 'Преданный';
          case 'Adaptable': return 'Адаптивный';
          case 'Outgoing': return 'Общительный';
          case 'Curious': return 'Любознательный';
          case 'Intelligent': return 'Умный';
          case 'Empathetic': return 'Эмпатичный';
          case 'Nurturing': return 'Заботливый';
          case 'Intuitive': return 'Интуитивный';
          case 'Protective': return 'Защищающий';
          case 'Creative': return 'Творческий';
          case 'Generous': return 'Щедрый';
          case 'Charismatic': return 'Харизматичный';
          case 'Analytical': return 'Аналитический';
          case 'Diligent': return 'Усердный';
          case 'Detail-oriented': return 'Внимательный к деталям';
          case 'Diplomatic': return 'Дипломатичный';
          case 'Fair-minded': return 'Справедливый';
          case 'Harmonious': return 'Гармоничный';
          case 'Social': return 'Социальный';
          case 'Resourceful': return 'Находчивый';
          case 'Intense': return 'Интенсивный';
          case 'Optimistic': return 'Оптимистичный';
          case 'Freedom-loving': return 'Свободолюбивый';
          case 'Adventurous': return 'Авантюрный';
          case 'Philosophical': return 'Философский';
          case 'Disciplined': return 'Дисциплинированный';
          case 'Responsible': return 'Ответственный';
          case 'Self-controlled': return 'Самоконтролируемый';
          case 'Ambitious': return 'Амбициозный';
          case 'Progressive': return 'Прогрессивный';
          case 'Original': return 'Оригинальный';
          case 'Independent': return 'Независимый';
          case 'Humanitarian': return 'Гуманист';
          case 'Compassionate': return 'Сострадательный';
          case 'Gentle': return 'Нежный';
          case 'Artistic': return 'Артистичный';
          default: return trait;
        }
      });
    } else if (language === 'es') {
      return traits.map(trait => {
        switch (trait) {
          case 'Courageous': return 'Valiente';
          case 'Determined': return 'Determinado';
          case 'Passionate': return 'Apasionado';
          case 'Confident': return 'Seguro';
          case 'Reliable': return 'Confiable';
          case 'Patient': return 'Paciente';
          case 'Practical': return 'Práctico';
          case 'Devoted': return 'Devoto';
          case 'Adaptable': return 'Adaptable';
          case 'Outgoing': return 'Extrovertido';
          case 'Curious': return 'Curioso';
          case 'Intelligent': return 'Inteligente';
          case 'Empathetic': return 'Empático';
          case 'Nurturing': return 'Nutritivo';
          case 'Intuitive': return 'Intuitivo';
          case 'Protective': return 'Protector';
          case 'Creative': return 'Creativo';
          case 'Generous': return 'Generoso';
          case 'Charismatic': return 'Carismático';
          case 'Analytical': return 'Analítico';
          case 'Diligent': return 'Diligente';
          case 'Detail-oriented': return 'Detallista';
          case 'Diplomatic': return 'Diplomático';
          case 'Fair-minded': return 'Justo';
          case 'Harmonious': return 'Armonioso';
          case 'Social': return 'Social';
          case 'Resourceful': return 'Ingenioso';
          case 'Intense': return 'Intenso';
          case 'Optimistic': return 'Optimista';
          case 'Freedom-loving': return 'Amante de la libertad';
          case 'Adventurous': return 'Aventurero';
          case 'Philosophical': return 'Filosófico';
          case 'Disciplined': return 'Disciplinado';
          case 'Responsible': return 'Responsable';
          case 'Self-controlled': return 'Autocontrolado';
          case 'Ambitious': return 'Ambicioso';
          case 'Progressive': return 'Progresista';
          case 'Original': return 'Original';
          case 'Independent': return 'Independiente';
          case 'Humanitarian': return 'Humanitario';
          case 'Compassionate': return 'Compasivo';
          case 'Gentle': return 'Gentil';
          case 'Artistic': return 'Artístico';
          default: return trait;
        }
      });
    }
    return traits;
  };
  
  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl text-cosmic-accent">{zodiacInfo.symbol}</div>
        <div>
          <h3 className="text-white font-medium">{zodiacName}</h3>
          <p className="text-sm text-cosmic-secondary">{zodiacInfo.dates}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-cosmic-secondary">{t.zodiac?.element || "Element"}:</span>
          <span className="text-white ml-2">{translateElement(zodiacInfo.element)}</span>
        </div>
        <div>
          <span className="text-cosmic-secondary">{t.zodiac?.ruler || "Ruler"}:</span>
          <span className="text-white ml-2">{translateRuler(zodiacInfo.ruler)}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-cosmic-secondary mb-1">{t.zodiac?.traits || "Traits"}:</div>
        <div className="flex flex-wrap gap-2">
          {translateTraits(zodiacInfo.traits).map(trait => (
            <span 
              key={trait} 
              className="bg-cosmic-accent/20 text-white px-2 py-1 rounded-full text-xs"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile, userProfile, language, onboardingComplete, setOnboardingComplete, user } = useAppStore();
  const { t, getYearWord } = useTranslations();
  const [age, setAge] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBirthDate, setEditingBirthDate] = useState(false);
  const [tempBirthDate, setTempBirthDate] = useState<Date | null>(null);
  
  // Get locale based on selected language
  const getLocale = () => {
    switch (language) {
      case 'ru':
        return ru;
      case 'es':
        return es;
      default:
        return enUS;
    }
  };
  
  // Create form schema based on language
  const formSchema = z.object({
    name: z.string().min(2, { 
      message: t.userProfile?.nameRequired || "Имя обязательно" 
    }),
    birthDate: z.date({
      required_error: t.userProfile?.birthDateRequired || "Укажите дату рождения"
    }),
  });

  // Initialize form with placeholder values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: new Date(),
    },
  });

  // Fetch profile data from Supabase when component mounts
  useEffect(() => {
    const fetchProfileFromSupabase = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching profile data from Supabase for user:", user.id);
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('name, birth_date')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Ошибка загрузки профиля",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        console.log("Profile data from Supabase:", profileData);
        
        if (profileData) {
          // Convert birth_date string from Supabase to a Date object
          const birthDate = profileData.birth_date ? new Date(profileData.birth_date) : new Date();
          
          // Update local form state
          form.reset({
            name: profileData.name !== 'Искатель' ? profileData.name : "",
            birthDate: birthDate
          });
          
          // Also update the store
          updateUserProfile({
            name: profileData.name,
            birthDate: birthDate
          });
          
          // Calculate and set age
          const calculatedAge = differenceInYears(new Date(), birthDate);
          setAge(calculatedAge);
        }
      } catch (err) {
        console.error("Exception fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch profile if user is available and we're not in the initial setup flow
    if (user && location.pathname === '/profile') {
      fetchProfileFromSupabase();
    } else if (userProfile && userProfile.name !== 'Искатель' && userProfile.birthDate) {
      // For the initial setup, use data from store if available
      form.reset({
        name: userProfile.name,
        birthDate: userProfile.birthDate
      });
      
      // Calculate and set age
      const calculatedAge = differenceInYears(new Date(), userProfile.birthDate);
      setAge(calculatedAge);
    }
  }, [user, location.pathname]);
  
  // Calculate age whenever birthDate changes
  useEffect(() => {
    const birthDate = form.getValues('birthDate');
    if (birthDate) {
      const calculatedAge = differenceInYears(new Date(), birthDate);
      setAge(calculatedAge);
    }
  }, [form.watch('birthDate')]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему для обновления профиля",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Saving profile data to Supabase:", values);
      
      // Format birthDate to YYYY-MM-DD for Supabase
      const formattedBirthDate = format(values.birthDate, 'yyyy-MM-dd');
      
      // Update directly in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          birth_date: formattedBirthDate
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Also update the local store
      await updateUserProfile({
        name: values.name,
        birthDate: values.birthDate
      });
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены"
      });
    
      // Always navigate to main regardless of previous location
      navigate('/main');
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить профиль",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle birth date edit button click
  const handleEditBirthDate = () => {
    setTempBirthDate(userProfile?.birthDate || null);
    setEditingBirthDate(true);
  };

  // Save the new birth date
  const handleSaveBirthDate = async () => {
    if (!user || !tempBirthDate) {
      setEditingBirthDate(false);
      return;
    }
    
    try {
      // Format birthDate to YYYY-MM-DD for Supabase
      const formattedBirthDate = format(tempBirthDate, 'yyyy-MM-dd');
      
      // Update directly in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          birth_date: formattedBirthDate
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Also update the local store and form
      await updateUserProfile({
        ...userProfile,
        birthDate: tempBirthDate
      });
      
      form.setValue('birthDate', tempBirthDate);
      
      // Calculate and set age
      const calculatedAge = differenceInYears(new Date(), tempBirthDate);
      setAge(calculatedAge);
      
      toast({
        title: "Дата рождения обновлена",
        description: "Ваши данные успешно сохранены"
      });
    } catch (error: any) {
      console.error("Error updating birth date:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить дату рождения",
        variant: "destructive"
      });
    } finally {
      setEditingBirthDate(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="flex justify-center mb-4 relative">
        <UserAvatar size="lg" />
        {userProfile?.birthDate && (
          <div 
            className="absolute top-0 right-0 bg-cosmic-accent/20 rounded-full p-1 cursor-pointer"
            onClick={handleEditBirthDate}
            title={t.zodiac?.editBirthDate || "Edit birth date"}
          >
            <Edit2Icon size={16} className="text-cosmic-accent" />
          </div>
        )}
      </div>
      
      {location.pathname !== '/profile' && (
        <h2 className="text-3xl font-serif text-white mb-6">
          {t.userProfile?.title || "О тебе"}
        </h2>
      )}
      
      {age !== null && (
        <div className="mb-6 text-cosmic-secondary font-medium">
          {t.userProfile?.age || "Возраст"}: {age} {getYearWord(age)}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-cosmic-accent border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-cosmic-secondary text-sm">
                    {t.userProfile?.nameLabel || "Как тебя зовут"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-transparent backdrop-blur-[5px] border-cosmic-accent/30 text-white"
                      placeholder={t.userProfile?.namePlaceholder || "Введите ваше имя"} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-cosmic-secondary text-sm">
                    {t.userProfile?.birthDateLabel || "Дата рождения"}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full bg-transparent backdrop-blur-[5px] border-cosmic-accent/30 text-left font-normal text-white",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: getLocale() })
                          ) : (
                            <span>{t.userProfile?.birthDatePlaceholder || "Выберите дату рождения"}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-cosmic-dark/30 backdrop-blur-[5px] border-cosmic-accent/30 p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <CosmicButton 
                className="w-full bg-transparent backdrop-blur-[5px] border border-cosmic-accent hover:bg-cosmic-accent/20"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 
                  (t.userProfile?.savingButton || "Сохранение...") : 
                  (t.userProfile?.continueButton || "Продолжить")}
              </CosmicButton>
            </div>
          </form>
        </Form>
      )}
      
      <div className="mt-6 text-cosmic-secondary text-sm">
        {t.userProfile?.currentDate || "Текущая дата"}: {format(new Date(), "PPP", { locale: getLocale() })}
      </div>
      
      {/* Zodiac section */}
      {userProfile?.birthDate && <ZodiacInfo />}
      
      {/* Birth Date Edit Dialog */}
      <Dialog open={editingBirthDate} onOpenChange={setEditingBirthDate}>
        <DialogContent className="bg-cosmic-dark border-cosmic-accent/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cosmic-accent">
              {t.zodiac?.editBirthDate || "Edit birth date"}
            </DialogTitle>
            <DialogDescription className="text-cosmic-secondary">
              {t.userProfile?.birthDateLabel || "Дата рождения"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Calendar
              mode="single"
              selected={tempBirthDate || undefined}
              onSelect={(date) => setTempBirthDate(date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className="mx-auto pointer-events-auto"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditingBirthDate(false)}
              className="border-cosmic-accent/30 text-cosmic-secondary"
            >
              {t.zodiac?.cancelBirthDate || "Cancel"}
            </Button>
            <CosmicButton onClick={handleSaveBirthDate}>
              {t.zodiac?.saveBirthDate || "Save"}
            </CosmicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfileForm;
