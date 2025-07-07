import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { InvoiceDialog } from '@/components/admin/InvoiceDialog';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { InvoiceTable } from '@/components/admin/invoices/InvoiceTable';
import { InvoiceViewDialog } from '@/components/admin/invoices/InvoiceViewDialog';
import { useInvoices } from '@/hooks/useInvoices';

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

export default function Invoices() {
  const { 
    invoices, 
    loading, 
    fetchInvoices, 
    handleDownloadPDF, 
    handleDownloadXML, 
    handleExportExcel 
  } = useInvoices();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setInvoiceDialogOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setDeletingInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleView = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    fetchInvoices();
    setEditingInvoice(null);
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notas Fiscais</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie todas as notas fiscais do sistema</p>
        </div>
        <Button onClick={() => setInvoiceDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota Fiscal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Notas Fiscais</CardTitle>
          <CardDescription>
            Total de {invoices.length} notas fiscais
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar notas fiscais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <InvoiceTable
            invoices={filteredInvoices}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDownloadPDF={handleDownloadPDF}
            onDownloadXML={handleDownloadXML}
            onExportExcel={handleExportExcel}
          />
        </CardContent>
      </Card>

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        onSuccess={handleDialogSuccess}
        editInvoice={editingInvoice}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={fetchInvoices}
        itemId={deletingInvoice?.id || ''}
        itemName={deletingInvoice?.invoice_number || ''}
        tableName="invoices"
        itemType="Nota Fiscal"
      />

      <InvoiceViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        invoice={viewingInvoice}
      />
    </div>
  );
}