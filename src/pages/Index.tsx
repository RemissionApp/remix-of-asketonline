
import React from 'react';
import { useAppStore } from '@/store/useAppStore';

// Import Zustand store
import { create } from 'zustand';

const Index = () => {
  // Automatically redirect to the main app
  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic">
      <div className="text-center text-white">
        <h1 className="text-4xl font-serif mb-4 cosmic-gradient-text">ASKET</h1>
        <p className="text-xl text-cosmic-secondary">Путь к внутренней силе</p>
      </div>
    </div>
  );
};

export default Index;
