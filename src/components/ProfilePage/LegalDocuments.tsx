
import React, { useState } from 'react';
import { Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const LegalDocuments: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  
  return (
    <>
      <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-5 mb-8">
        <h3 className="text-white font-medium mb-4 font-sans">Правовая информация</h3>
        <div className="flex flex-col gap-3">
          <Button 
            variant="ghost" 
            className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20 font-sans"
            onClick={() => setShowPrivacyPolicy(true)}
          >
            <Shield className="mr-2 h-5 w-5" />
            <span>Политика конфиденциальности</span>
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20 font-sans"
            onClick={() => setShowTermsOfUse(true)}
          >
            <FileText className="mr-2 h-5 w-5" />
            <span>Правила использования</span>
          </Button>
        </div>
      </div>
      
      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="bg-cosmic-dark text-white border-cosmic-accent/30 max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cosmic-accent font-serif">Политика конфиденциальности</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-cosmic-secondary">
            <div className="space-y-4 text-sm font-sans">
              <p>Последнее обновление: 14 мая, 2025</p>
              
              <h3 className="text-white text-base font-medium font-sans">1. Введение</h3>
              <p>Приложение ASKET ("мы", "наши" или "нас") уважает вашу конфиденциальность и стремится защитить ваши персональные данные. Эта политика конфиденциальности объясняет, как мы собираем, используем, раскрываем, обрабатываем и защищаем информацию, которую вы предоставляете при использовании нашего приложения.</p>
              
              <h3 className="text-white text-base font-medium font-sans">2. Собираемая информация</h3>
              <p>Мы собираем следующие типы информации:</p>
              <ul className="list-disc pl-5">
                <li>Информация профиля: имя, электронная почта, цели</li>
                <li>Данные об использовании: информация о ваших пактах, днях соблюдения и взаимодействии с приложением</li>
                <li>Техническая информация: IP-адрес, тип устройства, версия ОС</li>
              </ul>
              
              <h3 className="text-white text-base font-medium font-sans">3. Использование информации</h3>
              <p>Ваша информация используется для:</p>
              <ul className="list-disc pl-5">
                <li>Предоставления и улучшения функций приложения</li>
                <li>Персонализации вашего опыта</li>
                <li>Коммуникации с вами по поводу обновлений</li>
                <li>Аналитики и исследований</li>
              </ul>
              
              <h3 className="text-white text-base font-medium font-sans">4. Безопасность данных</h3>
              <p>Мы используем коммерчески приемлемые меры для защиты ваших данных, но помните, что ни один метод передачи через интернет не является 100% безопасным.</p>
              
              <h3 className="text-white text-base font-medium font-sans">5. Изменения в политике</h3>
              <p>Мы можем обновлять нашу политику конфиденциальности время от времени. Мы уведомим вас о любых изменениях, разместив новую политику конфиденциальности на этой странице.</p>
              
              <h3 className="text-white text-base font-medium font-sans">6. Контакты</h3>
              <p>Если у вас есть вопросы по поводу этой политики конфиденциальности, пожалуйста, свяжитесь с нами по адресу: support@asket-app.com</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      
      {/* Terms of Use Dialog */}
      <Dialog open={showTermsOfUse} onOpenChange={setShowTermsOfUse}>
        <DialogContent className="bg-cosmic-dark text-white border-cosmic-accent/30 max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cosmic-accent font-serif">Правила использования</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-cosmic-secondary">
            <div className="space-y-4 text-sm font-sans">
              <p>Последнее обновление: 14 мая, 2025</p>
              
              <h3 className="text-white text-base font-medium font-sans">1. Принятие условий</h3>
              <p>Используя приложение ASKET, вы соглашаетесь соблюдать настоящие Правила использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наше приложение.</p>
              
              <h3 className="text-white text-base font-medium font-sans">2. Описание услуг</h3>
              <p>Приложение ASKET предоставляет платформу для создания и отслеживания личных пактов аскезы, получения духовных советов и отслеживания личного прогресса. Мы оставляем за собой право изменять, приостанавливать или прекращать любой аспект услуги в любое время.</p>
              
              <h3 className="text-white text-base font-medium font-sans">3. Пользовательские аккаунты</h3>
              <p>Для использования некоторых функций приложения вам необходимо создать аккаунт. Вы несете ответственность за сохранение конфиденциальности своих учетных данных и за все действия, которые происходят под вашей учетной записью.</p>
              
              <h3 className="text-white text-base font-medium font-sans">4. Пользовательский контент</h3>
              <p>Вы сохраняете все права на контент, который вы создаете в приложении. Однако, создавая контент, вы предоставляете нам неисключительную лицензию на использование, воспроизведение и отображение этого контента в связи с работой приложения.</p>
              
              <h3 className="text-white text-base font-medium font-sans">5. Запрещенное поведение</h3>
              <p>Запрещается использовать приложение для незаконных целей или нарушения прав других. Запрещено размещать контент, который:</p>
              <ul className="list-disc pl-5">
                <li>Нарушает законы или права третьих лиц</li>
                <li>Является угрожающим, оскорбительным или дискриминационным</li>
                <li>Содержит вредоносный код</li>
                <li>Вмешивается в нормальную работу приложения</li>
              </ul>
              
              <h3 className="text-white text-base font-medium font-sans">6. Ограничение ответственности</h3>
              <p>Приложение предоставляется "как есть" и "как доступно". Мы не даем никаких гарантий относительно точности, полноты или надежности контента или услуг, предоставляемых через приложение.</p>
              
              <h3 className="text-white text-base font-medium font-sans">7. Изменения в правилах</h3>
              <p>Мы можем изменять эти правила в любое время. Продолжая использовать приложение после таких изменений, вы соглашаетесь с обновленными правилами.</p>
              
              <h3 className="text-white text-base font-medium font-sans">8. Прекращение действия</h3>
              <p>Мы можем прекратить или приостановить ваш доступ к приложению немедленно, без предварительного уведомления или ответственности, по любой причине, включая нарушение этих правил.</p>
              
              <h3 className="text-white text-base font-medium font-sans">9. Контакты</h3>
              <p>Если у вас есть вопросы по поводу этих правил использования, пожалуйста, свяжитесь с нами по адресу: support@asket-app.com</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
