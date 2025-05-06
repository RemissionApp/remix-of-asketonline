
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAppStore } from "./store/useAppStore";
import OnboardingPage from "./pages/OnboardingPage";
import MainPage from "./pages/MainPage";
import CreatePactPage from "./pages/CreatePactPage";
import UniversePage from "./pages/UniversePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { activeScreen, onboardingComplete } = useAppStore();
  
  if (!onboardingComplete) {
    return <OnboardingPage />;
  }
  
  switch (activeScreen) {
    case 'main':
      return <MainPage />;
    case 'create-pact':
      return <CreatePactPage />;
    case 'universe':
      return <UniversePage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return <MainPage />;
  }
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
