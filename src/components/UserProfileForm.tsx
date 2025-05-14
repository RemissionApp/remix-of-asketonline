
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
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/UserAvatar';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const UserProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile, userProfile, language, onboardingComplete, setOnboardingComplete, user } = useAppStore();
  const { t, getYearWord } = useTranslations();
  const [age, setAge] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    
      // Check if onboarding is complete or not
      if (location.pathname === '/profile') {
        // If we're already on profile page, just stay here
      } else if (onboardingComplete) {
        // If onboarding was already completed, go to main
        navigate('/main');
      } else {
        // Otherwise go to onboarding
        navigate('/onboarding');
      }
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

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="flex justify-center mb-4">
        <UserAvatar size="lg" />
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
    </div>
  );
};

export default UserProfileForm;
