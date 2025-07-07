import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  FileText,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  activeSuppliers: number;
}

export default function Reports() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [
        customersResult,
        productsResult,
        ordersResult,
        transactionsResult,
        suppliersResult
      ] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact' }),
        supabase.from('products').select('id, stock_quantity, min_stock', { count: 'exact' }),
        supabase.from('orders').select('id, total, status, created_at'),
        supabase.from('financial_transactions').select('amount, transaction_type, status, transaction_date'),
        supabase.from('suppliers').select('id, status', { count: 'exact' })
      ]);

      const totalCustomers = customersResult.count || 0;
      const totalProducts = productsResult.count || 0;
      const products = productsResult.data || [];
      const orders = ordersResult.data || [];
      const transactions = transactionsResult.data || [];
      const suppliers = suppliersResult.data || [];

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const totalRevenue = transactions
        .filter(t => t.transaction_type === 'income' && t.status === 'paid')
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthlyRevenue = transactions
        .filter(t => 
          t.transaction_type === 'income' && 
          t.status === 'paid' &&
          new Date(t.transaction_date) >= thirtyDaysAgo
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const lowStockProducts = products.filter(p => 
        p.stock_quantity <= p.min_stock
      ).length;

      const activeSuppliers = suppliers.filter(s => s.status === 'active').length;

      setStats({
        totalCustomers,
        totalProducts,
        totalOrders,
        totalRevenue,
        monthlyRevenue,
        pendingOrders,
        lowStockProducts,
        activeSuppliers
      });

    } catch (error) {
      toast({
        title: "Erro ao carregar relatórios",
        description: "Não foi possível carregar os dados dos relatórios.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Análises e métricas do negócio</p>
          </div>
        </div>
        <div className="text-center py-8">Carregando relatórios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análises e métricas do negócio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => {
            toast({
              title: "Funcionalidade em desenvolvimento",
              description: "A exportação de relatórios será implementada em breve.",
            });
          }}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatPrice(stats?.monthlyRevenue || 0)} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingOrders || 0} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.lowStockProducts || 0} com estoque baixo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Relatórios */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Vendas por Período
            </CardTitle>
            <CardDescription>
              Análise de vendas e receitas por período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Gráfico de vendas será implementado aqui
            </div>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>
              Top 10 produtos com melhor performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Lista de produtos será implementada aqui
            </div>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Análise de Clientes
            </CardTitle>
            <CardDescription>
              Comportamento e segmentação de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Análise de clientes será implementada aqui
            </div>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Controle de Estoque
            </CardTitle>
            <CardDescription>
              Relatório de movimentação de estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Relatório de estoque será implementado aqui
            </div>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Fluxo de Caixa
            </CardTitle>
            <CardDescription>
              Entrada e saída de recursos financeiros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Fluxo de caixa será implementado aqui
            </div>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Relatórios Personalizados
            </CardTitle>
            <CardDescription>
              Crie relatórios sob medida para suas necessidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Construtor de relatórios será implementado aqui
            </div>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Criar Relatório
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}