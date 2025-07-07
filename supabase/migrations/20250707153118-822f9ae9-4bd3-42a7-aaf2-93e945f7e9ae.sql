-- Fase 1: Limpeza dos dados de teste
DELETE FROM leads;
DELETE FROM products;

-- Fase 2: Configuração inicial para produção
-- Inserir configurações do sistema
INSERT INTO system_settings (key, value, description) VALUES
('company_name', 'Sua Empresa', 'Nome da empresa'),
('company_document', '', 'CNPJ/CPF da empresa'),
('company_email', '', 'Email principal da empresa'),
('company_phone', '', 'Telefone principal da empresa'),
('company_address', '', 'Endereço da empresa'),
('default_currency', 'BRL', 'Moeda padrão do sistema'),
('timezone', 'America/Sao_Paulo', 'Fuso horário do sistema'),
('default_min_stock', '10', 'Estoque mínimo padrão'),
('default_max_stock', '100', 'Estoque máximo padrão'),
('notification_email', '', 'Email para notificações do sistema'),
('low_stock_alert', 'true', 'Alertas de estoque baixo ativados'),
('order_auto_numbering', 'true', 'Numeração automática de pedidos'),
('next_order_number', '1', 'Próximo número de pedido')
ON CONFLICT (key) DO NOTHING;

-- Criar locais de estoque padrão
INSERT INTO inventory_locations (name, description, is_active) VALUES
('Depósito Principal', 'Local principal de armazenamento', true),
('Showroom', 'Área de exposição de produtos', true),
('Área Externa', 'Estoque ao ar livre', true)
ON CONFLICT DO NOTHING;

-- Criar função para gerar números de pedido automaticamente
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_number INTEGER;
    order_number TEXT;
BEGIN
    -- Buscar próximo número
    SELECT CAST(value AS INTEGER) INTO next_number 
    FROM system_settings 
    WHERE key = 'next_order_number';
    
    -- Se não encontrar, começar do 1
    IF next_number IS NULL THEN
        next_number := 1;
    END IF;
    
    -- Gerar número do pedido com formatação
    order_number := 'PED-' || LPAD(next_number::TEXT, 6, '0');
    
    -- Atualizar próximo número
    UPDATE system_settings 
    SET value = (next_number + 1)::TEXT,
        updated_at = now()
    WHERE key = 'next_order_number';
    
    RETURN order_number;
END;
$$;

-- Trigger para gerar número de pedido automaticamente
CREATE OR REPLACE FUNCTION auto_generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_order_number ON orders;
CREATE TRIGGER trigger_auto_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_order_number();

-- Função para atualizar estoque após movimentações
CREATE OR REPLACE FUNCTION update_stock_after_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Atualizar estoque do produto baseado no tipo de movimentação
    IF NEW.movement_type = 'entrada' THEN
        UPDATE products 
        SET stock_quantity = stock_quantity + NEW.quantity,
            updated_at = now()
        WHERE id = NEW.product_id;
    ELSIF NEW.movement_type = 'saida' THEN
        UPDATE products 
        SET stock_quantity = stock_quantity - NEW.quantity,
            updated_at = now()
        WHERE id = NEW.product_id;
    ELSIF NEW.movement_type = 'ajuste' THEN
        UPDATE products 
        SET stock_quantity = NEW.quantity,
            updated_at = now()
        WHERE id = NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_stock ON inventory_movements;
CREATE TRIGGER trigger_update_stock
    AFTER INSERT ON inventory_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_movement();

-- Função para validar estoque antes de saídas
CREATE OR REPLACE FUNCTION validate_stock_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    current_stock INTEGER;
    product_name TEXT;
BEGIN
    -- Apenas validar saídas
    IF NEW.movement_type = 'saida' THEN
        SELECT stock_quantity, name INTO current_stock, product_name
        FROM products 
        WHERE id = NEW.product_id;
        
        IF current_stock < NEW.quantity THEN
            RAISE EXCEPTION 'Estoque insuficiente para o produto %. Estoque atual: %, Quantidade solicitada: %', 
                product_name, current_stock, NEW.quantity;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_validate_stock ON inventory_movements;
CREATE TRIGGER trigger_validate_stock
    BEFORE INSERT ON inventory_movements
    FOR EACH ROW
    EXECUTE FUNCTION validate_stock_movement();

-- Criar tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ativar RLS na tabela de logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para logs (apenas leitura para usuários autenticados)
CREATE POLICY "Authenticated users can view audit logs"
ON audit_logs
FOR SELECT
USING (auth.role() = 'authenticated');

-- Função genérica de auditoria
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        operation,
        old_data,
        new_data,
        user_id
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Aplicar auditoria em tabelas importantes
DROP TRIGGER IF EXISTS audit_products ON products;
CREATE TRIGGER audit_products
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_customers ON customers;
CREATE TRIGGER audit_customers
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_orders ON orders;
CREATE TRIGGER audit_orders
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_inventory_movements ON inventory_movements;
CREATE TRIGGER audit_inventory_movements
    AFTER INSERT OR UPDATE OR DELETE ON inventory_movements
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_financial_transactions ON financial_transactions;
CREATE TRIGGER audit_financial_transactions
    AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();