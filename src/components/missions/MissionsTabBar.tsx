
import React from 'react';
import { useAppStore } from '@/store/useAppStore';

interface MissionsTabBarProps {
  activeTab: 'all' | 'active' | 'completed';
  setActiveTab: (tab: 'all' | 'active' | 'completed') => void;
}

export const MissionsTabBar: React.FC<MissionsTabBarProps> = ({ activeTab, setActiveTab }) => {
  const { language } = useAppStore();
  
  const getTabText = (tab: 'all' | 'active' | 'completed') => {
    if (tab === 'all') {
      return language === 'ru' ? 'Все' : language === 'es' ? 'Todos' : 'All';
    } else if (tab === 'active') {
      return language === 'ru' ? 'Активные' : language === 'es' ? 'Activos' : 'Active';
    } else {
      return language === 'ru' ? 'Завершённые' : language === 'es' ? 'Completados' : 'Completed';
    }
  };

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto">
      {(['all', 'active', 'completed'] as const).map((tab) => (
        <button
          key={tab}
          className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${
            activeTab === tab 
              ? 'bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/30'
              : 'bg-cosmic-dark/30 text-cosmic-secondary border border-cosmic-accent/10'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {getTabText(tab)}
        </button>
      ))}
    </div>
  );
};
