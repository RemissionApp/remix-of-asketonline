import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
import { isToday } from 'date-fns';

export const MissionReminder: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show if there's an active mission
    if (userProfile?.activeMission) {
      const mission = userProfile.activeMission;

      // Check if today's task is completed
      const lastCompletedDate = mission.progress
        ?.filter(p => p.completed)
        ?.map(p => new Date(p.date))
        ?.sort((a, b) => b.getTime() - a.getTime())[0];

      const todayCompleted = lastCompletedDate && isToday(lastCompletedDate);

      // Only show reminder if today's task is not completed
      if (!todayCompleted) {
        // Wait a bit before showing the reminder
        const timer = setTimeout(() => setVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [userProfile]);

  if (!visible || !userProfile?.activeMission) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
  };

  const handleClick = () => {
    navigate('/cosmic-missions');
    setVisible(false);
  };

  const getReminderText = () => {
    switch (language) {
      case 'ru':
        return 'У вас есть невыполненная задача в миссии';
      case 'es':
        return 'Tienes una tarea pendiente en tu misión';
      default:
        return 'You have a pending mission task';
    }
  };

  return (
    <div
      className="fixed bottom-20 right-4 max-w-xs z-50 bg-cosmic-dark/80 backdrop-blur-md border border-cosmic-accent/20 p-3 rounded-lg shadow-lg animate-fade-in cursor-pointer"
      onClick={handleClick}
    >
      <button
        className="absolute top-1 right-1 text-cosmic-secondary hover:text-white"
        onClick={handleClose}
      >
        <X size={16} />
      </button>

      <div className="flex items-center">
        <Clock size={16} className="text-cosmic-gold mr-2 flex-shrink-0" />
        <p className="text-xs text-cosmic-gold">{getReminderText()}</p>
      </div>
    </div>
  );
};
