import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, MessageSquare, Calendar, Star } from 'lucide-react';

interface AnalyticsData {
  leadsStats: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    conversionRate: number;
    bySource: { source: string; count: number }[];
    byProjectType: { type: string; count: number; label: string }[];
  };
  campaignStats: {
    total: number;
    active: number;
    completed: number;
    avgOpenRate: number;
  };
  customerStats: {
    total: number;
    withBirthday: number;
    avgLoyaltyPoints: number;
    topSegments: { segment: string; count: number }[];
  };
  monthlyTrends: { month: string; leads: number; conversions: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function MarketingAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    leadsStats: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      conversionRate: 0,
      bySource: [],
      byProjectType: []
    },
    campaignStats: {
      total: 0,
      active: 0,
      completed: 0,
      avgOpenRate: 0
    },
    customerStats: {
      total: 0,
      withBirthday: 0,
      avgLoyaltyPoints: 0,
      topSegments: []
    },
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch leads data
      const { data: leads } = await supabase
        .from('leads')
        .select('created_at, status, project_type');

      // Fetch campaigns data  
      const { data: campaigns } = await supabase
        .from('marketing_campaigns')
        .select('status, created_at');

      // Fetch customers data
      const { data: customers } = await supabase
        .from('customers')
        .select('created_at, birth_date, loyalty_points, customer_type');

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      // Process leads statistics
      const leadsThisMonth = leads?.filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate.getMonth() === currentMonth && leadDate.getFullYear() === currentYear;
      }).length || 0;

      const leadsLastMonth = leads?.filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate.getMonth() === lastMonth && leadDate.getFullYear() === lastMonthYear;
      }).length || 0;

      const convertedLeads = leads?.filter(lead => lead.status === 'converted').length || 0;
      const conversionRate = leads?.length ? (convertedLeads / leads.length) * 100 : 0;

      const projectTypeStats = [
        { 
          type: 'residential', 
          count: leads?.filter(l => l.project_type === 'residential').length || 0,
          label: 'Residencial'
        },
        { 
          type: 'commercial', 
          count: leads?.filter(l => l.project_type === 'commercial').length || 0,
          label: 'Comercial'
        }
      ];

      // Process campaigns statistics
      const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
      const completedCampaigns = campaigns?.filter(c => c.status === 'completed').length || 0;

      // Process customers statistics
      const customersWithBirthday = customers?.filter(c => c.birth_date).length || 0;
      const avgLoyaltyPoints = customers?.length 
        ? customers.reduce((sum, c) => sum + (c.loyalty_points || 0), 0) / customers.length 
        : 0;

      const customerSegments = [
        { 
          segment: 'Residencial', 
          count: customers?.filter(c => c.customer_type === 'residential').length || 0 
        },
        { 
          segment: 'Comercial', 
          count: customers?.filter(c => c.customer_type === 'commercial').length || 0 
        }
      ];

      // Generate monthly trends (last 6 months)
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(currentYear, currentMonth - i, 1);
        const monthName = targetDate.toLocaleDateString('pt-BR', { month: 'short' });
        
        const monthLeads = leads?.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate.getMonth() === targetDate.getMonth() && 
                 leadDate.getFullYear() === targetDate.getFullYear();
        }).length || 0;

        const monthConversions = leads?.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate.getMonth() === targetDate.getMonth() && 
                 leadDate.getFullYear() === targetDate.getFullYear() &&
                 lead.status === 'converted';
        }).length || 0;

        monthlyTrends.push({
          month: monthName,
          leads: monthLeads,
          conversions: monthConversions
        });
      }

      setAnalytics({
        leadsStats: {
          total: leads?.length || 0,
          thisMonth: leadsThisMonth,
          lastMonth: leadsLastMonth,
          conversionRate,
          bySource: [{ source: 'Website', count: leads?.length || 0 }],
          byProjectType: projectTypeStats
        },
        campaignStats: {
          total: campaigns?.length || 0,
          active: activeCampaigns,
          completed: completedCampaigns,
          avgOpenRate: 75 // Mock data
        },
        customerStats: {
          total: customers?.length || 0,
          withBirthday: customersWithBirthday,
          avgLoyaltyPoints,
          topSegments: customerSegments
        },
        monthlyTrends
      });

    } catch (error) {
      console.error('Erro ao buscar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  const growthRate = analytics.leadsStats.lastMonth > 0 
    ? ((analytics.leadsStats.thisMonth - analytics.leadsStats.lastMonth) / analytics.leadsStats.lastMonth) * 100 
    : analytics.leadsStats.thisMonth > 0 ? 100 : 0;

  if (loading) {
    return <div className="text-center py-8">Carregando analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Leads</p>
                <p className="text-2xl font-bold">{analytics.leadsStats.total}</p>
                <p className="text-xs text-muted-foreground">
                  Este mês: {analytics.leadsStats.thisMonth}
                </p>
              </div>
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant={growthRate >= 0 ? "default" : "destructive"} className="text-xs">
                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold">{analytics.leadsStats.conversionRate.toFixed(1)}%</p>
                <Progress value={analytics.leadsStats.conversionRate} className="mt-2" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Campanhas Ativas</p>
                <p className="text-2xl font-bold">{analytics.campaignStats.active}</p>
                <p className="text-xs text-muted-foreground">
                  De {analytics.campaignStats.total} totais
                </p>
              </div>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold">{analytics.customerStats.total}</p>
                <p className="text-xs text-muted-foreground">
                  Média: {analytics.customerStats.avgLoyaltyPoints.toFixed(0)} pts
                </p>
              </div>
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Leads</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Leads"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Conversões"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Projeto</CardTitle>
            <CardDescription>Leads por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.leadsStats.byProjectType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.leadsStats.byProjectType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Segmentos de Clientes</CardTitle>
            <CardDescription>Distribuição por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.customerStats.topSegments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance das Campanhas</CardTitle>
            <CardDescription>Métricas gerais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Abertura</span>
              <Badge variant="secondary">{analytics.campaignStats.avgOpenRate}%</Badge>
            </div>
            <Progress value={analytics.campaignStats.avgOpenRate} />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Campanhas Completas</span>
              <Badge variant="outline">{analytics.campaignStats.completed}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Clientes com Aniversário</span>
              <Badge variant="secondary">{analytics.customerStats.withBirthday}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}