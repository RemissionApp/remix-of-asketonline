
import React from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { GeneratePracticeImageForm } from '@/components/admin/GeneratePracticeImageForm';
import { useAppStore } from '@/store/useAppStore';

const AdminPracticeImagesPage: React.FC = () => {
  const { userProfile } = useAppStore();
  
  // Простая проверка для доступа к админским функциям
  // В реальном приложении должна быть более строгая проверка ролей
  const isAdmin = userProfile?.isPro && userProfile?.rank === 'master';
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cosmic-dark to-black text-white">
        <TopBar title="Доступ запрещен" />
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-2xl font-bold text-cosmic-accent mb-4">Доступ запрещен</h1>
          <p className="text-center">
            Вы не имеете прав для доступа к этой странице. Необходимы PRO аккаунт и ранг "Мастер".
          </p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-dark to-black text-white">
      <TopBar title="Управление изображениями практик" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-cosmic-accent mb-6">Управление изображениями для практик</h1>
        
        <div className="mb-8">
          <GeneratePracticeImageForm />
        </div>
        
        <div className="space-y-6">
          <div className="bg-cosmic-dark/80 rounded-lg p-4 border border-cosmic-accent/30">
            <h2 className="text-xl font-semibold text-cosmic-accent mb-3">Инструкция по генерации изображений</h2>
            <p className="mb-3">
              Эта страница позволяет генерировать визуальные руководства для практик аффирмаций. 
              Чтобы создать качественное изображение:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Используйте детальные промпты, описывающие желаемый визуал</li>
              <li>Указывайте стиль изображения (например, "фото", "иллюстрация", "минимализм")</li>
              <li>Используйте осмысленные имена файлов для удобства управления</li>
              <li>Для каждого шага практики рекомендуется создать отдельное изображение</li>
            </ul>
            <p className="text-cosmic-accent/90">
              Примечание: Сгенерированные изображения автоматически сохраняются в Supabase Storage.
            </p>
          </div>
          
          <div className="bg-cosmic-dark/80 rounded-lg p-4 border border-cosmic-accent/30">
            <h2 className="text-xl font-semibold text-cosmic-accent mb-3">Примеры промптов</h2>
            
            <div className="space-y-3">
              <div className="bg-gray-800/50 p-3 rounded-md">
                <h3 className="font-medium mb-1">Для шага "Найдите тихое место":</h3>
                <p className="text-sm text-gray-300">
                  "Спокойное медитативное пространство с мягким освещением, минималистичный дизайн интерьера с подушками 
                  для медитации. Атмосфера уединения и умиротворения. Фотореалистичная визуализация. Без людей."
                </p>
              </div>
              
              <div className="bg-gray-800/50 p-3 rounded-md">
                <h3 className="font-medium mb-1">Для шага "Сделайте три глубоких вдоха":</h3>
                <p className="text-sm text-gray-300">
                  "Визуализация потока энергии при дыхании, изображенная как светящиеся потоки теплого света, окружающие 
                  силуэт человека. Абстрактная иллюстрация в пурпурных и синих тонах. Спокойное, медитативное настроение."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default AdminPracticeImagesPage;
