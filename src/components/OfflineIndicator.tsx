import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export const OfflineIndicator = () => {
  const { isOnline } = usePWA();
  const [showOfflineAlert, setShowOfflineAlert] = useState(!isOnline);
  const [pendingData, setPendingData] = useState(0);

  useEffect(() => {
    setShowOfflineAlert(!isOnline);
    
    // Check for pending sync data
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Check for cached form data or pending operations
        caches.open('forms-cache').then((cache) => {
          cache.keys().then((keys) => {
            setPendingData(keys.length);
          });
        });
      });
    }
  }, [isOnline]);

  const handleSync = () => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        (registration as any).sync.register('background-sync-forms');
      });
    }
    window.location.reload();
  };

  if (isOnline && pendingData === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      {/* Offline Alert */}
      {showOfflineAlert && (
        <Alert className="mb-2 border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <span>Você está offline</span>
              <Badge variant="secondary" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Modo Offline
              </Badge>
            </div>
            <p className="text-xs mt-1 text-orange-700">
              Suas ações serão sincronizadas quando a conexão for restaurada.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Online with pending data */}
      {isOnline && pendingData > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <RefreshCw className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <span>Sincronizando dados...</span>
                <p className="text-xs mt-1">
                  {pendingData} item(s) pendente(s)
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSync}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Sync
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Connection restored */}
      {isOnline && (
        <div className="fixed bottom-4 right-4 z-50">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Wifi className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </div>
      )}
    </div>
  );
};