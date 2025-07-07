import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TransactionFormData {
  description: string;
  amount: string;
  transaction_type: string;
  category: string;
  account: string;
  transaction_date: string;
  due_date: string;
  customer_id: string;
  supplier_id: string;
}

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  customers: Array<{ id: string; name: string; }>;
  suppliers: Array<{ id: string; name: string; }>;
}

export function TransactionDialog({ open, onOpenChange, onSuccess, customers, suppliers }: TransactionDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: '',
    transaction_type: 'income',
    category: '',
    account: '',
    transaction_date: new Date().toISOString().split('T')[0],
    due_date: '',
    customer_id: '',
    supplier_id: '',
  });

  const handleInputChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.transaction_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Descrição, valor e data são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        transaction_type: formData.transaction_type,
        category: formData.category || null,
        account: formData.account || null,
        transaction_date: formData.transaction_date,
        due_date: formData.due_date || null,
        customer_id: formData.customer_id || null,
        supplier_id: formData.supplier_id || null,
        status: 'pending',
      };

      const { error } = await supabase
        .from('financial_transactions')
        .insert([transactionData]);
      
      if (error) throw error;
      
      toast({ title: "Transação criada com sucesso!" });
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        transaction_type: 'income',
        category: '',
        account: '',
        transaction_date: new Date().toISOString().split('T')[0],
        due_date: '',
        customer_id: '',
        supplier_id: '',
      });
    } catch (error) {
      toast({
        title: "Erro ao criar transação",
        description: "Não foi possível criar a transação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Transação Financeira</DialogTitle>
          <DialogDescription>
            Registre uma nova receita ou despesa no sistema
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição da transação"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction_type">Tipo *</Label>
              <Select value={formData.transaction_type} onValueChange={(value) => handleInputChange('transaction_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Ex: Vendas, Compras, Manutenção"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Conta</Label>
              <Input
                id="account"
                value={formData.account}
                onChange={(e) => handleInputChange('account', e.target.value)}
                placeholder="Ex: Banco, Caixa, Cartão"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction_date">Data da Transação *</Label>
              <Input
                id="transaction_date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => handleInputChange('transaction_date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>
          </div>

          {formData.transaction_type === 'income' && (
            <div className="space-y-2">
              <Label htmlFor="customer_id">Cliente</Label>
              <Select value={formData.customer_id} onValueChange={(value) => handleInputChange('customer_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente (opcional)" />
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
          )}

          {formData.transaction_type === 'expense' && (
            <div className="space-y-2">
              <Label htmlFor="supplier_id">Fornecedor</Label>
              <Select value={formData.supplier_id} onValueChange={(value) => handleInputChange('supplier_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Transação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}