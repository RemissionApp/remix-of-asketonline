
import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { WidgetService, WidgetConfig } from '@/services/WidgetService';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Quote, BookCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

export const WidgetSettings: React.FC = () => {
  const { t } = useTranslations();
  const { pacts, dailyQuote } = useAppStore();
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  
  // Инициализация виджетов при загрузке компонента
  useEffect(() => {
    const widgetAvailable = WidgetService.isWidgetsAvailable();
    setIsAvailable(widgetAvailable);
    
    if (widgetAvailable) {
      // Загружаем существующие конфигурации или создаем дефолтные
      const existingConfigs = WidgetService.getWidgetConfigs();
      
      if (existingConfigs.length > 0) {
        setWidgets(existingConfigs);
      } else {
        // Создаем дефолтные конфигурации
        const defaultWidgets: WidgetConfig[] = [
          {
            id: 'quote-widget',
            type: 'quote',
            enabled: false,
            refreshInterval: 720, // 12 часов
            displayData: null
          },
          {
            id: 'ascesis-widget',
            type: 'ascesis',
            enabled: false,
            refreshInterval: 60, // 1 час
            displayData: null
          },
          {
            id: 'meditation-widget',
            type: 'meditation',
            enabled: false,
            refreshInterval: 1440, // 24 часа
            displayData: null
          }
        ];
        
        setWidgets(defaultWidgets);
      }
    }
  }, []);
  
  // Обработчик изменения статуса виджета
  const handleWidgetToggle = (id: string, enabled: boolean) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === id ? { ...widget, enabled } : widget
      )
    );
  };
  
  // Функция для сохранения настроек виджетов
  const saveWidgetSettings = async () => {
    try {
      // Сохраняем конфигурации всех виджетов
      for (const widget of widgets) {
        await WidgetService.saveWidgetConfig(widget);
      }
      
      // Обновляем данные для активных виджетов
      const quoteWidget = widgets.find(w => w.type === 'quote' && w.enabled);
      if (quoteWidget && dailyQuote) {
        await WidgetService.updateQuoteWidgetData(dailyQuote, '');
      }
      
      const ascesisWidget = widgets.find(w => w.type === 'ascesis' && w.enabled);
      if (ascesisWidget && pacts.length > 0) {
        const activePact = pacts.find(p => p.status === 'active');
        if (activePact) {
          await WidgetService.updateAscesisWidgetData(
            activePact.title, 
            activePact.days_completed, 
            activePact.days_total
          );
        }
      }
      
      toast({
        title: "Настройки виджетов сохранены",
        description: "Изменения будут применены на главном экране устройства",
        variant: "default"
      });
    } catch (error) {
      console.error('Ошибка при сохранении настроек виджетов:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки виджетов",
        variant: "destructive"
      });
    }
  };
  
  // Если виджеты недоступны, показываем сообщение
  if (!isAvailable) {
    return (
      <div className="text-cosmic-secondary text-sm">
        Виджеты доступны только в нативном мобильном приложении
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <p className="text-cosmic-secondary text-sm mb-4">
        Настройте виджеты для отображения на главном экране вашего устройства
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Виджет цитаты дня */}
        <Card className="cosmic-card backdrop-blur-sm bg-cosmic-dark/40 border-cosmic-accent/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Quote className="h-5 w-5 mr-2 text-cosmic-accent" />
                <Label className="text-cosmic-light">Цитата дня</Label>
              </div>
              <Switch
                checked={widgets.find(w => w.id === 'quote-widget')?.enabled || false}
                onCheckedChange={(checked) => handleWidgetToggle('quote-widget', checked)}
              />
            </div>
            <p className="text-cosmic-secondary text-xs">
              Отображает ежедневную цитату на главном экране
            </p>
          </CardContent>
        </Card>
        
        {/* Виджет аскезы */}
        <Card className="cosmic-card backdrop-blur-sm bg-cosmic-dark/40 border-cosmic-accent/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <BookCheck className="h-5 w-5 mr-2 text-cosmic-accent" />
                <Label className="text-cosmic-light">Прогресс аскезы</Label>
              </div>
              <Switch
                checked={widgets.find(w => w.id === 'ascesis-widget')?.enabled || false}
                onCheckedChange={(checked) => handleWidgetToggle('ascesis-widget', checked)}
              />
            </div>
            <p className="text-cosmic-secondary text-xs">
              Показывает прогресс выполнения активной аскезы
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Button 
        onClick={saveWidgetSettings} 
        className="w-full mt-4"
      >
        <LayoutGrid className="mr-2 h-4 w-4" />
        Сохранить настройки виджетов
      </Button>
    </div>
  );
};
