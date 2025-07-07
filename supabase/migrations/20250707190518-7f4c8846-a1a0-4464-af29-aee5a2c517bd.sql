-- Adicionar configurações de SKU no sistema
INSERT INTO public.system_settings (key, value, description) VALUES
('sku_auto_generate', 'true', 'Gerar SKU automaticamente para novos produtos'),
('sku_format', 'CATEGORY-000000', 'Formato do SKU (CATEGORY-NNNNNN)'),
('sku_counter_estruturas-metalicas', '1', 'Contador SKU para categoria estruturas-metalicas'),
('sku_counter_blocos-tijolos', '1', 'Contador SKU para categoria blocos-tijolos'),
('sku_counter_soldas-eletrodos', '1', 'Contador SKU para categoria soldas-eletrodos'),
('sku_counter_parafusos-fixacao', '1', 'Contador SKU para categoria parafusos-fixacao'),
('sku_counter_tintas-acabamentos', '1', 'Contador SKU para categoria tintas-acabamentos'),
('sku_counter_ferramentas-manuais', '1', 'Contador SKU para categoria ferramentas-manuais'),
('sku_counter_ferramentas-eletricas', '1', 'Contador SKU para categoria ferramentas-eletricas'),
('sku_counter_materiais-construcao', '1', 'Contador SKU para categoria materiais-construcao'),
('sku_counter_equipamentos-seguranca', '1', 'Contador SKU para categoria equipamentos-seguranca'),
('sku_counter_outros', '1', 'Contador SKU para categoria outros'),
('sku_prefix_estruturas-metalicas', 'EST', 'Prefixo SKU para estruturas metálicas'),
('sku_prefix_blocos-tijolos', 'BLO', 'Prefixo SKU para blocos e tijolos'),
('sku_prefix_soldas-eletrodos', 'SOL', 'Prefixo SKU para soldas e eletrodos'),
('sku_prefix_parafusos-fixacao', 'PAR', 'Prefixo SKU para parafusos e fixação'),
('sku_prefix_tintas-acabamentos', 'TIN', 'Prefixo SKU para tintas e acabamentos'),
('sku_prefix_ferramentas-manuais', 'FEM', 'Prefixo SKU para ferramentas manuais'),
('sku_prefix_ferramentas-eletricas', 'FEE', 'Prefixo SKU para ferramentas elétricas'),
('sku_prefix_materiais-construcao', 'MAT', 'Prefixo SKU para materiais de construção'),
('sku_prefix_equipamentos-seguranca', 'EQS', 'Prefixo SKU para equipamentos de segurança'),
('sku_prefix_outros', 'OUT', 'Prefixo SKU para outros produtos')
ON CONFLICT (key) DO NOTHING;

-- Função para gerar SKU automaticamente
CREATE OR REPLACE FUNCTION public.generate_sku(product_category TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
    counter_key TEXT;
    prefix_key TEXT;
    next_number INTEGER;
    category_prefix TEXT;
    sku_code TEXT;
BEGIN
    -- Preparar chaves para buscar contador e prefixo
    counter_key := 'sku_counter_' || product_category;
    prefix_key := 'sku_prefix_' || product_category;
    
    -- Buscar próximo número para a categoria
    SELECT CAST(value AS INTEGER) INTO next_number 
    FROM system_settings 
    WHERE key = counter_key;
    
    -- Buscar prefixo da categoria
    SELECT value INTO category_prefix
    FROM system_settings 
    WHERE key = prefix_key;
    
    -- Se não encontrar, usar valores padrão
    IF next_number IS NULL THEN
        next_number := 1;
        -- Inserir contador inicial se não existir
        INSERT INTO system_settings (key, value, description) 
        VALUES (counter_key, '1', 'Contador SKU para categoria ' || product_category)
        ON CONFLICT (key) DO NOTHING;
    END IF;
    
    IF category_prefix IS NULL THEN
        category_prefix := 'GEN'; -- Prefixo genérico
        -- Inserir prefixo padrão se não existir
        INSERT INTO system_settings (key, value, description) 
        VALUES (prefix_key, 'GEN', 'Prefixo SKU para categoria ' || product_category)
        ON CONFLICT (key) DO NOTHING;
    END IF;
    
    -- Gerar SKU no formato: PREFIXO-000000
    sku_code := category_prefix || '-' || LPAD(next_number::TEXT, 6, '0');
    
    -- Atualizar contador
    UPDATE system_settings 
    SET value = (next_number + 1)::TEXT,
        updated_at = now()
    WHERE key = counter_key;
    
    RETURN sku_code;
END;
$$;

-- Função para validar unicidade do SKU
CREATE OR REPLACE FUNCTION public.validate_sku_uniqueness(sku_code TEXT, product_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
    existing_count INTEGER;
BEGIN
    -- Verificar se SKU já existe (excluindo o produto atual se estiver editando)
    SELECT COUNT(*) INTO existing_count
    FROM products 
    WHERE sku = sku_code 
    AND (product_id IS NULL OR id != product_id);
    
    RETURN existing_count = 0;
END;
$$;