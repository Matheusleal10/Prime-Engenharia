import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Customer {
  id: string;
  name: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  total: number;
  status: string;
  delivery_date: string;
  delivery_address: string;
  notes: string;
}

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editOrder?: Order | null;
}

export function OrderDialog({ open, onOpenChange, onSuccess, editOrder }: OrderDialogProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    order_number: '',
    customer_id: '',
    status: 'draft',
    delivery_date: '',
    delivery_address: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCustomers();
      if (editOrder) {
        setFormData({
          order_number: editOrder.order_number,
          customer_id: editOrder.customer_id,
          status: editOrder.status,
          delivery_date: editOrder.delivery_date || '',
          delivery_address: editOrder.delivery_address || '',
          notes: editOrder.notes || ''
        });
      } else {
        generateOrderNumber();
        setFormData({
          order_number: '',
          customer_id: '',
          status: 'draft',
          delivery_date: '',
          delivery_address: '',
          notes: ''
        });
      }
    }
  }, [open, editOrder]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive"
      });
    }
  };

  const generateOrderNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('order_number')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastNumber = data[0].order_number.match(/\d+$/);
        if (lastNumber) {
          nextNumber = parseInt(lastNumber[0]) + 1;
        }
      }

      const orderNumber = `PED-${nextNumber.toString().padStart(6, '0')}`;
      setFormData(prev => ({ ...prev, order_number: orderNumber }));
    } catch (error) {
      const orderNumber = `PED-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, order_number: orderNumber }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id) {
      toast({
        title: "Erro de validação",
        description: "Por favor, selecione um cliente.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        delivery_date: formData.delivery_date || null,
        delivery_address: formData.delivery_address || null,
        notes: formData.notes || null
      };

      if (editOrder) {
        const { error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', editOrder.id);

        if (error) throw error;

        toast({
          title: "Pedido atualizado",
          description: "Pedido foi atualizado com sucesso."
        });
      } else {
        const { error } = await supabase
          .from('orders')
          .insert([orderData]);

        if (error) throw error;

        toast({
          title: "Pedido criado",
          description: "Novo pedido foi criado com sucesso."
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: `Não foi possível ${editOrder ? 'atualizar' : 'criar'} o pedido.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editOrder ? 'Editar Pedido' : 'Novo Pedido'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order_number">Número do Pedido</Label>
            <Input
              id="order_number"
              value={formData.order_number}
              onChange={(e) => setFormData(prev => ({ ...prev, order_number: e.target.value }))}
              required
              disabled={!!editOrder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_id">Cliente</Label>
            <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_date">Data de Entrega</Label>
            <Input
              id="delivery_date"
              type="date"
              value={formData.delivery_date}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_address">Endereço de Entrega</Label>
            <Textarea
              id="delivery_address"
              value={formData.delivery_address}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_address: e.target.value }))}
              placeholder="Endereço completo para entrega"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações adicionais sobre o pedido"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : editOrder ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}