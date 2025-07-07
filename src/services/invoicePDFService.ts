import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface InvoiceData {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  notes?: string;
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

export const generateInvoicePDF = async (invoice: InvoiceData): Promise<void> => {
  // Create HTML template for invoice
  const invoiceHTML = createInvoiceTemplate(invoice);
  
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

const createInvoiceTemplate = (invoice: InvoiceData): string => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">NOTA FISCAL</h1>
        <h2 style="color: #666; font-size: 18px; margin: 0;">Nº ${invoice.invoice_number}</h2>
      </div>

      <!-- Invoice Info -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3 style="color: #333; margin-bottom: 10px;">Dados da Nota Fiscal</h3>
          <p><strong>Data de Emissão:</strong> ${formatDate(invoice.issue_date)}</p>
          ${invoice.due_date ? `<p><strong>Data de Vencimento:</strong> ${formatDate(invoice.due_date)}</p>` : ''}
          <p><strong>Status:</strong> ${getStatusLabel(invoice.status)}</p>
          ${invoice.orders ? `<p><strong>Pedido:</strong> ${invoice.orders.order_number}</p>` : ''}
        </div>
        <div>
          <h3 style="color: #333; margin-bottom: 10px;">Cliente</h3>
          <p><strong>${invoice.customers.name}</strong></p>
          <p>${invoice.customers.email}</p>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; margin-bottom: 15px;">Itens</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Descrição</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Qtd</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Valor Unit.</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Desconto</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.invoice_items?.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${item.description}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${formatCurrency(item.unit_price)}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${item.discount}%</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${formatCurrency(item.subtotal)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="margin-left: auto; width: 300px;">
        <div style="border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal:</span>
            <span>${formatCurrency(invoice.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Desconto:</span>
            <span>${formatCurrency(invoice.discount_amount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Impostos:</span>
            <span>${formatCurrency(invoice.tax_amount)}</span>
          </div>
          <hr style="margin: 10px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
            <span>Total:</span>
            <span>${formatCurrency(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      ${invoice.notes ? `
        <div style="margin-top: 30px;">
          <h3 style="color: #333; margin-bottom: 10px;">Observações</h3>
          <p style="border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">${invoice.notes}</p>
        </div>
      ` : ''}
    </div>
  `;
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