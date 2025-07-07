-- Adicionar campo birth_date na tabela customers
ALTER TABLE public.customers 
ADD COLUMN birth_date DATE,
ADD COLUMN communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "whatsapp": false}'::jsonb,
ADD COLUMN loyalty_points INTEGER DEFAULT 0;

-- Criar tabela para campanhas de marketing
CREATE TABLE public.marketing_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('birthday', 'cashback', 'promotional', 'custom')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  message_template TEXT NOT NULL,
  target_criteria JSONB,
  scheduled_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Criar tabela para histórico de envios de campanhas
CREATE TABLE public.campaign_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('email', 'sms', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'opened', 'clicked')),
  message_content TEXT,
  delivery_response JSONB
);

-- Criar tabela para transações de loyalty points
CREATE TABLE public.loyalty_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'bonus')),
  points INTEGER NOT NULL,
  description TEXT,
  reference_id UUID, -- pode referenciar order_id, invoice_id, etc
  reference_type TEXT, -- 'order', 'invoice', 'manual', etc
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para marketing_campaigns
CREATE POLICY "Authenticated users can manage marketing campaigns" 
ON public.marketing_campaigns 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Políticas RLS para campaign_sends
CREATE POLICY "Authenticated users can manage campaign sends" 
ON public.campaign_sends 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Políticas RLS para loyalty_transactions
CREATE POLICY "Authenticated users can manage loyalty transactions" 
ON public.loyalty_transactions 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Adicionar triggers para updated_at
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON public.marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_customers_birth_date ON public.customers(birth_date);
CREATE INDEX idx_campaign_sends_customer ON public.campaign_sends(customer_id);
CREATE INDEX idx_campaign_sends_campaign ON public.campaign_sends(campaign_id);
CREATE INDEX idx_loyalty_transactions_customer ON public.loyalty_transactions(customer_id);
CREATE INDEX idx_marketing_campaigns_status ON public.marketing_campaigns(status);
CREATE INDEX idx_marketing_campaigns_type ON public.marketing_campaigns(campaign_type);

-- Função para atualizar pontos de loyalty do cliente
CREATE OR REPLACE FUNCTION public.update_customer_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar total de pontos do cliente
    UPDATE public.customers 
    SET loyalty_points = (
        SELECT COALESCE(SUM(
            CASE 
                WHEN transaction_type = 'earned' OR transaction_type = 'bonus' THEN points
                WHEN transaction_type = 'redeemed' OR transaction_type = 'expired' THEN -points
                ELSE 0
            END
        ), 0)
        FROM public.loyalty_transactions 
        WHERE customer_id = NEW.customer_id
    )
    WHERE id = NEW.customer_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar pontos automaticamente
CREATE TRIGGER update_loyalty_points_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.loyalty_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_customer_loyalty_points();