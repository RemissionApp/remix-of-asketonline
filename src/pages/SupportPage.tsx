
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/hooks/useTranslations';
import SupportChat from '@/components/Support/SupportChat';
import ContactForm from '@/components/Support/ContactForm';

const SupportPage: React.FC = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState('chat');
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/80" />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-md mx-auto w-full">
        <h1 className="text-3xl text-white font-serif mb-6">
          {t.support?.title || "Поддержка"}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-cosmic-dark/30 border border-cosmic-accent/20">
            <TabsTrigger 
              value="chat"
              className="data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-cosmic-accent"
            >
              {t.support?.chatTab || "Чат с ассистентом"}
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-cosmic-accent"
            >
              {t.support?.contactTab || "Написать разработчику"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="w-full mt-0">
            <Card className="cosmic-card backdrop-blur-[5px] bg-cosmic-dark/10 border-cosmic-accent/20">
              <CardHeader>
                <CardTitle className="text-cosmic-accent">
                  {t.support?.chatTitle || "Чат поддержки"}
                </CardTitle>
                <CardDescription className="text-cosmic-secondary">
                  {t.support?.chatDescription || "Задайте вопрос нашему виртуальному ассистенту"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupportChat />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="w-full mt-0">
            <Card className="cosmic-card backdrop-blur-[5px] bg-cosmic-dark/10 border-cosmic-accent/20">
              <CardHeader>
                <CardTitle className="text-cosmic-accent">
                  {t.support?.contactTitle || "Написать разработчику"}
                </CardTitle>
                <CardDescription className="text-cosmic-secondary">
                  {t.support?.contactDescription || "Отправьте сообщение команде разработчиков"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add the bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SupportPage;
