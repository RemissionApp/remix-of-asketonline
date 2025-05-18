
import React, { useRef, useEffect } from 'react';
import { MessageSquare, Bot, Loader2 } from 'lucide-react';
import { UniverseChatMessage } from '@/store/slices/chat/universeChatTypes';

interface ChatMessagesDisplayProps {
  messages: UniverseChatMessage[];
  isLoading: boolean;
  isTyping: boolean; // Параметр для отображения статуса печатания
}

export const ChatMessagesDisplay: React.FC<ChatMessagesDisplayProps> = ({ 
  messages, 
  isLoading,
  isTyping 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-cosmic-accent/70 text-center">
          <MessageSquare size={30} className="mb-2 opacity-50" />
          <p>Начните диалог с Вселенной, задав свой вопрос</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div 
            key={message.id || index} 
            className={`flex items-start space-x-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
          >
            {message.sender !== 'user' && (
              <div className="rounded-full bg-cosmic-accent/20 p-2 flex-shrink-0">
                <Bot size={18} className="text-cosmic-accent" />
              </div>
            )}
            
            <div 
              className={`rounded-lg p-3 max-w-[80%] ${
                message.sender === 'user'
                  ? 'bg-cosmic-accent/30 text-white ml-auto'
                  : 'bg-cosmic-dark/60 border border-cosmic-accent/20 text-white/90'
              }`}
            >
              {message.content}
            </div>
            
            {message.sender === 'user' && (
              <div className="rounded-full bg-purple-500/20 p-2 flex-shrink-0">
                <MessageSquare size={18} className="text-purple-400" />
              </div>
            )}
          </div>
        ))
      )}
      
      {/* Индикатор набора текста */}
      {isTyping && (
        <div className="flex items-start space-x-3">
          <div className="rounded-full bg-cosmic-accent/20 p-2 flex-shrink-0">
            <Bot size={18} className="text-cosmic-accent" />
          </div>
          <div className="rounded-lg p-3 bg-cosmic-dark/60 border border-cosmic-accent/20 text-white/90">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-cosmic-accent/70 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-cosmic-accent/70 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 bg-cosmic-accent/70 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Индикатор загрузки истории */}
      {isLoading && messages.length === 0 && (
        <div className="flex items-center justify-center h-20">
          <Loader2 className="animate-spin mr-2 text-cosmic-accent" size={20} />
          <span className="text-cosmic-accent/80">Загрузка истории диалога...</span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
