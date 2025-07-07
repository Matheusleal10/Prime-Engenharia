import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Customer, Order, Product, InvoiceItem, InvoiceFormData } from '@/components/admin/types/invoice';

export function useInvoiceForm(editInvoice?: any) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  const [formData, setFormData] = useState<InvoiceFormData>({
    customer_id: '',
    order_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft',
    notes: ''
  });

  const { toast } = useToast();

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

  const sanitizeFormData = (data: InvoiceFormData) => {
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

  const initializeForm = (open: boolean) => {
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
  };

  const submitForm = async (onSuccess: () => void, onOpenChange: (open: boolean) => void) => {
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

  return {
    loading,
    customers,
    orders,
    products,
    items,
    formData,
    setFormData,
    updateItem,
    addItem,
    removeItem,
    calculateTotals,
    initializeForm,
    submitForm
  };
}