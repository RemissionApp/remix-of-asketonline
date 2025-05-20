
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const SupportChat: React.FC = () => {
  const { t } = useTranslations();
  const { userProfile } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      text: t.support?.welcomeMessage || 'Привет! Я виртуальный ассистент. Чем я могу помочь?', 
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input.trim(),
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from assistant
      const { data, error } = await supabase.functions.invoke('support-assistant', {
        body: {
          question: input.trim(),
          userData: {
            userName: userProfile?.name,
            isPro: userProfile?.isPro
          }
        }
      });
      
      if (error) throw error;
      
      // Add response message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: data.answer,
        isUser: false
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting assistant response:', error);
      toast({
        title: t.errors?.assistantError || "Ошибка",
        description: t.errors?.assistantErrorDesc || "Не удалось получить ответ от ассистента",
        variant: "destructive"
      });
      
      // Add fallback message
      const fallbackMessage: Message = {
        id: `fallback-${Date.now()}`,
        text: t.support?.fallbackMessage || "Извините, у меня возникла проблема. Пожалуйста, попробуйте позже или напишите разработчику.",
        isUser: false
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        <div className="space-y-4">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isUser 
                    ? 'bg-cosmic-accent/20 text-white' 
                    : 'bg-cosmic-dark/50 text-cosmic-secondary border border-cosmic-accent/10'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-cosmic-dark/50 text-cosmic-secondary border border-cosmic-accent/10">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder={t.support?.inputPlaceholder || "Задайте вопрос..."}
            className="flex-1 min-h-[80px] bg-transparent border-cosmic-accent/30 text-white resize-none"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-cosmic-accent/20 hover:bg-cosmic-accent/30 border border-cosmic-accent/30 text-white self-end h-10"
            disabled={isLoading || !input.trim()}
          >
            {t.support?.sendButton || "Отправить"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SupportChat;
