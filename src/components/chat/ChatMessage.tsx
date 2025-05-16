
import React from 'react';
import { UniverseChatMessage } from '@/utils/universeChat';
import { UserAvatar } from '@/components/UserAvatar';
import { formatRelativeTime } from '@/utils/dateFormatUtils';

interface ChatMessageProps {
  message: UniverseChatMessage;
}

// Используем React.memo для предотвращения ненужных ререндеров
export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  // Извлекаем свойства сообщения с запасными значениями
  const isUser = message?.sender === 'user';
  const content = message?.content || '';
  const timestamp = message?.created_at ? new Date(message.created_at) : new Date();
  const messageId = message?.id || `fallback-${Date.now()}-${Math.random()}`;
  
  // Пропускаем рендеринг пустых сообщений
  if (!content) {
    return null;
  }
  
  return (
    <div 
      className="flex mb-4"
      data-message-id={messageId}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3 self-end">
          <div className="w-10 h-10 rounded-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-cosmic-accent/60 to-cosmic-accent/20 shadow-lg shadow-cosmic-accent/10">
            <img 
              src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//un1.jpeg" 
              alt="Вселенная"
              className="object-cover w-full h-full z-10"
            />
            <div className="absolute inset-0 rounded-full overflow-hidden z-0">
              <div className="absolute animate-pulse top-0 left-1/2 w-5 h-1 bg-white/30 rounded transform -translate-x-1/2 blur-sm"></div>
              <div className="absolute animate-pulse delay-300 bottom-0 left-1/2 w-5 h-1 bg-white/30 rounded transform -translate-x-1/2 blur-sm"></div>
              <div className="absolute animate-pulse delay-150 left-0 top-1/2 w-1 h-5 bg-white/30 rounded transform -translate-y-1/2 blur-sm"></div>
              <div className="absolute animate-pulse delay-150 right-0 top-1/2 w-1 h-5 bg-white/30 rounded transform -translate-y-1/2 blur-sm"></div>
            </div>
          </div>
        </div>
      )}
      
      <div 
        className={`max-w-xs md:max-w-md rounded-2xl p-4 relative ${
          isUser 
            ? 'bg-cosmic-accent/30 text-white rounded-tr-none backdrop-blur-sm ml-auto' 
            : 'bg-cosmic-dark/80 border border-cosmic-accent/20 text-cosmic-secondary rounded-tl-none backdrop-blur-md mr-auto'
        }`}
      >
        {!isUser && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl rounded-tl-none pointer-events-none">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cosmic-accent/10 rounded-full filter blur-xl transform -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-cosmic-accent/5 rounded-full filter blur-xl transform translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-accent/30 to-transparent"></div>
          </div>
        )}
        <p className="whitespace-pre-wrap relative z-10">{content}</p>
        <div className={`text-xs mt-2 ${isUser ? 'text-cosmic-secondary/70' : 'text-cosmic-secondary/50'}`}>
          {formatRelativeTime(timestamp)}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3 self-end">
          <UserAvatar size="sm" />
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Пользовательская функция сравнения для React.memo
  // Повторный рендеринг только в случае изменения ID или содержимого сообщения
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content
  );
});

// Отображаемое имя для отладки
ChatMessage.displayName = 'ChatMessage';
