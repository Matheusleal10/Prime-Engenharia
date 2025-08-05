import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw
} from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  lastChecked: Date;
}

export const SystemHealthMonitor = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);

  const runHealthChecks = async () => {
    setLoading(true);
    const checks: HealthCheck[] = [];

    // Check network connectivity
    checks.push({
      name: 'Conectividade',
      status: navigator.onLine ? 'healthy' : 'error',
      message: navigator.onLine ? 'Conectado à internet' : 'Sem conexão com a internet',
      lastChecked: new Date()
    });

    // Check Supabase connection
    try {
      const response = await fetch('https://qdaxssasxgjdznzzucbr.supabase.co/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkYXhzc2FzeGdqZHpuenp1Y2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTUyNTMsImV4cCI6MjA2NzE3MTI1M30.CMI4zmomijLVm9_MTNz1oUNULAFGDP8UTu4bl89MkMs'
        }
      });
      
      checks.push({
        name: 'Supabase API',
        status: response.ok ? 'healthy' : 'warning',
        message: response.ok ? 'Conectado ao Supabase' : `HTTP ${response.status}`,
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        name: 'Supabase API',
        status: 'error',
        message: 'Erro de conexão com Supabase',
        lastChecked: new Date()
      });
    }

    // Check localStorage availability
    try {
      localStorage.setItem('health-check', 'test');
      localStorage.removeItem('health-check');
      checks.push({
        name: 'LocalStorage',
        status: 'healthy',
        message: 'LocalStorage disponível',
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        name: 'LocalStorage',
        status: 'error',
        message: 'LocalStorage não disponível',
        lastChecked: new Date()
      });
    }

    // Check Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        checks.push({
          name: 'Service Worker',
          status: registration ? 'healthy' : 'warning',
          message: registration ? 'Service Worker ativo' : 'Service Worker não encontrado',
          lastChecked: new Date()
        });
      } catch (error) {
        checks.push({
          name: 'Service Worker',
          status: 'error',
          message: 'Erro no Service Worker',
          lastChecked: new Date()
        });
      }
    } else {
      checks.push({
        name: 'Service Worker',
        status: 'warning',
        message: 'Service Worker não suportado',
        lastChecked: new Date()
      });
    }

    setHealthChecks(checks);
    setLoading(false);
  };

  useEffect(() => {
    runHealthChecks();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-refresh every 30 seconds
    const interval = setInterval(runHealthChecks, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const healthyCount = healthChecks.filter(check => check.status === 'healthy').length;
  const totalChecks = healthChecks.length;
  const healthPercentage = totalChecks > 0 ? (healthyCount / totalChecks) * 100 : 0;

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Health
            </CardTitle>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge className="bg-green-100 text-green-800">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={runHealthChecks}
                disabled={loading}
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            <div className="flex items-center gap-2">
              <Progress value={healthPercentage} className="flex-1 h-2" />
              <span>{healthyCount}/{totalChecks}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 pt-0">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {getStatusIcon(check.status)}
                <span>{check.name}</span>
              </div>
              <Badge variant="outline" className={`text-xs ${getStatusColor(check.status)}`}>
                {check.status}
              </Badge>
            </div>
          ))}
          
          {healthChecks.some(check => check.status === 'error') && (
            <Alert className="mt-2 border-red-200 bg-red-50">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <AlertDescription className="text-xs text-red-800">
                Alguns serviços estão com problemas. Verifique sua conexão.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};