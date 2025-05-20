import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import MainPage from '@/pages/MainPage';
import ProfilePage from '@/pages/ProfilePage';
import LegalPage from '@/pages/LegalPage';
import { useAppStore } from './store/useAppStore';
import { supabase } from './lib/supabase';
import { fetchUserProfile } from './utils/profile';
import { fetchPacts } from './utils/pacts';
import { fetchMissions } from './utils/missions';
import { fetchUniverseQuestions } from './utils/universeQuestions';
import { fetchAchievements } from './utils/achievements';
import { fetchAllTranslations } from './utils/translations';
import { Language } from './types/Language';
import SupportPage from './pages/SupportPage';

const App: React.FC = () => {
  const { setUserProfile, setPacts, setMissions, setUniverseQuestions, setAchievements, setTranslations, language } = useAppStore();
  
  useEffect(() => {
    const fetchData = async () => {
      const user = supabase.auth.user();
      
      if (user) {
        // Fetch user-specific data
        const profile = await fetchUserProfile(user.id);
        setUserProfile(profile);
        
        const pacts = await fetchPacts(user.id);
        setPacts(pacts);
        
        const missions = await fetchMissions(user.id);
        setMissions(missions);
        
        const universeQuestions = await fetchUniverseQuestions(user.id);
        setUniverseQuestions(universeQuestions);
        
        const achievements = await fetchAchievements(user.id);
        setAchievements(achievements);
      }
      
      // Fetch translations (no user id needed)
      const translations = await fetchAllTranslations(language);
      setTranslations(translations);
    };
    
    fetchData();
    
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        fetchData();
      }
      if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setPacts([]);
        setMissions([]);
        setUniverseQuestions([]);
        setAchievements([]);
      }
    });
    
    // Unsubscribe from auth state changes when the component unmounts
    return () => {
      authListener?.unsubscribe();
    };
  }, [setUserProfile, setPacts, setMissions, setUniverseQuestions, setAchievements, setTranslations, language]);
  
  useEffect(() => {
    const updateTranslations = async () => {
      const translations = await fetchAllTranslations(language);
      setTranslations(translations);
    };
    
    updateTranslations();
  }, [language, setTranslations]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
    },
    {
      path: "/legal",
      element: <LegalPage />,
    },
    {
      path: "/support",
      element: <SupportPage />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default App;
