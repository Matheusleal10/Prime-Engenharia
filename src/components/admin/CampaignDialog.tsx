import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CampaignFormData {
  name: string;
  campaign_type: string;
  status: string;
  message_template: string;
  scheduled_date: string;
}

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editCampaign?: any;
}

export function CampaignDialog({ open, onOpenChange, onSuccess, editCampaign }: CampaignDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: editCampaign?.name || '',
    campaign_type: editCampaign?.campaign_type || 'birthday',
    status: editCampaign?.status || 'draft',
    message_template: editCampaign?.message_template || '',
    scheduled_date: editCampaign?.scheduled_date || '',
  });

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message_template) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e template da mensagem são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const campaignData = {
        name: formData.name,
        campaign_type: formData.campaign_type,
        status: formData.status,
        message_template: formData.message_template,
        scheduled_date: formData.scheduled_date || null,
      };

      if (editCampaign) {
        const { error } = await supabase
          .from('marketing_campaigns')
          .update(campaignData)
          .eq('id', editCampaign.id);
        
        if (error) throw error;
        toast({ title: "Campanha atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('marketing_campaigns')
          .insert([campaignData]);
        
        if (error) throw error;
        toast({ title: "Campanha criada com sucesso!" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar campanha",
        description: "Não foi possível salvar a campanha.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMessageTemplateExample = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'Olá {nome}! 🎉 Hoje é seu dia especial! Feliz aniversário! Como presente, você ganhou 50 pontos de fidelidade. Aproveite!';
      case 'cashback':
        return 'Oi {nome}! 💰 Você tem {pontos} pontos acumulados. Que tal usar para ganhar desconto na sua próxima compra?';
      case 'promotional':
        return 'Ei {nome}! 🔥 Temos uma super promoção especial para você. Confira agora e economize!';
      default:
        return 'Olá {nome}! Temos uma mensagem especial para você...';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editCampaign ? 'Editar Campanha' : 'Nova Campanha'}</DialogTitle>
          <DialogDescription>
            {editCampaign ? 'Edite as informações da campanha' : 'Crie uma nova campanha de marketing'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Campanha *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Feliz Aniversário 2024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign_type">Tipo de Campanha</Label>
              <Select value={formData.campaign_type} onValueChange={(value) => handleInputChange('campaign_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Aniversário</SelectItem>
                  <SelectItem value="cashback">Cashback</SelectItem>
                  <SelectItem value="promotional">Promocional</SelectItem>
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="paused">Pausada</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Data Agendada</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message_template">Template da Mensagem *</Label>
            <Textarea
              id="message_template"
              value={formData.message_template}
              onChange={(e) => handleInputChange('message_template', e.target.value)}
              placeholder={getMessageTemplateExample(formData.campaign_type)}
              rows={4}
              required
            />
            <p className="text-sm text-muted-foreground">
              Use {'{nome}'} para incluir o nome do cliente e {'{pontos}'} para incluir os pontos de fidelidade.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : editCampaign ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}