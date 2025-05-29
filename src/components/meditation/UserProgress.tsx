
import React from 'react';
import { Trophy, TrendingUp, Heart, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
}

interface UserProgressProps {
  consecutiveDays: number;
  unlockedLevel: string;
  weeklyProgress: number[];
  achievements: Achievement[];
}

export const UserProgress: React.FC<UserProgressProps> = ({
  consecutiveDays,
  unlockedLevel,
  weeklyProgress,
  achievements
}) => {
  const weekTotal = weeklyProgress.reduce((sum, day) => sum + day, 0);
  const weekAverage = weekTotal / 7;

  return (
    <div className="p-6 space-y-6">
      {/* Current Streak */}
      <div className="bg-gradient-to-r from-cosmic-accent/20 to-cosmic-gold/20 backdrop-blur-sm border border-cosmic-accent/30 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-cosmic-gold" size={24} />
          <div>
            <h3 className="text-white font-medium">Серия медитаций</h3>
            <p className="text-cosmic-secondary text-sm">Пройдено {consecutiveDays} дней подряд</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-cosmic-gold mb-1">
          🔥 {consecutiveDays} дней
        </div>
        <p className="text-sm text-cosmic-accent">Разблокирован уровень: {unlockedLevel}</p>
      </div>

      {/* Weekly Progress Chart */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-cosmic-accent" size={20} />
          <h3 className="text-white font-medium">Прогресс за неделю</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-cosmic-secondary mb-1">{day}</div>
              <div 
                className="w-full h-12 bg-cosmic-dark/40 rounded border border-cosmic-accent/20 flex items-end justify-center"
              >
                <div 
                  className="w-6 bg-gradient-to-t from-cosmic-accent to-cosmic-gold rounded-t"
                  style={{ height: `${(weeklyProgress[index] / 60) * 100}%` }}
                />
              </div>
              <div className="text-xs text-cosmic-secondary mt-1">
                {weeklyProgress[index]}м
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-cosmic-secondary">
            Среднее время: {Math.round(weekAverage)} минут в день
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="text-cosmic-accent" size={20} />
          <h3 className="text-white font-medium">Достижения</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {achievements.slice(0, 4).map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-3 rounded-lg border ${
                achievement.unlocked 
                  ? 'bg-cosmic-accent/20 border-cosmic-accent/40' 
                  : 'bg-cosmic-dark/40 border-cosmic-accent/20'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className={`text-sm font-medium ${
                  achievement.unlocked ? 'text-cosmic-accent' : 'text-cosmic-secondary'
                }`}>
                  {achievement.title}
                </div>
                {achievement.progress !== undefined && !achievement.unlocked && (
                  <Progress 
                    value={achievement.progress} 
                    className="mt-2 h-1"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
