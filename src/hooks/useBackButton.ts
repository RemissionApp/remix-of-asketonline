import { useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const useBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPress = useRef<number>(0);
  const backPressCount = useRef<number>(0);

  useEffect(() => {
    const handleBackButton = () => {
      const now = Date.now();
      const timeDiff = now - lastBackPress.current;

      // Если мы на главной странице
      if (location.pathname === '/' || location.pathname === '/main') {
        // Если прошло больше 2 секунд с последнего нажатия, сбрасываем счетчик
        if (timeDiff > 2000) {
          backPressCount.current = 0;
        }

        backPressCount.current++;
        lastBackPress.current = now;

        if (backPressCount.current === 1) {
          toast('Нажмите "Назад" еще раз для выхода', {
            duration: 2000,
          });
          return false; // Предотвращаем выход из приложения
        } else if (backPressCount.current >= 2) {
          // Выходим из приложения
          App.exitApp();
          return false;
        }
      } else {
        // Для других страниц используем стандартную навигацию
        navigate(-1);
        return false;
      }
    };

    // Добавляем слушатель кнопки "Назад"
    App.addListener('backButton', handleBackButton);

    // Очищаем слушатель при размонтировании компонента
    return () => {
      App.removeAllListeners();
    };
  }, [navigate, location.pathname]);
};
