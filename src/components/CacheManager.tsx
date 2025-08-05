import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RefreshCw, Download, Trash2, Wifi, WifiOff } from 'lucide-react';

interface CacheStatus {
  version: string;
  hasUpdate: boolean;
  cacheSize: number;
  isOnline: boolean;
  lastUpdate: string;
}

export const CacheManager = () => {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    version: 'unknown',
    hasUpdate: false,
    cacheSize: 0,
    isOnline: navigator.onLine,
    lastUpdate: 'Nunca'
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkCacheStatus();
    
    // Listen for online/offline events
    const handleOnline = () => setCacheStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setCacheStatus(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check for updates every 30 seconds when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkForUpdates();
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const checkCacheStatus = async () => {
    try {
      if ('serviceWorker' in navigator && 'caches' in window) {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          totalSize += requests.length;
        }

        // Get version from service worker
        const registration = await navigator.serviceWorker.getRegistration();
        const version = registration?.active ? 'ativo' : 'inativo';
        
        setCacheStatus(prev => ({
          ...prev,
          version,
          cacheSize: totalSize,
          lastUpdate: new Date().toLocaleTimeString()
        }));
      }
    } catch (error) {
      console.error('Error checking cache status:', error);
    }
  };

  const checkForUpdates = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            setCacheStatus(prev => ({ ...prev, hasUpdate: true }));
            toast.info('Nova versão disponível! Clique em "Atualizar" para aplicar.');
          }
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const forceUpdate = async () => {
    setIsUpdating(true);
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Update service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          await registration.update();
        }
      }

      // Force reload
      window.location.reload();
    } catch (error) {
      console.error('Error updating cache:', error);
      toast.error('Erro ao atualizar. Tente recarregar a página manualmente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        toast.success('Cache limpo com sucesso!');
        checkCacheStatus();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Erro ao limpar cache.');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {cacheStatus.isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          Cache & Atualizações
        </CardTitle>
        <CardDescription>
          Gerencie o cache e atualizações do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Status:</span>
          <Badge variant={cacheStatus.isOnline ? "default" : "destructive"}>
            {cacheStatus.isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Service Worker:</span>
          <Badge variant="outline">{cacheStatus.version}</Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Itens em Cache:</span>
          <span className="text-sm font-mono">{cacheStatus.cacheSize}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Última Verificação:</span>
          <span className="text-sm text-muted-foreground">{cacheStatus.lastUpdate}</span>
        </div>

        {cacheStatus.hasUpdate && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              Nova versão disponível! Atualize para ver as últimas mudanças.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={forceUpdate}
            disabled={isUpdating}
            className="flex-1"
            variant={cacheStatus.hasUpdate ? "default" : "outline"}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Atualizando...' : 'Atualizar'}
          </Button>
          
          <Button 
            onClick={clearCache}
            variant="outline"
            size="icon"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          💡 Dica: Use Ctrl+F5 para forçar recarga completa
        </div>
      </CardContent>
    </Card>
  );
};