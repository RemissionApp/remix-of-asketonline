
import React from 'react';
import { UniverseChatMessage } from '@/utils/universeChat';
import { UserAvatar } from '@/components/UserAvatar';
import { formatRelativeTime } from '@/utils/dateFormatUtils';

interface ChatMessageProps {
  message: UniverseChatMessage;
}

// Use React.memo to prevent unnecessary re-renders when parent components update
export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  // Extract message properties with default fallbacks for error handling
  const isUser = message?.sender === 'user';
  const content = message?.content || '';
  const timestamp = message?.created_at ? new Date(message.created_at) : new Date();
  const messageId = message?.id || `fallback-${Date.now()}`;
  
  console.log('Rendering message:', messageId, { isUser, content, timestamp });
  
  // Prevent rendering of empty messages
  if (!message || (!content && !message.id)) {
    console.warn('Attempted to render empty or invalid message:', message);
    return null;
  }
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      data-message-id={messageId}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-cosmic-accent flex items-center justify-center">
            <span className="text-white text-xl">✧</span>
          </div>
        </div>
      )}
      
      <div 
        className={`max-w-xs md:max-w-md rounded-2xl p-3 ${
          isUser 
            ? 'bg-cosmic-accent/30 text-white rounded-tr-none' 
            : 'bg-cosmic-dark/80 border border-cosmic-accent/20 text-cosmic-secondary rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-cosmic-secondary' : 'text-cosmic-secondary/70'}`}>
          {formatRelativeTime(timestamp)}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <UserAvatar size="sm" />
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if the message ID or content has changed
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content
  );
});

// Display name for debugging
ChatMessage.displayName = 'ChatMessage';
