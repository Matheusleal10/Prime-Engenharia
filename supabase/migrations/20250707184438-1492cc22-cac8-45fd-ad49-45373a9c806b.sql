-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_series TEXT NOT NULL DEFAULT '001',
  customer_id UUID NOT NULL REFERENCES customers(id),
  order_id UUID REFERENCES orders(id),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'sent', 'paid', 'cancelled')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  fiscal_key TEXT, -- Chave de acesso da NF-e
  xml_content TEXT, -- Conteúdo XML da NF-e
  pdf_url TEXT, -- URL do PDF da nota fiscal
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Authenticated users can manage invoices" 
ON public.invoices 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Customers can view their own invoices"
ON public.invoices
FOR SELECT
USING (customer_id IN (
  SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
));

-- RLS Policies for invoice_items
CREATE POLICY "Authenticated users can manage invoice items" 
ON public.invoice_items 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Customers can view their invoice items"
ON public.invoice_items
FOR SELECT
USING (invoice_id IN (
  SELECT id FROM invoices WHERE customer_id IN (
    SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
  )
));

-- Add fiscal settings to system_settings
INSERT INTO public.system_settings (key, value, description) VALUES
('invoice_series', '001', 'Série padrão das notas fiscais'),
('next_invoice_number', '1', 'Próximo número de nota fiscal'),
('company_cnpj', '', 'CNPJ da empresa para emissão de NF'),
('company_ie', '', 'Inscrição Estadual da empresa'),
('company_im', '', 'Inscrição Municipal da empresa'),
('tax_regime', 'simples', 'Regime tributário da empresa'),
('default_tax_rate', '0', 'Alíquota padrão de impostos'),
('invoice_observations', '', 'Observações padrão das notas fiscais')
ON CONFLICT (key) DO NOTHING;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
VOLATILE
AS $$
DECLARE
    next_number INTEGER;
    invoice_series TEXT;
    invoice_number TEXT;
BEGIN
    -- Get next number and series
    SELECT CAST(value AS INTEGER) INTO next_number 
    FROM system_settings 
    WHERE key = 'next_invoice_number';
    
    SELECT value INTO invoice_series
    FROM system_settings 
    WHERE key = 'invoice_series';
    
    -- If not found, start from 1
    IF next_number IS NULL THEN
        next_number := 1;
    END IF;
    
    IF invoice_series IS NULL THEN
        invoice_series := '001';
    END IF;
    
    -- Generate invoice number
    invoice_number := invoice_series || '-' || LPAD(next_number::TEXT, 6, '0');
    
    -- Update next number
    UPDATE system_settings 
    SET value = (next_number + 1)::TEXT,
        updated_at = now()
    WHERE key = 'next_invoice_number';
    
    RETURN invoice_number;
END;
$$;

-- Trigger to auto-generate invoice number
CREATE OR REPLACE FUNCTION public.auto_generate_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
VOLATILE
AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_generate_invoice_number
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_invoice_number();

-- Trigger for updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_invoices_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_invoice_items_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_trigger_function();