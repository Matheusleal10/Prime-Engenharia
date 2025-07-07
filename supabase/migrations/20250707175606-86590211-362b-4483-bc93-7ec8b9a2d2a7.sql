-- Correção das funções para eliminar avisos de "mutable function search path"

-- 1. Recriar função generate_order_number com configurações seguras
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
VOLATILE
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

-- 2. Recriar função auto_generate_order_number com configurações seguras
CREATE OR REPLACE FUNCTION public.auto_generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
VOLATILE
AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$;

-- 3. Recriar função update_stock_after_movement com configurações seguras
CREATE OR REPLACE FUNCTION public.update_stock_after_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
VOLATILE
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

-- 4. Recriar função validate_stock_movement com configurações seguras
CREATE OR REPLACE FUNCTION public.validate_stock_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
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

-- 5. Recriar função audit_trigger_function com configurações seguras
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
VOLATILE
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

-- 6. Recriar função update_updated_at_column com configurações seguras
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
VOLATILE
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;