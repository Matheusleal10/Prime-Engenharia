import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  order_id: string;
  issue_date: string;
  due_date: string;
  status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  notes?: string;
  created_at: string;
  customers: {
    name: string;
    email: string;
  };
  orders?: {
    order_number: string;
  };
  invoice_items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    discount: number;
    tax_rate: number;
    subtotal: number;
  }>;
}

interface InvoiceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoiceViewDialog({ open, onOpenChange, invoice }: InvoiceViewDialogProps) {
  if (!invoice) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'issued': return 'default';
      case 'sent': return 'outline';
      case 'paid': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'issued': return 'Emitida';
      case 'sent': return 'Enviada';
      case 'paid': return 'Paga';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Nota Fiscal {invoice.invoice_number}</span>
            <Badge variant={getStatusVariant(invoice.status)}>
              {getStatusLabel(invoice.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações da Nota Fiscal</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Número:</span>
                  <span className="font-medium">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Emissão:</span>
                  <span>{formatDate(invoice.issue_date)}</span>
                </div>
                {invoice.due_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Vencimento:</span>
                    <span>{formatDate(invoice.due_date)}</span>
                  </div>
                )}
                {invoice.orders && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pedido:</span>
                    <span>{invoice.orders.order_number}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cliente</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium">{invoice.customers.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{invoice.customers.email}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          {invoice.invoice_items && invoice.invoice_items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Itens</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Descrição</th>
                      <th className="border border-border p-2 text-center">Qtd</th>
                      <th className="border border-border p-2 text-right">Valor Unit.</th>
                      <th className="border border-border p-2 text-right">Desc. %</th>
                      <th className="border border-border p-2 text-right">Taxa %</th>
                      <th className="border border-border p-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.invoice_items.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-border p-2">{item.description}</td>
                        <td className="border border-border p-2 text-center">{item.quantity}</td>
                        <td className="border border-border p-2 text-right">{formatPrice(item.unit_price)}</td>
                        <td className="border border-border p-2 text-right">{item.discount}%</td>
                        <td className="border border-border p-2 text-right">{item.tax_rate}%</td>
                        <td className="border border-border p-2 text-right">{formatPrice(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Separator />

          {/* Totals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Totais</h3>
            <div className="bg-muted p-4 rounded space-y-2 max-w-sm ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto:</span>
                <span>{formatPrice(invoice.discount_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impostos:</span>
                <span>{formatPrice(invoice.tax_amount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatPrice(invoice.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Observações</h3>
                <div className="bg-muted p-4 rounded">
                  <p>{invoice.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}