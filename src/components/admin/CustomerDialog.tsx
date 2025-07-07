import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CustomerFiscalFields } from './forms/CustomerFiscalFields';

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editCustomer?: any;
}

export function CustomerDialog({ open, onOpenChange, onSuccess, editCustomer }: CustomerDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    birth_date: '',
    customer_type: 'residential',
    document_type: 'cpf',
    document: '',
    company_name: '',
    notes: '',
    communication_preferences: {
      email: true,
      sms: false,
      whatsapp: false
    },
    // Campos fiscais
    cpf_cnpj: '',
    ie: '',
    customer_class: 'pessoa_fisica',
    full_address: '',
    address_number: '',
    address_complement: '',
    neighborhood: '',
    city_code: '',
    country_code: '1058'
  });

  useEffect(() => {
    if (editCustomer) {
      setFormData({
        name: editCustomer.name || '',
        email: editCustomer.email || '',
        phone: editCustomer.phone || '',
        address: editCustomer.address || '',
        city: editCustomer.city || '',
        state: editCustomer.state || '',
        zip_code: editCustomer.zip_code || '',
        birth_date: editCustomer.birth_date || '',
        customer_type: editCustomer.customer_type || 'residential',
        document_type: editCustomer.document_type || 'cpf',
        document: editCustomer.document || '',
        company_name: editCustomer.company_name || '',
        notes: editCustomer.notes || '',
        communication_preferences: editCustomer.communication_preferences || {
          email: true,
          sms: false,
          whatsapp: false
        },
        // Campos fiscais
        cpf_cnpj: editCustomer.cpf_cnpj || '',
        ie: editCustomer.ie || '',
        customer_class: editCustomer.customer_class || 'pessoa_fisica',
        full_address: editCustomer.full_address || editCustomer.address || '',
        address_number: editCustomer.address_number || '',
        address_complement: editCustomer.address_complement || '',
        neighborhood: editCustomer.neighborhood || '',
        city_code: editCustomer.city_code || '',
        country_code: editCustomer.country_code || '1058'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        birth_date: '',
        customer_type: 'residential',
        document_type: 'cpf',
        document: '',
        company_name: '',
        notes: '',
        communication_preferences: {
          email: true,
          sms: false,
          whatsapp: false
        },
        // Campos fiscais
        cpf_cnpj: '',
        ie: '',
        customer_class: 'pessoa_fisica',
        full_address: '',
        address_number: '',
        address_complement: '',
        neighborhood: '',
        city_code: '',
        country_code: '1058'
      });
    }
  }, [editCustomer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    // Validações para NF-e
    if (formData.cpf_cnpj && (!formData.full_address || !formData.address_number || !formData.neighborhood || !formData.city || !formData.state || !formData.zip_code)) {
      toast({
        title: "Dados incompletos para NF-e",
        description: "Para emitir NF-e, todos os campos de endereço são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const customerData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        document: formData.document || null,
        document_type: formData.document_type,
        customer_type: formData.customer_type,
        company_name: formData.company_name || null,
        address: formData.address || formData.full_address || null,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zip_code || null,
        birth_date: formData.birth_date || null,
        communication_preferences: formData.communication_preferences,
        notes: formData.notes || null,
        // Campos fiscais
        cpf_cnpj: formData.cpf_cnpj || null,
        ie: formData.ie || null,
        customer_class: formData.customer_class,
        full_address: formData.full_address || null,
        address_number: formData.address_number || null,
        address_complement: formData.address_complement || null,
        neighborhood: formData.neighborhood || null,
        city_code: formData.city_code || null,
        country_code: formData.country_code
      };

      if (editCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', editCustomer.id);
        
        if (error) throw error;
        toast({ title: "Cliente atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([customerData]);
        
        if (error) throw error;
        toast({ title: "Cliente criado com sucesso!" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar cliente",
        description: "Não foi possível salvar o cliente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editCustomer ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription>
            {editCustomer ? 'Edite as informações do cliente' : 'Cadastre um novo cliente no sistema'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Básicos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_type">Tipo de Cliente</Label>
                <Select 
                  value={formData.customer_type} 
                  onValueChange={(value) => setFormData({ ...formData, customer_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residencial</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {formData.customer_type !== 'residential' && (
              <div className="space-y-2">
                <Label htmlFor="company_name">Nome da Empresa</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Razão social da empresa"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              />
            </div>
          </div>

          <CustomerFiscalFields formData={formData} setFormData={setFormData} />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferências de Comunicação</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email_pref">Email</Label>
                <Switch
                  id="email_pref"
                  checked={formData.communication_preferences.email}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData,
                      communication_preferences: {
                        ...formData.communication_preferences,
                        email: checked
                      }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms_pref">SMS</Label>
                <Switch
                  id="sms_pref"
                  checked={formData.communication_preferences.sms}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData,
                      communication_preferences: {
                        ...formData.communication_preferences,
                        sms: checked
                      }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp_pref">WhatsApp</Label>
                <Switch
                  id="whatsapp_pref"
                  checked={formData.communication_preferences.whatsapp}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData,
                      communication_preferences: {
                        ...formData.communication_preferences,
                        whatsapp: checked
                      }
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informações adicionais sobre o cliente"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : editCustomer ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}