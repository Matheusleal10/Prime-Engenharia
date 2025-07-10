import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Monitor, 
  Calculator, 
  ShoppingCart, 
  Users, 
  Package, 
  Bell,
  Download,
  Wifi,
  MapPin
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const PWADemo = () => {
  const [activeDemo, setActiveDemo] = useState<'erp' | 'site'>('erp');

  const erpFeatures = [
    {
      icon: <Package className="h-5 w-5" />,
      title: "Gestão de Estoque Offline",
      description: "Consulte produtos e quantidades mesmo sem internet"
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      title: "Criação de Pedidos",
      description: "Crie pedidos offline que sincronizam automaticamente"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Consulta de Clientes",
      description: "Acesse dados dos clientes em qualquer lugar"
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Notificações Push",
      description: "Receba alertas de pedidos, estoque baixo e mais"
    }
  ];

  const siteFeatures = [
    {
      icon: <Calculator className="h-5 w-5" />,
      title: "Calculadora Offline",
      description: "Calcule quantidade de tijolos sem internet"
    },
    {
      icon: <Package className="h-5 w-5" />,
      title: "Catálogo Offline",
      description: "Produtos e preços sempre disponíveis"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Localização",
      description: "Encontre nossa empresa mesmo offline"
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: "Orçamentos Salvos",
      description: "Salve orçamentos para enviar depois"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Prime ERP - Aplicativo Web Progressivo</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transformamos nosso sistema em um PWA completo! Agora você pode trabalhar offline, 
          receber notificações e ter uma experiência nativa em qualquer dispositivo.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Smartphone className="h-3 w-3" />
            Mobile Ready
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            Offline First
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Push Notifications
          </Badge>
        </div>
      </div>

      <Tabs value={activeDemo} onValueChange={(value) => setActiveDemo(value as 'erp' | 'site')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="erp" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Sistema ERP
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Site Institucional
          </TabsTrigger>
        </TabsList>

        <TabsContent value="erp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Prime ERP - Versão PWA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Funcionalidades Offline</h3>
                  {erpFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="text-primary mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Instalação e Uso</h3>
                  <div className="space-y-4">
                    <PWAInstallButton variant="card" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Site Prime - Versão PWA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Recursos Móveis</h3>
                  {siteFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="text-primary mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Experiência Mobile</h3>
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                    <h4 className="font-medium mb-2">Calculadora de Tijolos</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Seus clientes podem calcular quantidades necessárias mesmo sem internet
                    </p>
                    <div className="bg-background p-3 rounded border">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Área a construir:</span>
                          <span className="font-medium">100m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tijolos necessários:</span>
                          <span className="font-medium text-primary">2.400 unidades</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 mt-2">
                          <span>Valor estimado:</span>
                          <span className="font-bold text-green-600">R$ 1.440,00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Benefícios do PWA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Sem App Store</h3>
              <p className="text-sm text-muted-foreground">
                Instalação direta do navegador, sem necessidade de lojas de aplicativos
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wifi className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Trabalho Offline</h3>
              <p className="text-sm text-muted-foreground">
                Funcionalidades essenciais disponíveis mesmo sem conexão com a internet
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Notificações</h3>
              <p className="text-sm text-muted-foreground">
                Receba alertas importantes mesmo com o app fechado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};