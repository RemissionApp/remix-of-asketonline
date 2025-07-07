import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { installPWA, isPWAInstalled } from '@/utils/pwaUtils';

interface PWAInstallPromptProps {
  onClose?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onClose }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Проверяем, не установлено ли уже приложение
    if (isPWAInstalled()) {
      return;
    }

    // Проверяем, показывали ли уже промпт
    const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
    if (hasSeenPrompt) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      const result = await installPWA();
      if (result) {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
    onClose?.();
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-cosmic-dark/95 backdrop-blur-sm border-cosmic-gold/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Download className="text-cosmic-gold w-5 h-5" />
              <h3 className="text-cosmic-light font-medium">Установить приложение</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-cosmic-muted hover:text-cosmic-light"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-cosmic-muted text-sm mb-4">
            Установите Cosmic Path на свое устройство для быстрого доступа и уведомлений
          </p>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleInstall}
              className="flex-1 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
              size="sm"
            >
              Установить
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="border-cosmic-gold/20 text-cosmic-muted hover:text-cosmic-light"
            >
              Позже
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};