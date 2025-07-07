import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Search
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const salesData = [
  { month: 'Jan', sales: 12000 },
  { month: 'Fev', sales: 19000 },
  { month: 'Mar', sales: 15000 },
  { month: 'Abr', sales: 25000 },
  { month: 'Mai', sales: 22000 },
  { month: 'Jun', sales: 30000 },
];

const productSalesData = [
  { product: 'Tijolo Ecológico', sales: 45 },
  { product: 'Blocos de Concreto', sales: 32 },
  { product: 'Pisos Intertravados', sales: 28 },
  { product: 'Meio-fio', sales: 15 },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    products: 0,
    revenue: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Buscar estatísticas
      const [
        { count: customersCount },
        { count: ordersCount },
        { count: productsCount },
        { data: ordersData },
        { data: lowStockData },
        { data: pendingOrdersData }
      ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total').eq('status', 'delivered'),
        supabase.from('products').select('*').lt('stock_quantity', 'min_stock'),
        supabase.from('orders').select('*').in('status', ['draft', 'pending'])
      ]);

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (parseFloat(String(order.total)) || 0), 0) || 0;

      setStats({
        customers: customersCount || 0,
        orders: ordersCount || 0,
        products: productsCount || 0,
        revenue: totalRevenue,
        lowStockProducts: lowStockData?.length || 0,
        pendingOrders: pendingOrdersData?.length || 0,
      });

      // Buscar atividades recentes (últimos pedidos e leads)
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, customers(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentLeads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const activities = [
        ...(recentOrders?.map(order => ({
          type: 'order',
          description: `Novo pedido de ${order.customers?.name}`,
          time: new Date(order.created_at).toLocaleString(),
          status: order.status
        })) || []),
        ...(recentLeads?.map(lead => ({
          type: 'lead',
          description: `Novo lead: ${lead.name}`,
          time: new Date(lead.created_at).toLocaleString(),
          status: lead.status
        })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

      setRecentActivities(activities);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema ERP/CRM</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes, produtos, pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>Buscar</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% do mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totais</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingOrders} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockProducts > 0 && (
                <>
                  <AlertTriangle className="inline h-3 w-3 mr-1 text-yellow-500" />
                  {stats.lowStockProducts} com estoque baixo
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% do mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas Mensais</CardTitle>
            <CardDescription>Faturamento dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top produtos do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>Itens que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">
                  {stats.lowStockProducts} produto(s) com estoque baixo
                </span>
              </div>
            )}
            {stats.pendingOrders > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  {stats.pendingOrders} pedido(s) pendente(s)
                </span>
              </div>
            )}
            {stats.lowStockProducts === 0 && stats.pendingOrders === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum alerta no momento</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.status === 'delivered' ? 'default' :
                    activity.status === 'pending' ? 'secondary' :
                    activity.status === 'new' ? 'outline' : 'secondary'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}