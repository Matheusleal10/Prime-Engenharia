-- Criar tabela para perfis de usuários (necessário para autenticação)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'seller', 'operator', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atualizar tabela leads para incluir conversão para customer
ALTER TABLE public.leads ADD COLUMN converted_to_customer BOOLEAN DEFAULT false;
ALTER TABLE public.leads ADD COLUMN customer_id UUID REFERENCES public.profiles(id);

-- Criar tabela de clientes (evolução dos leads)
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT, -- CPF/CNPJ
  document_type TEXT CHECK (document_type IN ('cpf', 'cnpj')),
  company_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  customer_type TEXT DEFAULT 'residential' CHECK (customer_type IN ('residential', 'commercial')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Políticas para customers (usuários autenticados podem ver e gerenciar)
CREATE POLICY "Authenticated users can manage customers" 
ON public.customers 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar tabela de contatos dos clientes
CREATE TABLE public.customer_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  position TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.customer_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage customer contacts" 
ON public.customer_contacts 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Atualizar tabela products para incluir campos do ERP
ALTER TABLE public.products ADD COLUMN sku TEXT UNIQUE;
ALTER TABLE public.products ADD COLUMN barcode TEXT;
ALTER TABLE public.products ADD COLUMN cost_price DECIMAL(10,2);
ALTER TABLE public.products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN min_stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN max_stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN location TEXT;
ALTER TABLE public.products ADD COLUMN supplier_id UUID;
ALTER TABLE public.products ADD COLUMN dimensions TEXT; -- JSON com altura, largura, comprimento
ALTER TABLE public.products ADD COLUMN weight DECIMAL(8,3);

-- Criar tabela de pedidos
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) DEFAULT 0,
  tax DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_terms TEXT,
  delivery_date DATE,
  delivery_address TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage orders" 
ON public.orders 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar tabela de itens do pedido
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage order items" 
ON public.order_items 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar tabela de fornecedores
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT,
  document TEXT, -- CNPJ
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  contact_person TEXT,
  payment_terms TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage suppliers" 
ON public.suppliers 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Adicionar referência de fornecedor nos produtos
ALTER TABLE public.products ADD CONSTRAINT fk_products_supplier 
FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);

-- Criar tabela de recebimentos
CREATE TABLE public.receivings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receiving_number TEXT NOT NULL UNIQUE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  invoice_number TEXT,
  invoice_date DATE,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  total_value DECIMAL(12,2),
  notes TEXT,
  received_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.receivings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage receivings" 
ON public.receivings 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar tabela de itens recebidos
CREATE TABLE public.receiving_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receiving_id UUID NOT NULL REFERENCES public.receivings(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity_expected INTEGER,
  quantity_received INTEGER NOT NULL,
  unit_cost DECIMAL(10,2),
  quality_status TEXT DEFAULT 'approved' CHECK (quality_status IN ('approved', 'rejected', 'inspection')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.receiving_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage receiving items" 
ON public.receiving_items 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar tabela de movimentações de estoque
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  reference_type TEXT CHECK (reference_type IN ('order', 'receiving', 'adjustment', 'transfer')),
  reference_id UUID, -- Pode ser order_id, receiving_id, etc.
  reason TEXT,
  cost_per_unit DECIMAL(10,2),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage inventory movements" 
ON public.inventory_movements 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar tabela de transações financeiras
CREATE TABLE public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT,
  account TEXT, -- Conta bancária ou caixa
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  customer_id UUID REFERENCES public.customers(id),
  supplier_id UUID REFERENCES public.suppliers(id),
  order_id UUID REFERENCES public.orders(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage financial transactions" 
ON public.financial_transactions 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar tabela de localizações no estoque
CREATE TABLE public.inventory_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.inventory_locations ENABLE ROW_LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage inventory locations" 
ON public.inventory_locations 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar tabela de configurações do sistema
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Criar triggers para updated_at em todas as tabelas
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para performance
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_customers_document ON public.customers(document);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);  
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_inventory_movements_product_id ON public.inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_created_at ON public.inventory_movements(created_at DESC);
CREATE INDEX idx_financial_transactions_type ON public.financial_transactions(transaction_type);
CREATE INDEX idx_financial_transactions_status ON public.financial_transactions(status);
CREATE INDEX idx_financial_transactions_date ON public.financial_transactions(transaction_date DESC);

-- Inserir configurações padrão do sistema
INSERT INTO public.system_settings (key, value, description) VALUES
('company_name', 'PRIME ENGENHARIA', 'Nome da empresa'),
('company_phone', '(98) 98710-8157', 'Telefone principal da empresa'),
('company_email', 'contato@primeengenharia.com', 'Email principal da empresa'),
('whatsapp_number', '559898708157', 'Número do WhatsApp para contato'),
('order_number_prefix', 'PE', 'Prefixo para numeração de pedidos'),
('receiving_number_prefix', 'REC', 'Prefixo para numeração de recebimentos');

-- Inserir localizações padrão do estoque
INSERT INTO public.inventory_locations (name, description) VALUES
('Armazém Principal', 'Localização principal do estoque'),
('Área de Expedição', 'Área para separação de pedidos'),
('Área de Recebimento', 'Área para recebimento de materiais');