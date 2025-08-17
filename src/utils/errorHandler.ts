import { createLogger } from './logger';

const logger = createLogger('ErrorHandler');

export interface ErrorHandlerOptions {
  context?: string;
  fallback?: () => void;
  notify?: boolean;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (
  error: Error | unknown,
  options: ErrorHandlerOptions = {}
) => {
  const { context = 'Unknown', fallback, notify = true } = options;

  logger.error(`Error in ${context}`, error);

  if (error instanceof AppError) {
    if (notify) {
      // Toast notification would go here
      console.error(`[${error.code}] ${error.message}`);
    }
  } else if (error instanceof Error) {
    if (notify) {
      console.error(`Unexpected error: ${error.message}`);
    }
  } else {
    if (notify) {
      console.error('An unknown error occurred');
    }
  }

  if (fallback) {
    try {
      fallback();
    } catch (fallbackError) {
      logger.error('Error in fallback handler', fallbackError);
    }
  }
};

export const withErrorHandler = <T extends any[], R>(
  fn: (...args: T) => R,
  options: ErrorHandlerOptions = {}
) => {
  return (...args: T): R | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error, options);
      return undefined;
    }
  };
};

export const withAsyncErrorHandler = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: ErrorHandlerOptions = {}
) => {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      return undefined;
    }
  };
};
