import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, PlusCircle, Loader2 } from 'lucide-react';
import { UniverseChatSession } from '@/store/slices/chat/universeChatTypes';

interface ChatNavigationPanelProps {
  sessions: UniverseChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => Promise<void>;
  onNewChat: () => void;
  isLoading: boolean;
}

export const ChatNavigationPanel: React.FC<ChatNavigationPanelProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  isLoading
}) => {
  return (
    <div className="hidden md:flex w-64 flex-col border-r border-cosmic-accent/20 bg-cosmic-dark/40">
      <div className="p-4">
        <Button 
          className="w-full bg-cosmic-accent hover:bg-cosmic-accent/90 gap-2" 
          onClick={onNewChat}
        >
          <PlusCircle size={16} /> Новый диалог
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && sessions.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-cosmic-accent">
            <Loader2 className="animate-spin mr-2" size={18} />
            <span>Загрузка...</span>
          </div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-3 py-2 mb-1 rounded-md flex items-center space-x-2 transition-colors
                ${session.id === currentSessionId 
                  ? 'bg-cosmic-accent/20 text-white' 
                  : 'text-white/70 hover:bg-cosmic-accent/10'}`}
            >
              <MessageSquare size={16} />
              <span className="truncate">{session.title}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
