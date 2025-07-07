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
    <div style="max-width: 800px; margin: 0 auto; padding: 0; font-family: Arial, sans-serif; background: white;">
      <!-- Header with company info -->
      <div style="background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%); color: white; padding: 30px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 20px; right: 30px; width: 60px; height: 60px;">
          <div style="width: 20px; height: 20px; background: #FF6B35; border-radius: 50%; position: absolute; top: 0; left: 0;"></div>
          <div style="width: 20px; height: 20px; background: #4ECDC4; border-radius: 50%; position: absolute; top: 20px; left: 20px;"></div>
          <div style="width: 20px; height: 20px; background: #45B7D1; border-radius: 50%; position: absolute; top: 40px; left: 10px;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">PRIME ENGENHARIA</h1>
            <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">Telefone: (11) 99999-9999</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">contato@primeengenharia.com.br</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">São Paulo, SP - Brasil</p>
          </div>
          <div style="text-align: right;">
            <div style="background: white; color: #4A90E2; padding: 15px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="margin: 0; font-size: 24px; font-weight: bold;">NOTA FISCAL</h2>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">#${invoice.invoice_number}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice and Customer Details -->
      <div style="padding: 30px; display: flex; justify-content: space-between; background: #f8f9fa;">
        <div style="flex: 1; margin-right: 30px;">
          <h3 style="color: #4A90E2; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #4A90E2; padding-bottom: 5px;">DADOS DA NOTA FISCAL</h3>
          <p style="margin: 8px 0; color: #333;"><strong>Data de Emissão:</strong> ${formatDate(invoice.issue_date)}</p>
          ${invoice.due_date ? `<p style="margin: 8px 0; color: #333;"><strong>Data de Vencimento:</strong> ${formatDate(invoice.due_date)}</p>` : ''}
          <p style="margin: 8px 0; color: #333;"><strong>Status:</strong> <span style="background: #4ECDC4; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${getStatusLabel(invoice.status)}</span></p>
          ${invoice.orders ? `<p style="margin: 8px 0; color: #333;"><strong>Pedido:</strong> ${invoice.orders.order_number}</p>` : ''}
        </div>
        <div style="flex: 1;">
          <h3 style="color: #4A90E2; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #4A90E2; padding-bottom: 5px;">FATURAR PARA</h3>
          <p style="margin: 8px 0; color: #333; font-weight: bold; font-size: 16px;">${invoice.customers.name}</p>
          <p style="margin: 8px 0; color: #666;">${invoice.customers.email}</p>
        </div>
      </div>

      <!-- Items Table -->
      <div style="padding: 0 30px 30px 30px;">
        <h3 style="color: #4A90E2; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #4A90E2; padding-bottom: 5px;">ITENS DO SERVIÇO</h3>
        <table style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #4A90E2; color: white;">
              <th style="padding: 15px; text-align: left; font-weight: bold;">DESCRIÇÃO</th>
              <th style="padding: 15px; text-align: center; font-weight: bold; width: 80px;">QTD</th>
              <th style="padding: 15px; text-align: right; font-weight: bold; width: 120px;">VALOR UNIT.</th>
              <th style="padding: 15px; text-align: right; font-weight: bold; width: 100px;">DESCONTO</th>
              <th style="padding: 15px; text-align: right; font-weight: bold; width: 120px;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.invoice_items?.map((item, index) => `
              <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'}; border-bottom: 1px solid #e9ecef;">
                <td style="padding: 15px; color: #333;">${item.description}</td>
                <td style="padding: 15px; text-align: center; color: #333; font-weight: bold;">${item.quantity}</td>
                <td style="padding: 15px; text-align: right; color: #333;">${formatCurrency(item.unit_price)}</td>
                <td style="padding: 15px; text-align: right; color: #333;">${item.discount}%</td>
                <td style="padding: 15px; text-align: right; color: #333; font-weight: bold;">${formatCurrency(item.subtotal)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      </div>

      <!-- Totals and Payment Info -->
      <div style="padding: 0 30px 30px 30px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1; margin-right: 30px;">
          <h3 style="color: #4A90E2; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #4A90E2; padding-bottom: 5px;">INFORMAÇÕES BANCÁRIAS</h3>
          <p style="margin: 8px 0; color: #333;"><strong>Banco:</strong> Banco do Brasil</p>
          <p style="margin: 8px 0; color: #333;"><strong>Agência:</strong> 1234-5</p>
          <p style="margin: 8px 0; color: #333;"><strong>Conta:</strong> 12345-6</p>
          <p style="margin: 8px 0; color: #333;"><strong>PIX:</strong> contato@primeengenharia.com.br</p>
        </div>
        <div style="width: 300px;">
          <div style="background: #f8f9fa; border: 2px solid #4A90E2; border-radius: 8px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #333;">
              <span>Subtotal:</span>
              <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #333;">
              <span>Desconto:</span>
              <span>-${formatCurrency(invoice.discount_amount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #333;">
              <span>Impostos:</span>
              <span>${formatCurrency(invoice.tax_amount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #333;">
              <span>Frete:</span>
              <span>R$ 0,00</span>
            </div>
            <hr style="margin: 15px 0; border: 1px solid #4A90E2;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 20px; color: #4A90E2;">
              <span>TOTAL:</span>
              <span>${formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes and Footer -->
      ${invoice.notes ? `
        <div style="padding: 0 30px 20px 30px;">
          <h3 style="color: #4A90E2; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #4A90E2; padding-bottom: 5px;">OBSERVAÇÕES</h3>
          <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; color: #333;">
            ${invoice.notes}
          </div>
        </div>
      ` : ''}
      
      <div style="background: #4A90E2; color: white; padding: 20px 30px; text-align: center; margin-top: 30px;">
        <p style="margin: 0; font-size: 14px;">Obrigado pela preferência! Em caso de dúvidas, entre em contato conosco.</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Este documento foi gerado eletronicamente e é válido sem assinatura.</p>
      </div>
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