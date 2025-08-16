import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createLogger } from '@/utils/loggerUtils';

const logger = createLogger('ErrorHandler');

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additional?: Record<string, any>;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: Error | unknown, context?: ErrorContext, showToast = true) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      const contextStr = context
        ? `${context.component || 'Unknown'}:${context.action || 'Unknown'}`
        : 'Unknown';

      logger.error(`Error in ${contextStr}`, error, context);

      if (showToast) {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: getUserFriendlyMessage(errorMessage),
        });
      }
    },
    [toast]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: ErrorContext,
      showToast = true
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, context, showToast);
        return null;
      }
    },
    [handleError]
  );

  return { handleError, handleAsyncError };
};

function getUserFriendlyMessage(errorMessage: string): string {
  // Переводим технические ошибки в понятные пользователю
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Проблема с интернет-соединением. Проверьте подключение и повторите попытку.';
  }

  if (errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
    return 'Необходимо войти в систему заново.';
  }

  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return 'Проверьте правильность введенных данных.';
  }

  return 'Что-то пошло не так. Попробуйте еще раз.';
}
