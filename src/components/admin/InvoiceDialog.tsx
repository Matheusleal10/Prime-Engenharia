import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Plus, Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface InvoiceItem {
  id?: string;
  product_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  subtotal: number;
}

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editInvoice?: any;
}

export function InvoiceDialog({ open, onOpenChange, onSuccess, editInvoice }: InvoiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    order_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft',
    notes: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchData();
      if (editInvoice) {
        setFormData({
          customer_id: editInvoice.customer_id,
          order_id: editInvoice.order_id || '',
          issue_date: editInvoice.issue_date,
          due_date: editInvoice.due_date || '',
          status: editInvoice.status,
          notes: editInvoice.notes || ''
        });
        fetchInvoiceItems(editInvoice.id);
      } else {
        setItems([{
          product_id: '',
          description: '',
          quantity: 1,
          unit_price: 0,
          discount: 0,
          tax_rate: 0,
          subtotal: 0
        }]);
      }
    }
  }, [open, editInvoice]);

  const fetchData = async () => {
    try {
      const [customersResult, ordersResult, productsResult] = await Promise.all([
        supabase.from('customers').select('id, name, email').eq('status', 'active'),
        supabase.from('orders').select('id, order_number, customer_id'),
        supabase.from('products').select('id, name, price').eq('is_active', true)
      ]);

      if (customersResult.error) throw customersResult.error;
      if (ordersResult.error) throw ordersResult.error;
      if (productsResult.error) throw productsResult.error;

      setCustomers(customersResult.data || []);
      setOrders(ordersResult.data || []);
      setProducts(productsResult.data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados necessários.",
        variant: "destructive"
      });
    }
  };

  const fetchInvoiceItems = async (invoiceId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching invoice items:', error);
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate subtotal
    if (['quantity', 'unit_price', 'discount', 'tax_rate'].includes(field)) {
      const item = updatedItems[index];
      const baseAmount = item.quantity * item.unit_price;
      const discountAmount = baseAmount * (item.discount / 100);
      const taxableAmount = baseAmount - discountAmount;
      const taxAmount = taxableAmount * (item.tax_rate / 100);
      updatedItems[index].subtotal = taxableAmount + taxAmount;
    }
    
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, {
      product_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
      tax_rate: 0,
      subtotal: 0
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const discountAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price * item.discount / 100), 0);
    const taxAmount = items.reduce((sum, item) => {
      const taxableAmount = (item.quantity * item.unit_price) - (item.quantity * item.unit_price * item.discount / 100);
      return sum + (taxableAmount * item.tax_rate / 100);
    }, 0);
    const total = subtotal - discountAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const sanitizeFormData = (data: any) => {
    return {
      ...data,
      customer_id: data.customer_id || null,
      order_id: data.order_id === '' ? null : data.order_id,
      due_date: data.due_date === '' ? null : data.due_date
    };
  };

  const validateForm = () => {
    if (!formData.customer_id) {
      toast({
        title: "Cliente obrigatório",
        description: "Selecione um cliente para continuar.",
        variant: "destructive"
      });
      return false;
    }

    if (items.length === 0) {
      toast({
        title: "Itens obrigatórios",
        description: "Adicione pelo menos um item à nota fiscal.",
        variant: "destructive"
      });
      return false;
    }

    const invalidItems = items.filter(item => !item.product_id || item.quantity <= 0);
    if (invalidItems.length > 0) {
      toast({
        title: "Itens inválidos",
        description: "Todos os itens devem ter um produto selecionado e quantidade maior que zero.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

      const sanitizedData = sanitizeFormData(formData);
      const invoiceData = {
        ...sanitizedData,
        subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total_amount: total
      };

      let invoiceId: string;

      if (editInvoice) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', editInvoice.id);

        if (error) throw error;
        invoiceId = editInvoice.id;

        // Delete existing items
        await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', invoiceId);
      } else {
        const { data, error } = await supabase
          .from('invoices')
          .insert({
            ...invoiceData,
            invoice_number: '' // Will be auto-generated by trigger
          })
          .select()
          .single();

        if (error) throw error;
        invoiceId = data.id;
      }

      // Insert items
      const itemsToInsert = items.map(item => ({
        invoice_id: invoiceId,
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount,
        tax_rate: item.tax_rate,
        tax_amount: (item.quantity * item.unit_price - (item.quantity * item.unit_price * item.discount / 100)) * (item.tax_rate / 100),
        subtotal: item.subtotal
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: editInvoice ? "Nota fiscal atualizada" : "Nota fiscal criada",
        description: editInvoice ? "A nota fiscal foi atualizada com sucesso." : "A nova nota fiscal foi criada com sucesso."
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a nota fiscal.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      order_id: '',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: '',
      status: 'draft',
      notes: ''
    });
    setItems([{
      product_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
      tax_rate: 0,
      subtotal: 0
    }]);
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editInvoice ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
          </DialogTitle>
          <DialogDescription>
            {editInvoice ? 'Edite os dados da nota fiscal.' : 'Preencha os dados para criar uma nova nota fiscal.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">Cliente *</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_id">Pedido (Opcional)</Label>
              <Select
                value={formData.order_id}
                onValueChange={(value) => setFormData({ ...formData, order_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um pedido" />
                </SelectTrigger>
                <SelectContent>
                  {orders
                    .filter(order => !formData.customer_id || order.customer_id === formData.customer_id)
                    .map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.order_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue_date">Data de Emissão *</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="issued">Emitida</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="paid">Paga</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Itens da Nota Fiscal</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 border rounded">
                  <div className="col-span-2">
                    <Label className="text-xs">Produto</Label>
                    <Select
                      value={item.product_id}
                      onValueChange={(value) => {
                        const product = products.find(p => p.id === value);
                        updateItem(index, 'product_id', value);
                        if (product) {
                          updateItem(index, 'description', product.name);
                          updateItem(index, 'unit_price', product.price);
                        }
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Produto" />
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

                  <div className="col-span-3">
                    <Label className="text-xs">Descrição</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="h-8"
                      placeholder="Descrição"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label className="text-xs">Qtd</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="h-8"
                      min="1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label className="text-xs">Preço Unit.</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label className="text-xs">Desc. %</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="h-8"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label className="text-xs">Taxa %</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.tax_rate}
                      onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                      className="h-8"
                      min="0"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label className="text-xs">Subtotal</Label>
                    <Input
                      value={item.subtotal.toFixed(2)}
                      readOnly
                      className="h-8 bg-muted"
                    />
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted p-4 rounded space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto:</span>
                <span>R$ {discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impostos:</span>
                <span>R$ {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações adicionais"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : editInvoice ? 'Salvar Alterações' : 'Criar Nota Fiscal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}