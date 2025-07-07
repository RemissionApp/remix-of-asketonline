import React from 'react';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';
import { useAppStore } from '@/store/useAppStore';

interface ShareButtonProps {
  type: 'pact' | 'achievement' | 'wisdom' | 'app';
  data?: {
    title?: string;
    description?: string;
    pactTitle?: string;
    completedDays?: number;
    totalDays?: number;
    wisdom?: string;
  };
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  type,
  data = {},
  variant = 'outline',
  size = 'default',
  className = '',
  children
}) => {
  const { share, haptic, toast } = usePWAFeatures();
  const { language } = useAppStore();

  const handleShare = async () => {
    // Haptic feedback при нажатии
    await haptic.buttonTap();

    try {
      let shareResult;

      switch (type) {
        case 'pact':
          if (data.pactTitle && data.completedDays !== undefined && data.totalDays !== undefined) {
            shareResult = await share.pactProgress(data.pactTitle, data.completedDays, data.totalDays);
          } else {
            throw new Error('Missing pact data for sharing');
          }
          break;

        case 'achievement':
          if (data.title && data.description) {
            shareResult = await share.achievement(data.title, data.description);
          } else {
            throw new Error('Missing achievement data for sharing');
          }
          break;

        case 'wisdom':
          if (data.wisdom) {
            shareResult = await share.universeWisdom(data.wisdom);
          } else {
            throw new Error('Missing wisdom data for sharing');
          }
          break;

        case 'app':
          shareResult = await share.app();
          break;

        default:
          throw new Error(`Unknown share type: ${type}`);
      }

      if (shareResult.success && shareResult.shared) {
        // Успешное haptic feedback
        await haptic.success();
        
        toast({
          title: getSuccessTitle(),
          description: getSuccessDescription(),
          variant: "default"
        });
      } else if (shareResult.success && !shareResult.shared) {
        // Пользователь отменил шаринг
        toast({
          title: getCancelTitle(),
          description: getCancelDescription(),
          variant: "default"
        });
      } else {
        throw new Error(shareResult.error || 'Unknown share error');
      }
    } catch (error: any) {
      console.error('Share error:', error);
      
      // Error haptic feedback
      await haptic.error();
      
      toast({
        title: getErrorTitle(),
        description: getErrorDescription(),
        variant: "destructive"
      });
    }
  };

  const getSuccessTitle = () => {
    switch (language) {
      case 'ru': return 'Успешно поделились!';
      case 'es': return '¡Compartido exitosamente!';
      default: return 'Shared successfully!';
    }
  };

  const getSuccessDescription = () => {
    switch (language) {
      case 'ru': return 'Контент был успешно поделён';
      case 'es': return 'El contenido se compartió exitosamente';
      default: return 'Content was shared successfully';
    }
  };

  const getCancelTitle = () => {
    switch (language) {
      case 'ru': return 'Поделиться отменено';
      case 'es': return 'Compartir cancelado';
      default: return 'Share cancelled';
    }
  };

  const getCancelDescription = () => {
    switch (language) {
      case 'ru': return 'Вы отменили процесс поделиться';
      case 'es': return 'Cancelaste el proceso de compartir';
      default: return 'You cancelled the sharing process';
    }
  };

  const getErrorTitle = () => {
    switch (language) {
      case 'ru': return 'Ошибка при попытке поделиться';
      case 'es': return 'Error al compartir';
      default: return 'Error sharing';
    }
  };

  const getErrorDescription = () => {
    switch (language) {
      case 'ru': return 'Не удалось поделиться контентом. Попробуйте еще раз.';
      case 'es': return 'No se pudo compartir el contenido. Inténtalo de nuevo.';
      default: return 'Failed to share content. Please try again.';
    }
  };

  const getButtonText = () => {
    if (children) return children;
    
    switch (language) {
      case 'ru': return 'Поделиться';
      case 'es': return 'Compartir';
      default: return 'Share';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleShare}
    >
      <Share className="w-4 h-4 mr-2" />
      {getButtonText()}
    </Button>
  );
};