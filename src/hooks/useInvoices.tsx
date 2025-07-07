import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateInvoicePDF } from '@/services/invoicePDFService';
import { generateInvoiceXML } from '@/services/invoiceXMLService';
import { exportInvoiceToExcel } from '@/services/invoiceExcelService';

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

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            name,
            email
          ),
          orders (
            order_number
          ),
          invoice_items (
            description,
            quantity,
            unit_price,
            discount,
            tax_rate,
            subtotal
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar notas fiscais",
        description: "Não foi possível carregar a lista de notas fiscais.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadPDF = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        toast({
          title: "Erro",
          description: "Nota fiscal não encontrada.",
          variant: "destructive"
        });
        return;
      }

      await generateInvoicePDF(invoice);
      toast({
        title: "PDF gerado com sucesso",
        description: "O arquivo PDF foi baixado."
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo PDF.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadXML = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        toast({
          title: "Erro",
          description: "Nota fiscal não encontrada.",
          variant: "destructive"
        });
        return;
      }

      generateInvoiceXML(invoice);
      toast({
        title: "XML gerado com sucesso",
        description: "O arquivo XML foi baixado."
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar XML",
        description: "Não foi possível gerar o arquivo XML.",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        toast({
          title: "Erro",
          description: "Nota fiscal não encontrada.",
          variant: "destructive"
        });
        return;
      }

      exportInvoiceToExcel(invoice);
      toast({
        title: "Excel exportado com sucesso",
        description: "O arquivo Excel foi baixado."
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar Excel",
        description: "Não foi possível exportar para Excel.",
        variant: "destructive"
      });
    }
  };

  return {
    invoices,
    loading,
    fetchInvoices,
    handleDownloadPDF,
    handleDownloadXML,
    handleExportExcel
  };
}