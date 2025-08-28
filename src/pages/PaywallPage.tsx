import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useToast } from '@/hooks/use-toast';

const PaywallPage: React.FC = () => {
  const navigate = useNavigate();
  const { presentPaywall } = useRevenueCat();
  const { toast } = useToast();

  useEffect(() => {
    const showPaywall = async () => {
      try {
        await presentPaywall();
        // После закрытия paywall возвращаемся на главную страницу
        navigate('/');
      } catch (error) {
        console.error('Failed to show paywall:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось показать страницу покупок',
          variant: 'destructive',
        });
        // В случае ошибки также возвращаемся на главную
        navigate('/');
      }
    };

    showPaywall();
  }, [presentPaywall, navigate, toast]);

  return (
    <div className="min-h-screen bg-cosmic-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-gold mx-auto mb-4"></div>
        <p className="text-cosmic-secondary">Загрузка страницы покупок...</p>
      </div>
    </div>
  );
};

export default PaywallPage;
