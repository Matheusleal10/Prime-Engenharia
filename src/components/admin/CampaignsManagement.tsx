import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface CampaignsManagementProps {
  onEdit: (campaign: Campaign) => void;
  refreshTrigger?: number;
}

export function CampaignsManagement({ onEdit, refreshTrigger }: CampaignsManagementProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, [refreshTrigger]);

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

  return (
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
                      <Button variant="ghost" size="sm" onClick={() => onEdit(campaign)}>
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
  );
}