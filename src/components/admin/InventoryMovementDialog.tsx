import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InventoryMovementFormData {
  product_id: string;
  movement_type: string;
  quantity: string;
  reason: string;
  reference_type: string;
  cost_per_unit: string;
}

interface InventoryMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  products: Array<{ id: string; name: string; }>;
}

export function InventoryMovementDialog({ open, onOpenChange, onSuccess, products }: InventoryMovementDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InventoryMovementFormData>({
    product_id: '',
    movement_type: 'in',
    quantity: '',
    reason: '',
    reference_type: 'manual',
    cost_per_unit: '',
  });

  const handleInputChange = (field: keyof InventoryMovementFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || !formData.quantity || !formData.reason) {
      toast({
        title: "Campos obrigatórios",
        description: "Produto, quantidade e motivo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const quantity = parseInt(formData.quantity);
      const adjustedQuantity = formData.movement_type === 'out' ? -quantity : quantity;

      // Create movement record
      const { error: movementError } = await supabase
        .from('inventory_movements')
        .insert([{
          product_id: formData.product_id,
          movement_type: formData.movement_type,
          quantity: adjustedQuantity,
          reason: formData.reason,
          reference_type: formData.reference_type,
          cost_per_unit: formData.cost_per_unit ? parseFloat(formData.cost_per_unit) : null,
        }]);

      if (movementError) throw movementError;

      // Update product stock
      const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', formData.product_id)
        .single();

      if (fetchError) throw fetchError;

      const newStock = (currentProduct.stock_quantity || 0) + adjustedQuantity;

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', formData.product_id);

      if (updateError) throw updateError;

      toast({
        title: "Movimentação registrada",
        description: `Estoque ${formData.movement_type === 'in' ? 'aumentado' : 'reduzido'} com sucesso.`
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        product_id: '',
        movement_type: 'in',
        quantity: '',
        reason: '',
        reference_type: 'manual',
        cost_per_unit: '',
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar movimentação",
        description: "Não foi possível registrar a movimentação.",
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
          <DialogTitle>Nova Movimentação de Estoque</DialogTitle>
          <DialogDescription>
            Registre uma entrada ou saída de produtos no estoque
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product_id">Produto *</Label>
            <Select value={formData.product_id} onValueChange={(value) => handleInputChange('product_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="movement_type">Tipo *</Label>
              <Select value={formData.movement_type} onValueChange={(value) => handleInputChange('movement_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Entrada</SelectItem>
                  <SelectItem value="out">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Ex: Compra, Venda, Ajuste de inventário"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost_per_unit">Custo por Unidade</Label>
            <Input
              id="cost_per_unit"
              type="number"
              step="0.01"
              value={formData.cost_per_unit}
              onChange={(e) => handleInputChange('cost_per_unit', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}