
import React from 'react';
import { UniverseChatMessage } from '@/utils/universeChat';
import { UserAvatar } from '@/components/UserAvatar';
import { formatRelativeTime } from '@/utils/dateFormatUtils';

interface ChatMessageProps {
  message: UniverseChatMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.created_at);
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
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
        <p className="whitespace-pre-wrap">{message.content}</p>
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
};
