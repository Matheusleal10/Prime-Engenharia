import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { InvoiceActions } from './InvoiceActions';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  order_id: string;
  issue_date: string;
  due_date: string;
  status: string;
  total_amount: number;
  created_at: string;
  customers: {
    name: string;
    email: string;
  };
  orders?: {
    order_number: string;
  };
}

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onDownloadPDF: (invoiceId: string) => void;
  onDownloadXML: (invoiceId: string) => void;
  onExportExcel: (invoiceId: string) => void;
}

export function InvoiceTable({ 
  invoices, 
  loading, 
  onView,
  onEdit, 
  onDelete, 
  onDownloadPDF, 
  onDownloadXML, 
  onExportExcel 
}: InvoiceTableProps) {
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

  if (loading) {
    return <div className="text-center py-8">Carregando notas fiscais...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Pedido</TableHead>
            <TableHead>Emissão</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
              <TableCell>{invoice.customers?.name || 'Cliente não informado'}</TableCell>
              <TableCell>{invoice.orders?.order_number || '-'}</TableCell>
              <TableCell>{formatDate(invoice.issue_date)}</TableCell>
              <TableCell>{invoice.due_date ? formatDate(invoice.due_date) : '-'}</TableCell>
              <TableCell>{formatPrice(invoice.total_amount)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(invoice.status)}>
                  {getStatusLabel(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <InvoiceActions
                  invoice={invoice}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDownloadPDF={onDownloadPDF}
                  onDownloadXML={onDownloadXML}
                  onExportExcel={onExportExcel}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}