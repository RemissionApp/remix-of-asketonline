
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import UserProfileForm from '@/components/UserProfileForm';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { ProBadge } from '@/components/ProBadge';
import { CosmicButton } from '@/components/CosmicButton';
import { Globe, SparklesIcon, LogOut, Shield, FileText } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';
import { ZodiacBadge } from '@/components/ZodiacBadge';

const ProfilePage: React.FC = () => {
  const { userProfile, upgradeToPro, cancelProSubscription, setActiveScreen, language, setLanguage, signOut } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);

  const handleManageSubscription = () => {
    if (userProfile?.isPro) {
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
    await signOut();
    navigate('/'); // Navigate to home page after logout
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-md mx-auto w-full">
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between mb-4">
            {userProfile?.isPro && (
              <ProBadge size="md" />
            )}
            
            {userProfile?.birthDate && (
              <ZodiacBadge size="md" />
            )}
          </div>
          
          <h1 className="text-2xl text-white font-serif mb-4">
            {t.main?.profile || "Профиль"}
          </h1>
          
          <UserProfileForm />
          
          {/* Zodiac Information */}
          <ZodiacBadgeDisplay />
          
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
              <SubscriptionBanner />
            )}
            
            {/* Legal documents section */}
            <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6">
              <h3 className="text-white font-medium mb-3">Правовая информация</h3>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20"
                  onClick={() => setShowPrivacyPolicy(true)}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Политика конфиденциальности</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20"
                  onClick={() => setShowTermsOfUse(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Правила использования</span>
                </Button>
              </div>
            </div>
            
            {/* Logout button */}
            <Button 
              variant="destructive" 
              className="w-full mb-6 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="bg-cosmic-dark text-white border-cosmic-accent/30 max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cosmic-accent">Политика конфиденциальности</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-cosmic-secondary">
            <div className="space-y-4 text-sm">
              <p>Последнее обновление: 14 мая, 2025</p>
              
              <h3 className="text-white text-base font-medium">1. Введение</h3>
              <p>Приложение ASKET ("мы", "наше" или "нас") уважает вашу конфиденциальность и стремится защитить ваши персональные данные. Эта политика конфиденциальности объясняет, как мы собираем, используем, раскрываем, обрабатываем и защищаем информацию, которую вы предоставляете при использовании нашего приложения.</p>
              
              <h3 className="text-white text-base font-medium">2. Собираемая информация</h3>
              <p>Мы собираем следующие типы информации:</p>
              <ul className="list-disc pl-5">
                <li>Информация профиля: имя, электронная почта, цели</li>
                <li>Данные об использовании: информация о ваших пактах, днях соблюдения и взаимодействии с приложением</li>
                <li>Техническая информация: IP-адрес, тип устройства, версия ОС</li>
              </ul>
              
              <h3 className="text-white text-base font-medium">3. Использование информации</h3>
              <p>Ваша информация используется для:</p>
              <ul className="list-disc pl-5">
                <li>Предоставления и улучшения функций приложения</li>
                <li>Персонализации вашего опыта</li>
                <li>Коммуникации с вами по поводу обновлений</li>
                <li>Аналитики и исследований</li>
              </ul>
              
              <h3 className="text-white text-base font-medium">4. Безопасность данных</h3>
              <p>Мы используем коммерчески приемлемые меры для защиты ваших данных, но помните, что ни один метод передачи через интернет не является 100% безопасным.</p>
              
              <h3 className="text-white text-base font-medium">5. Изменения в политике</h3>
              <p>Мы можем обновлять нашу политику конфиденциальности время от времени. Мы уведомим вас о любых изменениях, разместив новую политику конфиденциальности на этой странице.</p>
              
              <h3 className="text-white text-base font-medium">6. Контакты</h3>
              <p>Если у вас есть вопросы по поводу этой политики конфиденциальности, пожалуйста, свяжитесь с нами по адресу: support@asket-app.com</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      
      {/* Terms of Use Dialog */}
      <Dialog open={showTermsOfUse} onOpenChange={setShowTermsOfUse}>
        <DialogContent className="bg-cosmic-dark text-white border-cosmic-accent/30 max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cosmic-accent">Правила использования</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-cosmic-secondary">
            <div className="space-y-4 text-sm">
              <p>Последнее обновление: 14 мая, 2025</p>
              
              <h3 className="text-white text-base font-medium">1. Принятие условий</h3>
              <p>Используя приложение ASKET, вы соглашаетесь соблюдать настоящие Правила использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наше приложение.</p>
              
              <h3 className="text-white text-base font-medium">2. Описание услуг</h3>
              <p>Приложение ASKET предоставляет платформу для создания и отслеживания личных пактов аскезы, получения духовных советов и отслеживания личного прогресса. Мы оставляем за собой право изменять, приостанавливать или прекращать любой аспект услуги в любое время.</p>
              
              <h3 className="text-white text-base font-medium">3. Пользовательские аккаунты</h3>
              <p>Для использования некоторых функций приложения вам необходимо создать аккаунт. Вы несете ответственность за сохранение конфиденциальности своих учетных данных и за все действия, которые происходят под вашей учетной записью.</p>
              
              <h3 className="text-white text-base font-medium">4. Пользовательский контент</h3>
              <p>Вы сохраняете все права на контент, который вы создаете в приложении. Однако, создавая контент, вы предоставляете нам неисключительную лицензию на использование, воспроизведение и отображение этого контента в связи с работой приложения.</p>
              
              <h3 className="text-white text-base font-medium">5. Запрещенное поведение</h3>
              <p>Запрещается использовать приложение для незаконных целей или нарушения прав других. Запрещено размещать контент, который:</p>
              <ul className="list-disc pl-5">
                <li>Нарушает законы или права третьих лиц</li>
                <li>Является угрожающим, оскорбительным или дискриминационным</li>
                <li>Содержит вредоносный код</li>
                <li>Вмешивается в нормальную работу приложения</li>
              </ul>
              
              <h3 className="text-white text-base font-medium">6. Ограничение ответственности</h3>
              <p>Приложение предоставляется "как есть" и "как доступно". Мы не даем никаких гарантий относительно точности, полноты или надежности контента или услуг, предоставляемых через приложение.</p>
              
              <h3 className="text-white text-base font-medium">7. Изменения в правилах</h3>
              <p>Мы можем изменять эти правила в любое время. Продолжая использовать приложение после таких изменений, вы соглашаетесь с обновленными правилами.</p>
              
              <h3 className="text-white text-base font-medium">8. Прекращение действия</h3>
              <p>Мы можем прекратить или приостановить ваш доступ к приложению немедленно, без предварительного уведомления или ответственности, по любой причине, включая нарушение этих правил.</p>
              
              <h3 className="text-white text-base font-medium">9. Контакты</h3>
              <p>Если у вас есть вопросы по поводу этих правил использования, пожалуйста, свяжитесь с нами по адресу: support@asket-app.com</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
