-- Fix search_path for security functions that don't have it set
-- This addresses the security warnings from the linter

-- Update generate_order_number function to include search_path
CREATE OR REPLACE FUNCTION public.generate_order_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Update auto_generate_order_number function to include search_path
CREATE OR REPLACE FUNCTION public.auto_generate_order_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$function$;

-- Update generate_invoice_number function to include search_path
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;