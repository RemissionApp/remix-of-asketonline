
import React from 'react';
import { StarField } from '@/components/StarField';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import { BottomNavigation } from '@/components/BottomNavigation';

const LegalPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Header */}
      <div className="relative z-10 px-4 py-4 flex items-center">
        <button
          className="p-2 text-cosmic-accent"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
          {t.legal?.title || "Правовая информация"}
        </h1>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 py-4 max-w-3xl mx-auto w-full">
        <div className="space-y-6 text-white">
          <section>
            <h2 className="text-2xl font-serif text-cosmic-accent mb-4">
              {t.legal?.termsTitle || "Условия использования"}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p>
                {t.legal?.termsText || 
                  "Используя это приложение, вы соглашаетесь с нашими условиями использования. Мы оставляем за собой право изменять условия в любое время."}
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif text-cosmic-accent mb-4">
              {t.legal?.privacyTitle || "Политика конфиденциальности"}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p>
                {t.legal?.privacyText || 
                  "Мы уважаем вашу конфиденциальность и обрабатываем только те данные, которые необходимы для функционирования приложения."}
              </p>
              <p>
                {t.legal?.dataCollectionText || 
                  "Мы собираем только те данные, которые вы добровольно предоставляете, такие как информация профиля и данные, необходимые для функциональности приложения."}
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif text-cosmic-accent mb-4">
              {t.legal?.contactTitle || "Контактная информация"}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p>
                {t.legal?.contactText || 
                  "По всем вопросам, пожалуйста, свяжитесь с нами по электронной почте: support@asket-app.com"}
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-serif text-cosmic-accent mb-4">
              {t.legal?.disclaimerTitle || "Отказ от ответственности"}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p>
                {t.legal?.disclaimerText || 
                  "Приложение предоставляется 'как есть', без каких-либо гарантий. Мы не несем ответственности за любые последствия использования приложения."}
              </p>
            </div>
          </section>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default LegalPage;
