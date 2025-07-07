import * as XLSX from 'xlsx';
import { InvoiceData } from './invoicePDFService';

export const exportInvoiceToExcel = (invoice: InvoiceData): void => {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Invoice Summary
  const summaryData = [
    ['NOTA FISCAL', ''],
    ['Número', invoice.invoice_number],
    ['Data de Emissão', new Date(invoice.issue_date).toLocaleDateString('pt-BR')],
    ['Data de Vencimento', invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('pt-BR') : 'N/A'],
    ['Status', getStatusLabel(invoice.status)],
    ['Pedido', invoice.orders?.order_number || 'N/A'],
    [''],
    ['CLIENTE', ''],
    ['Nome', invoice.customers.name],
    ['Email', invoice.customers.email],
    [''],
    ['TOTAIS', ''],
    ['Subtotal', formatCurrency(invoice.subtotal)],
    ['Desconto', formatCurrency(invoice.discount_amount)],
    ['Impostos', formatCurrency(invoice.tax_amount)],
    ['Total', formatCurrency(invoice.total_amount)],
  ];

  if (invoice.notes) {
    summaryData.push([''], ['OBSERVAÇÕES', ''], ['', invoice.notes]);
  }

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Set column widths
  summarySheet['!cols'] = [
    { width: 20 },
    { width: 30 }
  ];

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

  // Sheet 2: Items Detail
  if (invoice.invoice_items && invoice.invoice_items.length > 0) {
    const itemsData = [
      ['ITENS DA NOTA FISCAL'],
      [''],
      ['Descrição', 'Quantidade', 'Valor Unitário', 'Desconto %', 'Taxa %', 'Subtotal']
    ];

    invoice.invoice_items.forEach(item => {
      itemsData.push([
        item.description,
        item.quantity.toString(),
        item.unit_price.toString(),
        item.discount.toString(),
        item.tax_rate.toString(),
        item.subtotal.toString()
      ]);
    });

    const itemsSheet = XLSX.utils.aoa_to_sheet(itemsData);
    
    // Set column widths
    itemsSheet['!cols'] = [
      { width: 30 }, // Descrição
      { width: 12 }, // Quantidade
      { width: 15 }, // Valor Unitário
      { width: 12 }, // Desconto
      { width: 10 }, // Taxa
      { width: 15 }  // Subtotal
    ];

    // Format currency columns
    const range = XLSX.utils.decode_range(itemsSheet['!ref'] || 'A1');
    for (let row = 3; row <= range.e.r; row++) {
      // Valor Unitário column (C)
      const unitPriceCell = XLSX.utils.encode_cell({ r: row, c: 2 });
      if (itemsSheet[unitPriceCell]) {
        itemsSheet[unitPriceCell].z = '"R$ "#,##0.00';
      }
      
      // Subtotal column (F)
      const subtotalCell = XLSX.utils.encode_cell({ r: row, c: 5 });
      if (itemsSheet[subtotalCell]) {
        itemsSheet[subtotalCell].z = '"R$ "#,##0.00';
      }
    }

    XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Itens');
  }

  // Generate and download the file
  const fileName = `nota-fiscal-${invoice.invoice_number}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'draft': return 'Rascunho';
    case 'issued': return 'Emitida';
    case 'sent': return 'Enviada';
    case 'paid': return 'Paga';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};