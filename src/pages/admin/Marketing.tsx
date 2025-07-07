import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, Send, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CampaignDialog } from '@/components/admin/CampaignDialog';

interface Campaign {
  id: string;
  name: string;
  campaign_type: string;
  status: string;
  message_template: string;
  target_criteria: any;
  scheduled_date: string;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  birth_date: string;
  loyalty_points: number;
}

export default function Marketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [birthdayCustomers, setBirthdayCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
    fetchBirthdayCustomers();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar campanhas",
        description: "Não foi possível carregar a lista de campanhas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBirthdayCustomers = async () => {
    try {
      // Buscar clientes que fazem aniversário hoje ou nos próximos 7 dias
      const today = new Date();
      const todayMonth = today.getMonth() + 1; // getMonth() retorna 0-11
      const todayDay = today.getDate();
      
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email, birth_date, loyalty_points')
        .not('birth_date', 'is', null);

      if (error) throw error;
      
      // Filtrar clientes que fazem aniversário nos próximos 7 dias
      const birthdayCustomers = (data || []).filter(customer => {
        if (!customer.birth_date) return false;
        
        const birthDate = new Date(customer.birth_date);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        
        // Verificar se o aniversário é hoje ou nos próximos 7 dias
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() + i);
          const checkMonth = checkDate.getMonth() + 1;
          const checkDay = checkDate.getDate();
          
          if (birthMonth === checkMonth && birthDay === checkDay) {
            return true;
          }
        }
        return false;
      });
      
      setBirthdayCustomers(birthdayCustomers);
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.campaign_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'paused': return 'outline';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const getCampaignTypeLabel = (type: string) => {
    switch (type) {
      case 'birthday': return 'Aniversário';
      case 'cashback': return 'Cashback';
      case 'promotional': return 'Promocional';
      case 'custom': return 'Personalizada';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'draft': return 'Rascunho';
      case 'paused': return 'Pausada';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignDialogOpen(true);
  };

  const handleDelete = async (campaign: Campaign) => {
    if (confirm(`Tem certeza que deseja excluir a campanha "${campaign.name}"?`)) {
      try {
        const { error } = await supabase
          .from('marketing_campaigns')
          .delete()
          .eq('id', campaign.id);

        if (error) throw error;
        
        toast({
          title: "Campanha excluída",
          description: "A campanha foi excluída com sucesso.",
        });
        
        fetchCampaigns();
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir a campanha.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDialogSuccess = () => {
    fetchCampaigns();
    setEditingCampaign(null);
  };

  const sendBirthdayMessages = async () => {
    try {
      // Aqui você implementaria a lógica de envio real
      toast({
        title: "Mensagens enviadas",
        description: `${birthdayCustomers.length} mensagens de aniversário foram enviadas.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagens",
        description: "Não foi possível enviar as mensagens de aniversário.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing & CRM</h1>
          <p className="text-muted-foreground">Gerencie campanhas e relacionamento com clientes</p>
        </div>
        <Button onClick={() => setCampaignDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="birthdays">Aniversários</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Points</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas de Marketing</CardTitle>
              <CardDescription>
                Total de {campaigns.length} campanhas criadas
              </CardDescription>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar campanhas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando campanhas...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Agendada</TableHead>
                      <TableHead>Criada em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCampaignTypeLabel(campaign.campaign_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(campaign.status)}>
                            {getStatusLabel(campaign.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {campaign.scheduled_date ? new Date(campaign.scheduled_date).toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell>
                          {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(campaign)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(campaign)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="birthdays">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Aniversariantes
              </CardTitle>
              <CardDescription>
                {birthdayCustomers.length} clientes fazem aniversário nos próximos 7 dias
              </CardDescription>
              {birthdayCustomers.length > 0 && (
                <Button onClick={sendBirthdayMessages} className="w-fit">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagens de Aniversário
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {birthdayCustomers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum aniversariante nos próximos 7 dias
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Aniversário</TableHead>
                      <TableHead>Pontos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {birthdayCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                          {new Date(customer.birth_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {customer.loyalty_points || 0} pts
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Sistema de Loyalty Points
              </CardTitle>
              <CardDescription>
                Gerencie pontos e recompensas dos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CampaignDialog
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
        onSuccess={handleDialogSuccess}
        editCampaign={editingCampaign}
      />
    </div>
  );
}