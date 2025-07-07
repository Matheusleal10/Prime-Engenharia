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

export interface CompanySettings {
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  company_cnpj?: string;
  company_logo_url?: string;
  company_bank_name?: string;
  company_bank_agency?: string;
  company_bank_account?: string;
  company_bank_pix?: string;
}