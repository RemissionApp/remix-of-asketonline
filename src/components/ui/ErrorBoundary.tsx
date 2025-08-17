import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', error, errorInfo);

    // Special handling for React hooks errors
    if (
      error.message.includes('useState') ||
      error.message.includes('useContext')
    ) {
      logger.error('React hooks error detected - possible provider issue', {
        error,
        errorInfo,
      });
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-cosmic-dark">
            <div className="text-center p-8">
              <h2 className="text-2xl font-serif text-cosmic-accent mb-4">
                Что-то пошло не так
              </h2>
              <p className="text-cosmic-secondary mb-6">
                Произошла неожиданная ошибка. Попробуйте обновить страницу.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-cosmic-accent text-white rounded-lg hover:bg-cosmic-accent2 transition-colors"
              >
                Обновить страницу
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
