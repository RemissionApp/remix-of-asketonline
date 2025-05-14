
import React from 'react';
import { Briefcase, Heart, Thermometer, Star } from "lucide-react";

interface HoroscopeSectionProps {
  content: string;
}

export const WorkSection: React.FC<HoroscopeSectionProps> = ({ content }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="text-cosmic-gold w-5 h-5" />
        <h3 className="text-white font-medium">💼 Работа и финансы</h3>
      </div>
      <p className="text-cosmic-secondary">{content}</p>
    </div>
  );
};

export const LoveSection: React.FC<HoroscopeSectionProps> = ({ content }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Heart className="text-cosmic-gold w-5 h-5" />
        <h3 className="text-white font-medium">💖 Любовь и отношения</h3>
      </div>
      <p className="text-cosmic-secondary">{content}</p>
    </div>
  );
};

export const HealthSection: React.FC<HoroscopeSectionProps> = ({ content }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Thermometer className="text-cosmic-gold w-5 h-5" />
        <h3 className="text-white font-medium">🧘‍♂️ Здоровье и самочувствие</h3>
      </div>
      <p className="text-cosmic-secondary">{content}</p>
    </div>
  );
};

export const AdviceSection: React.FC<HoroscopeSectionProps> = ({ content }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Star className="text-cosmic-gold w-5 h-5" />
        <h3 className="text-white font-medium">🌟 Совет дня</h3>
      </div>
      <p className="text-cosmic-secondary">{content}</p>
    </div>
  );
};

export const parseHoroscopeSections = (text: string): { 
  work: string; 
  love: string; 
  health: string; 
  advice: string;
} => {
  // Default empty sections
  const sections = {
    work: '',
    love: '',
    health: '',
    advice: ''
  };
  
  try {
    // Try to parse with emojis as section markers
    if (text.includes('💼')) {
      // Work section
      const workStart = text.indexOf('💼');
      const workEnd = Math.min(
        text.indexOf('💖') > workStart ? text.indexOf('💖') : Number.MAX_VALUE,
        text.indexOf('🧘‍♂️') > workStart ? text.indexOf('🧘‍♂️') : Number.MAX_VALUE,
        text.indexOf('🌟') > workStart ? text.indexOf('🌟') : Number.MAX_VALUE
      );
      
      if (workEnd > workStart) {
        sections.work = text.substring(workStart, workEnd).replace(/^💼\s*[^a-zA-Zа-яА-Я]*/, '').trim();
      }
    }
    
    if (text.includes('💖')) {
      // Love section
      const loveStart = text.indexOf('💖');
      const loveEnd = Math.min(
        text.indexOf('🧘‍♂️') > loveStart ? text.indexOf('🧘‍♂️') : Number.MAX_VALUE,
        text.indexOf('🌟') > loveStart ? text.indexOf('🌟') : Number.MAX_VALUE
      );
      
      if (loveEnd > loveStart) {
        sections.love = text.substring(loveStart, loveEnd).replace(/^💖\s*[^a-zA-Zа-яА-Я]*/, '').trim();
      }
    }
    
    if (text.includes('🧘‍♂️')) {
      // Health section
      const healthStart = text.indexOf('🧘‍♂️');
      const healthEnd = text.indexOf('🌟') > healthStart ? text.indexOf('🌟') : text.length;
      
      if (healthEnd > healthStart) {
        sections.health = text.substring(healthStart, healthEnd).replace(/^🧘‍♂️\s*[^a-zA-Zа-яА-Я]*/, '').trim();
      }
    }
    
    if (text.includes('🌟')) {
      // Advice section
      const adviceStart = text.indexOf('🌟');
      sections.advice = text.substring(adviceStart).replace(/^🌟\s*[^a-zA-Zа-яА-Я]*/, '').trim();
    }
    
    // Alternative parsing with section titles if emojis didn't work
    if (!sections.work && !sections.love && !sections.health && !sections.advice) {
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        
        if (line.includes('работа') || line.includes('work') || line.includes('финанс') || line.includes('financ')) {
          sections.work = lines[i + 1] || '';
        } else if (line.includes('любовь') || line.includes('love') || line.includes('отношения') || line.includes('relation')) {
          sections.love = lines[i + 1] || '';
        } else if (line.includes('здоровье') || line.includes('health') || line.includes('самочувств')) {
          sections.health = lines[i + 1] || '';
        } else if (line.includes('совет') || line.includes('advice')) {
          sections.advice = lines[i + 1] || '';
        }
      }
    }
    
    // Final fallback - just split text into 4 parts if we couldn't parse it properly
    if (!sections.work && !sections.love && !sections.health && !sections.advice) {
      const paragraphs = text.split('\n\n');
      if (paragraphs.length >= 4) {
        sections.work = paragraphs[0];
        sections.love = paragraphs[1];
        sections.health = paragraphs[2];
        sections.advice = paragraphs[3];
      } else if (text) {
        // Last resort - just put all text in work section
        sections.work = text;
      }
    }
    
  } catch (error) {
    console.error('Error parsing horoscope sections:', error);
  }
  
  return sections;
};
