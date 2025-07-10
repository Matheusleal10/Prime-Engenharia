import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  ArrowRight, 
  Star, 
  Users, 
  Package, 
  TrendingUp,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { PWADemo } from '@/components/PWADemo';
import { toast } from '@/hooks/use-toast';

const Demo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show demo mode notification
    toast({
      title: "🎯 Modo Demonstração Ativado",
      description: "Explore todas as funcionalidades! Este é um ambiente de testes com dados fictícios.",
      duration: 5000,
    });
  }, []);

  const handleStartDemo = () => {
    toast({
      title: "Iniciando Demonstração",
      description: "Você será logado automaticamente como CEO para testar todas as funcionalidades.",
    });
    
    setTimeout(() => {
      navigate('/admin');
    }, 2000);
  };

  const demoStats = [
    { label: "Clientes Ativos", value: "150+", icon: <Users className="h-5 w-5" /> },
    { label: "Produtos", value: "80+", icon: <Package className="h-5 w-5" /> },
    { label: "Pedidos/Mês", value: "200+", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Satisfação", value: "98%", icon: <Star className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Demo Banner */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Play className="h-4 w-4" />
            MODO DEMONSTRAÇÃO - Explore todas as funcionalidades livremente
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Sistema ERP Prime - Demonstração Completa
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Teste Todas as 
              <span className="text-primary"> Funcionalidades</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore nosso sistema completo de gestão empresarial com dados reais. 
              Teste CRM, vendas, estoque, financeiro e muito mais em um ambiente totalmente funcional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={handleStartDemo} className="text-lg px-8 py-6">
              <Play className="h-5 w-5 mr-2" />
              Iniciar Demonstração
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <MessageSquare className="h-5 w-5 mr-2" />
              Falar com Vendas
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {demoStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PWA Demo Section */}
        <Separator />
        <PWADemo />
        <Separator />

        {/* Features Demo */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Gestão de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                CRM completo com histórico de compras, preferências e comunicação integrada.
              </p>
              <ul className="text-sm space-y-1">
                <li>• 150+ clientes cadastrados</li>
                <li>• Histórico completo de pedidos</li>
                <li>• Sistema de pontos de fidelidade</li>
                <li>• Campanhas de marketing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Controle de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gestão inteligente de produtos com alertas e relatórios detalhados.
              </p>
              <ul className="text-sm space-y-1">
                <li>• 80+ produtos cadastrados</li>
                <li>• Controle de movimentações</li>
                <li>• Alertas de estoque baixo</li>
                <li>• Relatórios de performance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Análise Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Dashboard financeiro com métricas em tempo real e projeções.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Fluxo de caixa detalhado</li>
                <li>• Contas a pagar/receber</li>
                <li>• Relatórios fiscais</li>
                <li>• Análise de lucratividade</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Impressionado com o que viu?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Nossa equipe está pronta para mostrar como o Prime ERP pode transformar 
              a gestão da sua empresa. Agende uma demonstração personalizada!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (98) 98708-157
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                comercial@primeengenharia.com
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Site Institucional
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Este é um ambiente de demonstração com dados fictícios. 
            Todos os dados são resetados periodicamente para manter a experiência otimizada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo;