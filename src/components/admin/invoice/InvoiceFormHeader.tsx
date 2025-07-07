import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, Order, InvoiceFormData } from '@/components/admin/types/invoice';

interface InvoiceFormHeaderProps {
  formData: InvoiceFormData;
  setFormData: (data: InvoiceFormData) => void;
  customers: Customer[];
  orders: Order[];
}

export function InvoiceFormHeader({ formData, setFormData, customers, orders }: InvoiceFormHeaderProps) {
  return (
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
  );
}