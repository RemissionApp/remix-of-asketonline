
import React from 'react';
import { UniverseChatSession } from '@/utils/universeChat';
import { Card } from '@/components/ui/card';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { formatRelativeTime } from '@/utils/dateFormatUtils';

interface ChatSessionsListProps {
  sessions: UniverseChatSession[];
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  currentSessionId: string | null;
}

export const ChatSessionsList: React.FC<ChatSessionsListProps> = ({
  sessions,
  onSelectSession,
  onNewChat,
  currentSessionId
}) => {
  const { t } = useTranslations();
  
  return (
    <div className="py-4 px-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white font-serif">
          {t.universe?.yourConversations || 'Ваши диалоги'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-cosmic-accent"
          onClick={onNewChat}
        >
          <Plus size={20} className="mr-1" />
          {t.universe?.newChat || 'Новый диалог'}
        </Button>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-cosmic-dark/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} className="text-cosmic-secondary" />
          </div>
          <p className="text-cosmic-secondary mb-4">
            {t.universe?.noChatsYet || 'У вас пока нет диалогов со Вселенной'}
          </p>
          <CosmicButton onClick={onNewChat} variant="outline" size="sm">
            <Plus size={16} className="mr-2" />
            {t.universe?.startNewChat || 'Начать новый диалог'}
          </CosmicButton>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <Card 
              key={session.id}
              className={`p-3 cursor-pointer transition-all ${
                currentSessionId === session.id
                  ? 'bg-cosmic-accent/20 border-cosmic-accent'
                  : 'bg-cosmic-dark/50 border-cosmic-accent/20 hover:bg-cosmic-dark'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cosmic-accent/20 flex items-center justify-center mr-3">
                  <MessageSquare size={16} className="text-cosmic-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-sm font-medium line-clamp-1">{session.title}</h3>
                  <p className="text-xs text-cosmic-secondary">
                    {formatRelativeTime(new Date(session.last_message))}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
