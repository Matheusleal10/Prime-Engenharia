import { useEffect } from 'react';

interface DebugLogsProps {
  enabled?: boolean;
}

export const DebugLogs = ({ enabled = true }: DebugLogsProps) => {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog('[DEBUG]', new Date().toISOString(), ...args);
    };

    console.error = (...args) => {
      originalError('[ERROR]', new Date().toISOString(), ...args);
    };

    console.warn = (...args) => {
      originalWarn('[WARN]', new Date().toISOString(), ...args);
    };

    // Log critical mount events
    console.log('🚀 Prime ERP - Debug mode ativado');
    console.log('📍 URL atual:', window.location.href);
    console.log('🌐 Navigator:', {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled
    });

    // Monitor network status
    const handleOnline = () => console.log('🟢 Conexão restaurada');
    const handleOffline = () => console.warn('🔴 Conexão perdida');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Erro não tratado:', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Promise rejeitada:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [enabled]);

  return null;
};