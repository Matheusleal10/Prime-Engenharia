import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceData, CompanySettings } from './types';
import { createInvoiceTemplate } from './template';

export const generateInvoicePDF = async (invoice: InvoiceData): Promise<void> => {
  // Fetch company settings
  const { data: settings } = await supabase
    .from('system_settings')
    .select('key, value');
    
  const companySettings: CompanySettings = settings?.reduce((acc, setting) => {
    acc[setting.key as keyof CompanySettings] = setting.value || '';
    return acc;
  }, {} as CompanySettings) || {};
  
  // Create HTML template for invoice
  const invoiceHTML = createInvoiceTemplate(invoice, companySettings);
  
  // Create a temporary div to render the invoice
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = invoiceHTML;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.padding = '20mm';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download the PDF
    pdf.save(`nota-fiscal-${invoice.invoice_number}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};