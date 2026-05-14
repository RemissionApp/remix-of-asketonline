import React from 'react';
import {
  CheckIcon,
  XIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useWebBilling } from '@/hooks/useWebBilling';
import { isWebPlatform } from '@/utils/platform';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const FeatureComparison: React.FC = () => {
  const { t } = useTranslations();
  const { upgradeToPro, userProfile, user } = useAppStore();
  const navigate = useNavigate();
  const { hasActiveSubscription, offerings, purchasePackage, isLoading } =
    useRevenueCat(user?.id);
  const web = useWebBilling();
  const onWeb = isWebPlatform();
  const isPro = onWeb ? web.isPro || hasActiveSubscription : hasActiveSubscription;
  const webPackages = web.offering?.availablePackages ?? [];
  const monthlyPkg =
    web.offering?.monthly ??
    webPackages.find(p => p.identifier.toLowerCase().includes('month')) ??
    null;
  const annualPkg =
    web.offering?.annual ??
    webPackages.find(
      p =>
        p.identifier.toLowerCase().includes('annual') ||
        p.identifier.toLowerCase().includes('year')
    ) ??
    null;

  // Extended feature list based on the provided image
  const features = [
    {
      name: 'Кол-во активных аскез',
      free: '1 одновременно',
      pro: 'До 5 одновременно',
    },
    {
      name: 'Категории отказа',
      free: 'Все категории доступны',
      pro: 'Все категории доступны',
    },
    {
      name: 'Вопрос Вселенной',
      free: '1 текстовый вопрос в день',
      pro: 'До 3 в день, включая голосовой вопрос',
    },
    {
      name: 'Ответы Вселенной',
      free: 'Текстовые ответы',
      pro: 'Голосовые + расширенные текстовые (AI)',
    },
    {
      name: 'Круг Энергии',
      free: 'Базовый круг с прогрессом',
      pro: 'Энергетический круг с анимацией силы',
    },
    {
      name: 'Темы оформления',
      free: 'Тёмная тема',
      pro: 'Космические темы, музыка, фоны',
    },
    {
      name: 'Цитаты и мудрость',
      free: '✓ (случайные цитаты)',
      pro: '✓ + персональные духовные послания',
    },
    {
      name: 'Медитации',
      free: '✕',
      pro: '✓ Только для PRO — аудиомедитации, визуализации, голосовые практики',
    },
    {
      name: 'Космические миссии',
      free: '✕',
      pro: '✓ (ритуалы, челленджи, многодневные цепочки)',
    },
    {
      name: 'Рекомендация на день',
      free: '✕',
      pro: '✓ (персональный совет от Вселенной)',
    },
    {
      name: 'Разбор личности',
      free: '✕',
      pro: '✓ (анализ личности, архетип, рекомендация)',
    },
    {
      name: 'Ритуалы силы',
      free: 'Базовые (текст + визуал)',
      pro: '✓ Аудио/видео-ритуалы с озвучкой',
    },
    {
      name: 'Сообщество',
      free: 'Просмотр прогресса других',
      pro: 'Создание групп, энергия поддержки',
    },
    {
      name: 'Цена',
      free: 'Бесплатно',
      pro: '$4.99/мес или $29.99/год (оптимально)',
    },
  ];

  const handleUpgrade = async () => {
    // On web, route through RevenueCat Web Billing (Stripe checkout).
    if (onWeb) {
      const pkg = annualPkg ?? monthlyPkg ?? webPackages[0];
      if (!pkg) {
        toast.error('Подписки временно недоступны', {
          description: 'Попробуйте обновить страницу через минуту.',
        });
        return;
      }
      await web.purchase(pkg);
      return;
    }
    try {
      // Check if we have offerings available
      if (
        offerings &&
        offerings.length > 0 &&
        offerings[0].availablePackages.length > 0
      ) {
        // Purchase the first available package
        await purchasePackage(offerings[0].availablePackages[0]);
        // After successful purchase, navigate to profile page
        navigate('/profile');
      } else {
        // Fallback to demo behavior if no offerings available
        upgradeToPro();
        navigate('/profile');
      }
    } catch (error) {
      console.error('Failed to purchase package:', error);
      // Fallback to demo behavior on error
      upgradeToPro();
      navigate('/profile');
    }
  };

  const handleGoBack = () => {
    // Navigate to main page instead of going back in history
    navigate('/main');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20"
          onClick={handleGoBack}
        >
          <ArrowLeftIcon size={16} />
          <span>Назад</span>
        </Button>
        <h2 className="text-2xl font-bold text-white">
          🔶 Актуальная Freemium-модель
        </h2>
        <div className="w-[80px]"></div> {/* Empty div for flex balance */}
      </div>

      <div className="text-center mb-8">
        <SparklesIcon size={40} className="text-cosmic-gold mx-auto mb-3" />
        <p className="text-cosmic-secondary max-w-md mx-auto">
          Upgrade to PRO to unlock your full potential with premium features and
          exclusive content.
        </p>
      </div>

      {/* Table view for desktop */}
      <div className="hidden md:block max-w-4xl mx-auto mb-8">
        <Table className="border border-cosmic-accent/20">
          <TableHeader>
            <TableRow className="bg-cosmic-dark/80">
              <TableHead className="text-white">Функция</TableHead>
              <TableHead className="text-white text-center">
                ASKET (Бесплатно)
              </TableHead>
              <TableHead className="text-white text-center">
                ASKET PRO (Платная подписка)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow
                key={index}
                className={
                  index % 2 === 0 ? 'bg-cosmic-dark/50' : 'bg-cosmic-dark/30'
                }
              >
                <TableCell className="font-medium text-white">
                  {feature.name}
                </TableCell>
                <TableCell className="text-center text-cosmic-secondary">
                  {feature.free}
                </TableCell>
                <TableCell className="text-center text-cosmic-gold">
                  {feature.pro}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {isPro ? (
          <div className="bg-cosmic-gold/20 p-3 rounded-md text-center mt-6">
            <p className="text-white font-medium">
              You already have PRO access!
            </p>
            <Button
              className="mt-2 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
              onClick={() => navigate('/meditation')}
            >
              Explore PRO Features <ArrowRightIcon className="ml-2" size={16} />
            </Button>
          </div>
        ) : onWeb ? (
          <div className="text-center mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            {monthlyPkg && (
              <Button
                className="bg-cosmic-dark border border-cosmic-gold text-cosmic-gold hover:bg-cosmic-gold/10 px-6 py-5 text-base"
                onClick={() => web.purchase(monthlyPkg)}
                disabled={web.isPurchasing || !web.isReady}
              >
                Месяц · {monthlyPkg.webBillingProduct?.currentPrice?.formattedPrice ?? '—'}
              </Button>
            )}
            {annualPkg && (
              <Button
                className="bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 px-8 py-6 text-lg"
                onClick={() => web.purchase(annualPkg)}
                disabled={web.isPurchasing || !web.isReady}
              >
                <SparklesIcon className="mr-2" size={18} />
                Год · {annualPkg.webBillingProduct?.currentPrice?.formattedPrice ?? '—'}
              </Button>
            )}
            {!monthlyPkg && !annualPkg && (
              <Button
                className="bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 px-8 py-6 text-lg"
                onClick={handleUpgrade}
                disabled={web.isPurchasing || !web.isReady}
              >
                <SparklesIcon className="mr-2" size={18} />
                {web.isPurchasing ? 'Открываем оплату…' : 'Оформить PRO ✨'}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center mt-6">
            <Button
              className="bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 px-8 py-6 text-lg"
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              <SparklesIcon className="mr-2" size={18} />
              {isLoading ? 'Processing...' : 'Unlock PRO ✨'}
            </Button>
          </div>
        )}
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden block">
        <div className="grid gap-6">
          {/* Free Plan */}
          <Card className="border-2 bg-cosmic-dark/50">
            <CardHeader className="text-center bg-cosmic-dark pb-4">
              <CardTitle className="text-xl text-white">ASKET</CardTitle>
              <p className="text-cosmic-secondary">Бесплатно</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 py-2 border-b border-cosmic-accent/10"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {feature.name}
                    </p>
                    <p className="text-sm text-cosmic-secondary">
                      {feature.free}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-cosmic-gold bg-cosmic-dark/50 relative">
            <div className="absolute top-0 right-0 bg-cosmic-gold text-black font-bold px-4 py-1 rounded-bl-lg">
              PRO
            </div>
            <CardHeader className="text-center bg-gradient-to-b from-cosmic-gold/20 to-cosmic-dark pb-4">
              <CardTitle className="text-xl text-white">ASKET PRO</CardTitle>
              <p className="text-cosmic-secondary">Платная подписка</p>
              <p className="text-lg font-bold mt-2 text-white">
                $4.99/мес или $29.99/год
              </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 py-2 border-b border-cosmic-gold/10"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {feature.name}
                    </p>
                    <p className="text-sm text-cosmic-gold">{feature.pro}</p>
                  </div>
                </div>
              ))}

              {isPro ? (
                <div className="bg-cosmic-gold/20 p-3 rounded-md text-center mt-6">
                  <p className="text-white font-medium">
                    You already have PRO access!
                  </p>
                  <Button
                    className="w-full mt-2 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                    onClick={() => navigate('/meditation')}
                  >
                    Explore PRO Features{' '}
                    <ArrowRightIcon className="ml-2" size={16} />
                  </Button>
                </div>
              ) : onWeb ? (
                <div className="space-y-2 mt-6">
                  {monthlyPkg && (
                    <Button
                      className="w-full bg-cosmic-dark border border-cosmic-gold text-cosmic-gold hover:bg-cosmic-gold/10"
                      onClick={() => web.purchase(monthlyPkg)}
                      disabled={web.isPurchasing || !web.isReady}
                    >
                      Месяц · {monthlyPkg.webBillingProduct?.currentPrice?.formattedPrice ?? '—'}
                    </Button>
                  )}
                  {annualPkg && (
                    <Button
                      className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                      onClick={() => web.purchase(annualPkg)}
                      disabled={web.isPurchasing || !web.isReady}
                    >
                      <SparklesIcon className="mr-2" size={16} />
                      Год · {annualPkg.webBillingProduct?.currentPrice?.formattedPrice ?? '—'}
                    </Button>
                  )}
                  {!monthlyPkg && !annualPkg && (
                    <Button
                      className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                      onClick={handleUpgrade}
                      disabled={web.isPurchasing || !web.isReady}
                    >
                      <SparklesIcon className="mr-2" size={16} />
                      {web.isPurchasing ? 'Открываем оплату…' : 'Оформить PRO ✨'}
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  className="w-full mt-6 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                  onClick={handleUpgrade}
                  disabled={isLoading}
                >
                  <SparklesIcon className="mr-2" size={16} />
                  {isLoading ? 'Processing...' : 'Unlock PRO ✨'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials - keep them only for non-PRO users */}
      {!isPro && (
        <div className="mt-12 max-w-3xl mx-auto">
          <h3 className="text-xl font-serif text-white text-center mb-6">
            What PRO Users Say
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-cosmic-dark/30 border-cosmic-accent/20">
              <CardContent className="p-4">
                <p className="text-cosmic-secondary italic mb-3">
                  "Медитации полностью изменили мою ежедневную практику. Стоят
                  каждой копейки только за внутреннее спокойствие."
                </p>
                <p className="text-white font-medium">- Анна К.</p>
              </CardContent>
            </Card>
            <Card className="bg-cosmic-dark/30 border-cosmic-accent/20">
              <CardContent className="p-4">
                <p className="text-cosmic-secondary italic mb-3">
                  "Возможность поддерживать несколько аскез одновременно
                  значительно ускорила мой духовный рост."
                </p>
                <p className="text-white font-medium">- Михаил С.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureComparison;
