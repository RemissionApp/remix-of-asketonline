
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from '@/hooks/useTranslations';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mt-8">
      <h2 className="text-xl text-white font-serif mb-4">
        {t.privacy?.title || "Политика конфиденциальности"}
      </h2>
      
      <Accordion type="single" collapsible className="text-white">
        <AccordionItem value="data-collection">
          <AccordionTrigger className="text-cosmic-accent">
            {t.privacy?.dataCollectionTitle || "Какие данные мы собираем"}
          </AccordionTrigger>
          <AccordionContent className="text-cosmic-secondary">
            {t.privacy?.dataCollectionText || 
              "Мы собираем ваше имя, дату рождения и аватар для персонализации опыта. " + 
              "Также мы отслеживаем вашу активность в приложении для предоставления персонализированных функций и улучшения сервиса."}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="data-usage">
          <AccordionTrigger className="text-cosmic-accent">
            {t.privacy?.dataUsageTitle || "Как мы используем ваши данные"}
          </AccordionTrigger>
          <AccordionContent className="text-cosmic-secondary">
            {t.privacy?.dataUsageText || 
              "Ваши данные используются для предоставления персонализированного опыта, отслеживания вашего прогресса " +
              "и улучшения наших услуг. Мы никогда не продаем ваши персональные данные третьим лицам."}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="data-security">
          <AccordionTrigger className="text-cosmic-accent">
            {t.privacy?.dataSecurityTitle || "Безопасность данных"}
          </AccordionTrigger>
          <AccordionContent className="text-cosmic-secondary">
            {t.privacy?.dataSecurityText || 
              "Мы принимаем технические, административные и физические меры для защиты ваших персональных данных " +
              "от несанкционированного доступа. Ваши данные шифруются и хранятся на защищенных серверах."}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="user-rights">
          <AccordionTrigger className="text-cosmic-accent">
            {t.privacy?.userRightsTitle || "Ваши права"}
          </AccordionTrigger>
          <AccordionContent className="text-cosmic-secondary">
            {t.privacy?.userRightsText || 
              "Вы имеете право на доступ, исправление или удаление ваших персональных данных. " +
              "Вы также можете в любое время отозвать свое согласие или запросить копию своих данных. " +
              "Для осуществления этих прав свяжитесь с нами через приложение."}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
