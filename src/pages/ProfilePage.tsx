
import React, { useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { UserProfileForm } from '@/components/UserProfileForm';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { ProBadge } from '@/components/ProBadge';
import { CosmicButton } from '@/components/CosmicButton';
import { Globe, LogOut, SparklesIcon } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SupportedLanguage } from '@/i18n/translations';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AvatarUpload } from '@/components/AvatarUpload';
import { PrivacyPolicy } from '@/components/PrivacyPolicy';
import { supabase, cleanupAuthState } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { userProfile, setActiveScreen, language, setLanguage, user } = useAppStore();
  const { upgradeToPro, cancelProSubscription } = useUserSubscription();
  const { fetchUserProfile } = useUserProfile();
  const navigate = useNavigate();
  const { t } = useTranslations();

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    }
  }, [user]);

  const handleManageSubscription = () => {
    if (userProfile.isPro) {
      // For demo purposes, just toggle the subscription
      cancelProSubscription();
    } else {
      upgradeToPro();
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
  };

  const handleLogout = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.error("Error during signout:", err);
      }
      
      toast({
        title: t.auth?.successTitle || "Успех",
        description: t.auth?.signOutSuccess || "Вы успешно вышли из системы"
      });
      
      // Navigate to home page
      navigate('/');
    } catch (error: any) {
      toast({
        title: t.auth?.errorTitle || "Ошибка",
        description: error.message || "Не удалось выйти из системы",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-md mx-auto w-full">
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between mb-4">
            {userProfile.isPro && (
              <ProBadge size="md" />
            )}
          </div>
          
          <h1 className="text-2xl text-white font-serif mb-4">
            {t.main?.profile || "Профиль"}
          </h1>
          
          <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <AvatarUpload size="md" />
              <div>
                <h2 className="text-lg text-white">{userProfile.name}</h2>
                <p className="text-cosmic-secondary text-sm">{userProfile.rank}</p>
              </div>
            </div>
            
            <UserProfileForm />
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl text-white font-serif mb-4">{t.userProfile?.languageLabel || "App language"}</h2>
            
            <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Globe size={18} className="text-cosmic-accent" />
                <span className="text-white text-sm">{t.userProfile?.languageLabel || "App language"}</span>
              </div>
              
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-cosmic-dark/60 border-cosmic-accent/30 text-white">
                  <SelectValue>
                    {language === 'en' ? 'English 🇬🇧' : 
                     language === 'es' ? 'Español 🇪🇸' : 
                     'Русский 🇷🇺'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-cosmic-dark border-cosmic-accent/30">
                  <SelectItem value="en" className="text-white hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span>🇬🇧</span>
                      <span>English</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="es" className="text-white hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span>🇪🇸</span>
                      <span>Español</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ru" className="text-white hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span>🇷🇺</span>
                      <span>Русский</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <h2 className="text-xl text-white font-serif mb-4">Подписка</h2>
            
            {/* Developer Mode Subscription Toggle */}
            <div className="bg-cosmic-accent/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white font-medium">Режим разработчика</span>
                  <span className="text-cosmic-secondary text-sm">Быстрое переключение подписки</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="pro-mode" className={userProfile.isPro ? "text-cosmic-gold" : "text-cosmic-secondary"}>
                    {userProfile.isPro ? "PRO" : "Бесплатно"}
                  </Label>
                  <Switch
                    id="pro-mode"
                    checked={userProfile.isPro}
                    onCheckedChange={handleManageSubscription}
                  />
                </div>
              </div>
            </div>
            
            {userProfile.isPro ? (
              <div className="bg-cosmic-accent/10 border border-cosmic-gold/30 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium flex items-center">
                      <SparklesIcon size={16} className="text-cosmic-gold mr-2" />
                      ASKET PRO
                    </h3>
                    <p className="text-sm text-cosmic-secondary">Active subscription</p>
                  </div>
                  <ProBadge />
                </div>
                <CosmicButton variant="outline" className="w-full" onClick={handleManageSubscription}>
                  Manage Subscription
                </CosmicButton>
              </div>
            ) : (
              <div className="mb-6">
                <SubscriptionBanner />
              </div>
            )}
            
            {/* Privacy Policy */}
            <PrivacyPolicy />
            
            {/* Logout Button */}
            <div className="mt-8">
              <CosmicButton 
                variant="subtle"
                className="w-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t.auth?.signOut || "Выйти из системы"}
              </CosmicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
