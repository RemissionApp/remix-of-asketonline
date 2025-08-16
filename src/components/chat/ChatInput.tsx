import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/useTranslations';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isDisabled = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslations();

  // Фокус на поле ввода при монтировании
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isDisabled || isSending) return;

    const messageToSend = inputText.trim();
    setIsSending(true);

    try {
      // Очистка поля ввода сразу для лучшего UX
      setInputText('');

      // Отправка сообщения
      await onSendMessage(messageToSend);

      // Возвращение фокуса на поле ввода
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      // При ошибке восстанавливаем текст
      setInputText(messageToSend);
    } finally {
      // Задержка сброса состояния отправки для UX
      setTimeout(() => setIsSending(false), 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Отправка сообщения по Enter (но не с Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Предотвращаем новую строку
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    // Автоматическое изменение размера textarea (ограничено max-h в CSS)
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pt-2 pb-20 z-30 bg-cosmic-dark/80 backdrop-blur-md border-t border-cosmic-accent/10">
      <div className="flex items-end max-w-2xl mx-auto">
        <div className="flex-1 mx-2 relative">
          <Textarea
            ref={inputRef}
            value={inputText}
            onChange={handleTextareaChange}
            placeholder={
              t.universe?.questionPlaceholder || 'Спроси у Вселенной...'
            }
            className="resize-none bg-cosmic-dark/50 border border-cosmic-accent/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50 min-h-[50px] max-h-[120px]"
            onKeyDown={handleKeyDown}
            disabled={isDisabled || isSending}
            rows={1}
          />
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-xl opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-accent/5 to-cosmic-dark/0"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-cosmic-accent/10 rounded-full filter blur-xl transform -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>

        <Button
          variant={inputText.trim() ? 'default' : 'ghost'}
          size="icon"
          className={`mb-1 ${inputText.trim() ? 'bg-cosmic-accent hover:bg-cosmic-accent/90' : 'text-cosmic-secondary'}`}
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isDisabled || isSending}
        >
          {isSending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </Button>
      </div>
    </div>
  );
};
