import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { toast } from '@/hooks/use-toast';

interface PWAInstallButtonProps {
  variant?: 'button' | 'banner' | 'card';
  className?: string;
}

export const PWAInstallButton = ({ variant = 'button', className = '' }: PWAInstallButtonProps) => {
  const {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    showInstallPrompt,
    dismissInstallPrompt,
    isSupported,
    notificationPermission,
    registerForNotifications
  } = usePWA();

  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installApp();
      toast({
        title: "App Instalado!",
        description: "Prime ERP foi instalado com sucesso em seu dispositivo.",
      });
    } catch (error) {
      toast({
        title: "Erro na Instalação",
        description: "Não foi possível instalar o app. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const handleNotifications = async () => {
    try {
      const permission = await registerForNotifications();
      if (permission === 'granted') {
        toast({
          title: "Notificações Ativadas!",
          description: "Você receberá notificações importantes do sistema.",
        });
      } else {
        toast({
          title: "Notificações Negadas",
          description: "Você pode ativar as notificações nas configurações do navegador.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível configurar as notificações.",
        variant: "destructive",
      });
    }
  };

  // Don't show if not supported or already installed
  if (!isSupported || isInstalled) {
    return null;
  }

  // Simple button variant
  if (variant === 'button' && isInstallable) {
    return (
      <Button
        onClick={handleInstall}
        disabled={isInstalling}
        className={className}
        variant="outline"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        {isInstalling ? 'Instalando...' : 'Instalar App'}
      </Button>
    );
  }

  // Banner variant (floating)
  if (variant === 'banner' && showInstallPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <Card className="shadow-lg border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Instalar App</h4>
                  <p className="text-xs text-muted-foreground">
                    Acesso rápido e offline
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissInstallPrompt}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                size="sm"
                className="flex-1"
              >
                <Download className="h-3 w-3 mr-1" />
                {isInstalling ? 'Instalando...' : 'Instalar'}
              </Button>
              <Button
                onClick={dismissInstallPrompt}
                variant="outline"
                size="sm"
              >
                Agora não
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Card variant (detailed)
  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Instalar Prime ERP</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Instale nosso app para ter acesso rápido, trabalhar offline e receber notificações importantes.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                  Status
                </span>
                <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Notificações</span>
                <span className={
                  notificationPermission === 'granted' ? 'text-green-600' :
                  notificationPermission === 'denied' ? 'text-red-600' : 'text-yellow-600'
                }>
                  {notificationPermission === 'granted' ? 'Ativadas' :
                   notificationPermission === 'denied' ? 'Negadas' : 'Pendente'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {isInstallable && (
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isInstalling ? 'Instalando...' : 'Instalar App'}
                </Button>
              )}
              
              {notificationPermission !== 'granted' && (
                <Button
                  onClick={handleNotifications}
                  variant="outline"
                  className="w-full"
                >
                  Ativar Notificações
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};