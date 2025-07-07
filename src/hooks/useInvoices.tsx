import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    toast({
      title: "Baixando PDF",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const handleDownloadXML = async (invoiceId: string) => {
    toast({
      title: "Baixando XML",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  const handleExportExcel = async (invoiceId: string) => {
    toast({
      title: "Exportando para Excel",
      description: "Esta funcionalidade será implementada em breve."
    });
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