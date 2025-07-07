export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface InvoiceItem {
  id?: string;
  product_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  subtotal: number;
}

export interface InvoiceFormData {
  customer_id: string;
  order_id: string;
  issue_date: string;
  due_date: string;
  status: string;
  notes: string;
}

export interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editInvoice?: any;
}