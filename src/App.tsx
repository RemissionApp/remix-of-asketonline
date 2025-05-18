import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NotFound } from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import PracticesPage from "./pages/PracticesPage";
import MeditationsPage from "./pages/MeditationsPage";
import AffirmationsPage from "./pages/AffirmationsPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import SettingsPage from "./pages/SettingsPage";
import BreathingPage from "./pages/BreathingPage";

// Импортируем новую страницу администратора для изображений аффирмаций
import AdminAffirmationImagesPage from "./pages/AdminAffirmationImagesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/practices",
        element: <PracticesPage />,
      },
      {
        path: "/meditations",
        element: <MeditationsPage />,
      },
      {
        path: "/affirmations",
        element: <AffirmationsPage />,
      },
      {
        path: "/mood-tracker",
        element: <MoodTrackerPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
       {
        path: "/breathing",
        element: <BreathingPage />,
      },
      
      // Добавим новый маршрут для страницы администрирования изображений аффирмаций
      {
        path: "/admin-affirmation-images",
        element: <AdminAffirmationImagesPage />,
      },
      
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
