import { Button } from '@/components/ui/button';
import { Eye, Edit, Download, File, FileText, Trash2 } from 'lucide-react';

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

interface InvoiceActionsProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onDownloadPDF: (invoiceId: string) => void;
  onDownloadXML: (invoiceId: string) => void;
  onExportExcel: (invoiceId: string) => void;
}

export function InvoiceActions({ 
  invoice, 
  onView,
  onEdit, 
  onDelete, 
  onDownloadPDF, 
  onDownloadXML, 
  onExportExcel 
}: InvoiceActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-1">
      <Button variant="ghost" size="sm" onClick={() => onView(invoice)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onEdit(invoice)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDownloadPDF(invoice.id)}>
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDownloadXML(invoice.id)}>
        <File className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onExportExcel(invoice.id)}>
        <FileText className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDelete(invoice)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}