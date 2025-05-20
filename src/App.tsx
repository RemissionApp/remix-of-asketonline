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
import SupportPage from './pages/SupportPage';

const App: React.FC = () => {
  const { 
    setUserProfile, 
    setPacts, 
    setMissions, 
    setUniverseQuestions, 
    setAchievements, 
    setTranslations, 
    language, 
    userProfile,
    user,
    updateUserProfile,
    loadPacts,
    loadUniverseQuestions
  } = useAppStore();
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch user-specific data
        try {
          // Get the user's profile from supabase
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileData && !profileError) {
            setUserProfile({
              ...userProfile,
              name: profileData.name || 'Искатель',
              email: profileData.email || '',
              birthDate: profileData.birth_date || null,
              avatar_url: profileData.avatar_url || null,
              id: profileData.id
            });
          }
        
          // Load pacts, missions and other data
          await loadPacts();
          await loadUniverseQuestions();
          
          // These methods would need to be implemented properly
          // Currently using placeholder empty arrays
          setMissions([]);
          setAchievements(userProfile.achievements);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      
      // Load translations (mock implementation)
      setTranslations({
        main: { profile: "Профиль" },
        support: { 
          title: "Поддержка",
          description: "Нужна помощь? Наша служба поддержки готова помочь вам с любыми вопросами.",
          contactUs: "Связаться с поддержкой",
          responseTime: "Мы обычно отвечаем в течение 24 часов в рабочие дни."
        }
      });
    };
    
    fetchData();
    
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchData();
      }
      if (event === 'SIGNED_OUT') {
        setUserProfile({
          name: 'Искатель',
          email: '',
          age: null,
          energyPoints: 0,
          goal: 'Познать свою истинную силу',
          isPro: false,
          rank: 'seeker',
          zodiacSign: '',
          totalDays: 0,
          achievements: [...userProfile.achievements],
          birthDate: null,
          avatar_url: null,
          activeMission: undefined,
          id: undefined
        });
        setPacts([]);
        setMissions([]);
        setUniverseQuestions([]);
      }
    });
    
    // Unsubscribe from auth state changes when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUserProfile, setPacts, setMissions, setUniverseQuestions, setAchievements, setTranslations, language]);

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
