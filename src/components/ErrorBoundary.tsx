import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('[ErrorBoundary] Error caught:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
    
    // Log to monitoring service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Algo deu errado</p>
                    <p className="text-sm opacity-90 mt-1">
                      Ocorreu um erro inesperado. Tente recarregar a página.
                    </p>
                  </div>
                  
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="text-xs opacity-75">
                      <summary className="cursor-pointer">Detalhes do erro</summary>
                      <pre className="mt-2 whitespace-pre-wrap">
                        {this.state.error.toString()}
                      </pre>
                    </details>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={this.handleReset}
                      variant="outline"
                    >
                      Tentar novamente
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={this.handleReload}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Recarregar
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}