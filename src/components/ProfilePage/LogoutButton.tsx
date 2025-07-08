
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import { cleanupAuthState } from '@/lib/supabase';

export const LogoutButton: React.FC = () => {
  const { signOut } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslations();
  
  const handleLogout = async () => {
    // Очищаем состояние аутентификации перед выходом
    cleanupAuthState();
    
    // Выполняем выход
    await signOut();
    
    // Принудительно перенаправляем на страницу входа
    navigate('/login'); 
  };
  
  return (
    <Button 
      className="w-full bg-cosmic-accent/20 hover:bg-cosmic-accent/30 text-white border border-cosmic-accent/30 font-sans"
      onClick={handleLogout}
    >
      <span>{t.userProfile?.logout || "Выход"}</span>
    </Button>
  );
};
