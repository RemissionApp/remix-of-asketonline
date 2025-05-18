
import React from 'react';
import { LogOut } from 'lucide-react';
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
      variant="destructive" 
      className="w-full mb-6 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30 font-sans"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-5 w-5" />
      <span>{t.userProfile?.logout || "Выход"}</span>
    </Button>
  );
};
