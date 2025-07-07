import React, { useState } from 'react';
import { Send, Bell, Clock, Trophy, MessageCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PushNotificationService } from '@/utils/notifications/pushNotificationService';
import { supabase } from '@/lib/supabase';

const notificationTypes = [
  { value: 'test', label: 'Тестовое уведомление', icon: Bell },
  { value: 'daily_reminder', label: 'Ежедневное напоминание', icon: Clock },
  { value: 'pact_start', label: 'Начало аскезы', icon: Bell },
  { value: 'pact_complete', label: 'Завершение аскезы', icon: Trophy },
  { value: 'meditation_reminder', label: 'Напоминание о медитации', icon: Bell },
  { value: 'universe_message', label: 'Сообщение от Вселенной', icon: MessageCircle },
  { value: 'achievement', label: 'Новое достижение', icon: Trophy },
  { value: 'subscription_reminder', label: 'Напоминание о подписке', icon: CreditCard },
];

export const NotificationTester: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('test');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendTestNotification = async () => {
    if (!title || !body) {
      toast({
        title: "Заполните все поля",
        description: "Введите заголовок и текст уведомления",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      const success = await PushNotificationService.send({
        type: selectedType as any,
        title,
        body,
        userId: user.id,
        data: {
          testMode: true,
          timestamp: Date.now(),
        },
      });

      if (success) {
        toast({
          title: "Уведомление отправлено",
          description: "Проверьте, получили ли вы push-уведомление",
        });
      } else {
        throw new Error('Не удалось отправить уведомление');
      }
    } catch (error) {
      console.error('Ошибка отправки тестового уведомления:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить уведомление",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const fillExampleData = (type: string) => {
    const examples = {
      test: {
        title: 'Тестовое уведомление',
        body: 'Поздравляем! Push-уведомления работают корректно 🎉'
      },
      daily_reminder: {
        title: 'Ежедневное напоминание',
        body: 'Не забудьте подтвердить выполнение вашей аскезы'
      },
      pact_start: {
        title: 'Начало аскезы',
        body: 'Ваша аскеза "Медитация каждый день" начинается сегодня! 🚀'
      },
      pact_complete: {
        title: 'Аскеза завершена! 🎉',
        body: 'Поздравляем! Вы успешно завершили "Медитация каждый день"'
      },
      meditation_reminder: {
        title: 'Время медитации 🧘‍♀️',
        body: 'Найдите несколько минут для медитативной практики'
      },
      universe_message: {
        title: 'Сообщение от Вселенной ✨',
        body: 'Ваш путь к просветлению продолжается! Каждый день - это новая возможность стать лучше'
      },
      achievement: {
        title: 'Новое достижение! 🏆',
        body: 'Вы получили достижение: Первые шаги на пути просветления'
      },
      subscription_reminder: {
        title: 'Напоминание о подписке',
        body: 'Ваша PRO-подписка скоро истекает. Продлите её, чтобы не потерять доступ к премиум-функциям'
      }
    };

    const example = examples[type as keyof typeof examples];
    if (example) {
      setTitle(example.title);
      setBody(example.body);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Тестирование Push-уведомлений
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Тип уведомления</label>
          <Select value={selectedType} onValueChange={(value) => {
            setSelectedType(value);
            fillExampleData(value);
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {notificationTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Заголовок</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите заголовок уведомления"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Текст сообщения</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Введите текст уведомления"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={sendTestNotification}
            disabled={isSending || !title || !body}
            className="flex-1"
          >
            {isSending ? 'Отправляется...' : 'Отправить тестовое уведомление'}
          </Button>
          
          <Button
            onClick={() => fillExampleData(selectedType)}
            variant="outline"
          >
            Пример
          </Button>
        </div>

        <div className="text-xs text-cosmic-muted border-t pt-4">
          <p><strong>Примечание:</strong> Уведомление будет отправлено только вам. 
          Убедитесь, что у вас включены push-уведомления в настройках браузера.</p>
        </div>
      </CardContent>
    </Card>
  );
};