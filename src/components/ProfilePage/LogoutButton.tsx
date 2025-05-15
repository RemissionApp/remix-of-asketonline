
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const LogoutButton: React.FC = () => {
  const { signOut } = useAppStore();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/'); // Navigate to home page after logout
  };
  
  return (
    <Button 
      variant="destructive" 
      className="w-full mb-6 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Выйти</span>
    </Button>
  );
};
