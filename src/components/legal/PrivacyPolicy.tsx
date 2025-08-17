import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslations } from '@/hooks/useTranslations';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslations();

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-cosmic-text">
          {t.legal?.privacyPolicyTitle || 'Политика конфиденциальности Asket App'}
        </CardTitle>
        <p className="text-sm text-cosmic-muted">
          {t.legal?.lastUpdated || 'Дата последнего обновления'}: {t.legal?.currentDate || '17 августа 2025 г.'}
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6 text-cosmic-text">
            <section>
              <h3 className="text-lg font-semibold mb-3 text-cosmic-primary">
                {t.legal?.introduction || 'Введение'}
              </h3>
              <p className="text-sm leading-relaxed">
                {t.legal?.introText || 'Добро пожаловать в Asket App! Мы ценим ваше доверие и стремимся обеспечить максимальную прозрачность в отношении обработки ваших личных данных. Эта Политика конфиденциальности объясняет, как Asket App собирает, использует, хранит и защищает информацию, которую вы предоставляете нам при использовании нашего приложения, доступного на различных платформах, включая мобильные устройства (Android, iOS), веб-браузеры и Telegram Mini App.'}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-cosmic-primary">
                {t.legal?.dataCollected || '1. Информация, которую мы собираем'}
              </h3>

              <div className="mb-4">
                <h4 className="font-medium mb-2">
                  {t.legal?.directData || 'Информация, которую вы предоставляете напрямую:'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>
                    <strong>{t.legal?.registrationData || 'Регистрационные данные:'}</strong> {t.legal?.registrationDataText || 'Имя пользователя, адрес электронной почты, пароль (в зашифрованном виде).'}
                  </li>
                  <li>
                    <strong>{t.legal?.profileData || 'Данные профиля:'}</strong> {t.legal?.profileDataText || 'Дата рождения (для определения знака зодиака и нумерологии), аватар.'}
                  </li>
                  <li>
                    <strong>{t.legal?.usageData || 'Данные об использовании приложения:'}</strong> {t.legal?.usageDataText || 'Информация об аскезах, медитациях, вопросах, заданных Вселенной, выполненных миссиях и достижениях, ваши записи в дневнике рефлексии (если применимо).'}
                  </li>
                  <li>
                    <strong>{t.legal?.paymentData || 'Платежная информация:'}</strong> {t.legal?.paymentDataText || 'Если вы приобретаете платные функции (например, подписки или одноразовые покупки), мы получаем подтверждение покупки и токены транзакции от соответствующей платформы. Сами платежные данные не хранятся нами напрямую.'}
                  </li>
                  <li>
                    <strong>{t.legal?.voiceData || 'Данные голосового взаимодействия:'}</strong> {t.legal?.voiceDataText || 'Если вы используете функцию звонков с ИИ, мы можем собирать и анализировать аудиозаписи ваших разговоров. Эти данные не привязываются к вашему профилю и используются исключительно для генерации ответов от ИИ.'}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  {t.legal?.automaticData || 'Автоматически собираемая информация:'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>
                    <strong>{t.legal?.deviceData || 'Данные об устройстве и платформе:'}</strong> {t.legal?.deviceDataText || 'Тип устройства, операционная система, уникальные идентификаторы устройства, IP-адрес, тип браузера, версия приложения.'}
                  </li>
                  <li>
                    <strong>{t.legal?.usageStats || 'Данные об использовании:'}</strong> {t.legal?.usageStatsText || 'Время, проведенное в приложении, страницы, которые вы посещаете, функции, которыми вы пользуетесь, частота использования, информация о сбоях.'}
                  </li>
                  <li>
                    <strong>{t.legal?.locationData || 'Данные о местоположении:'}</strong> {t.legal?.locationDataText || 'Приложение не запрашивает и не использует геоданные.'}
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-cosmic-primary">
                {t.legal?.dataUse || '2. Как мы используем вашу информацию'}
              </h3>
              <p className="text-sm mb-3">
                {t.legal?.dataUseText || 'Мы используем собранную информацию для следующих целей:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>
                  <strong>{t.legal?.provideServices || 'Предоставление и поддержка сервиса:'}</strong> {t.legal?.provideServicesText || 'Обеспечение работы Asket App на всех доступных платформах, предоставление персонализированного духовного пути, отслеживание прогресса в аскезах и медитациях.'}
                </li>
                <li>
                  <strong>{t.legal?.personalization || 'Персонализация:'}</strong> {t.legal?.personalizationText || 'Предоставление ответов от Вселенной, астрологических данных и гороскопов, адаптированных к вашему профилю.'}
                </li>
                <li>
                  <strong>{t.legal?.voiceProcessing || 'Обработка голосовых запросов:'}</strong> {t.legal?.voiceProcessingText || 'Аудиозаписи ваших звонков с ИИ используются для преобразования речи в текст с помощью Eleven Labs и последующей генерации ответов через OpenAI. Эти данные обрабатываются в реальном времени и не сохраняются для дальнейшего использования.'}
                </li>
                <li>
                  <strong>{t.legal?.communication || 'Коммуникация:'}</strong> {t.legal?.communicationText || 'Отправка push-уведомлений (напоминания об аскезах, напутствия от Вселенной, уведомления о достижениях).'}
                </li>
                <li>
                  <strong>{t.legal?.improvement || 'Улучшение сервиса:'}</strong> {t.legal?.improvementText || 'Понимание того, как пользователи взаимодействуют с приложением для улучшения функционала.'}
                </li>
                <li>
                  <strong>{t.legal?.security || 'Безопасность:'}</strong> {t.legal?.securityText || 'Защита от мошенничества, обеспечение безопасности данных, соблюдение применимых законов.'}
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-cosmic-primary">
                {t.legal?.dataSharing || '3. Передача и раскрытие информации'}
              </h3>
              <p className="text-sm mb-3">
                {t.legal?.dataSharingText || 'Мы не продаем и не передаем вашу личную информацию третьим лицам, за исключением следующих случаев:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>
                  <strong>{t.legal?.serviceProviders || 'С поставщиками услуг:'}</strong> {t.legal?.serviceProvidersText || 'Supabase для базы данных и аутентификации, OpenAI для генерации ответов AI, Eleven Labs для преобразования текста в речь и синтеза голоса, аналитические сервисы, платежные провайдеры. Эти поставщики обязуются соблюдать конфиденциальность. Ваши голосовые данные передаются Eleven Labs для обработки, но не сохраняются у них или у нас после завершения звонка.'}
                </li>
                <li>
                  <strong>{t.legal?.consent || 'С вашего согласия:'}</strong> {t.legal?.consentText || 'Мы можем делиться информацией, если вы дадите нам явное согласие.'}
                </li>
                <li>
                  <strong>{t.legal?.legal || 'По закону:'}</strong> {t.legal?.legalText || 'Если этого требует закон, судебное постановление или другой юридический процесс.'}
                </li>
                <li>
                  <strong>{t.legal?.protection || 'Для защиты наших прав:'}</strong> {t.legal?.protectionText || 'Для защиты прав, собственности или безопасности Asket App, наших пользователей или общественности.'}
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-cosmic-primary">
                {t.legal?.dataSecurity || '4. Хранение и безопасность данных'}
              </h3>
              <p className="text-sm mb-3">
                {t.legal?.dataSecurityText || 'Мы принимаем разумные технические и организационные меры для защиты вашей личной информации от несанкционированного доступа, использования, изменения или уничтожения. Ваши данные хранятся на защищенных серверах Supabase, с использованием шифрования и контроля доступа.'}
              </p>
              <p className="text-sm">
                {t.legal?.voiceSecurity || 'Голосовые данные, используемые для звонков с ИИ, обрабатываются в реальном времени и не сохраняются на наших серверах или серверах наших партнеров.'}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-cosmic-primary">
                {t.legal?.userRights || '5. Ваши права'}
              </h3>
              <p className="text-sm mb-3">
                {t.legal?.userRightsText || 'В зависимости от вашего местоположения и применимых законов, у вас могут быть следующие права:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>
                  <strong>{t.legal?.accessRight || 'Право на доступ:'}</strong> {t.legal?.accessRightText || 'Вы можете запросить доступ к данным, которые мы храним о вас.'}
                </li>
                <li>
                  <strong>{t.legal?.correctionRight || 'Право на исправление:'}</strong> {t.legal?.correctionRightText || 'Вы можете запросить исправление неточных или неполных данных.'}
                </li>
                <li>
                  <strong>{t.legal?.deletionRight || 'Право на удаление:'}</strong> {t.legal?.deletionRightText || 'Вы можете запросить удаление ваших личных данных.'}
                </li>
                <li>
                  <strong>{t.legal?.restrictionRight || 'Право на ограничение обработки:'}</strong> {t.legal?.restrictionRightText || 'Вы можете запросить ограничение обработки ваших данных.'}
                </li>
                <li>
                  <strong>{t.legal?.objectionRight || 'Право на возражение:'}</strong> {t.legal?.objectionRightText || 'Вы можете возразить против обработки ваших данных в определенных целях.'}
                </li>
                <li>
                  <strong>{t.legal?.portabilityRight || 'Право на переносимость данных:'}</strong> {t.legal?.portabilityRightText || 'Вы можете запросить получение ваших данных в структурированном формате.'}
                </li>
              </ul>
              <p className="text-sm mt-3">
                {t.legal?.contactRights || 'Для реализации этих прав, пожалуйста, свяжитесь с нами по адресу'} <strong>info@remissionsoft.com</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-cosmic-primary">
                {t.legal?.policyChanges || '6. Изменения в Политике конфиденциальности'}
              </h3>
              <p className="text-sm">
                {t.legal?.policyChangesText || 'Мы можем время от времени обновлять эту Политику конфиденциальности. Мы уведомим вас о любых существенных изменениях, разместив новую Политику конфиденциальности в приложении или на нашем веб-сайте, за 30 дней до вступления изменений в силу. Рекомендуем периодически просматривать эту Политику.'}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-cosmic-primary">
                {t.legal?.contact || '7. Контакты'}
              </h3>
              <p className="text-sm">
                {t.legal?.contactText || 'Если у вас есть вопросы или опасений по поводу этой Политики конфиденциальности, пожалуйста, свяжитесь с нами по адресу:'} <strong>info@remissionsoft.com</strong>
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
