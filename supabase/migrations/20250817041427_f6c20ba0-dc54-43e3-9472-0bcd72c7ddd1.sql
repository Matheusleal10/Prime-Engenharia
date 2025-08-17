-- Fix critical security vulnerabilities

-- 1. Restrict customers table access to authenticated users only
DROP POLICY IF EXISTS "Anyone can view customers" ON public.customers;
CREATE POLICY "Authenticated users can manage customers" 
ON public.customers 
FOR ALL 
TO authenticated
USING (auth.role() = 'authenticated');

-- 2. Restrict suppliers table access to authenticated users only  
DROP POLICY IF EXISTS "Anyone can view suppliers" ON public.suppliers;
CREATE POLICY "Authenticated users can manage suppliers" 
ON public.suppliers 
FOR ALL 
TO authenticated
USING (auth.role() = 'authenticated');

-- 3. Restrict financial_transactions to authenticated users only
DROP POLICY IF EXISTS "Anyone can view financial transactions" ON public.financial_transactions;
CREATE POLICY "Authenticated users can manage financial transactions" 
ON public.financial_transactions 
FOR ALL 
TO authenticated
USING (auth.role() = 'authenticated');

-- 4. Restrict invoices access (already has proper policies, but ensure no public access)
-- The existing policies are already secure

-- 5. Restrict leads table access to authenticated users only
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can view leads" ON public.leads;

CREATE POLICY "Authenticated users can insert leads" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete leads" 
ON public.leads 
FOR DELETE 
TO authenticated
USING (auth.role() = 'authenticated');

-- 6. Restrict audit_logs to admin users only
DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON public.audit_logs;

-- Create admin check function for audit logs
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'ceo'
  )
$$;

CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (public.is_admin_user());

-- 7. Restrict marketing_campaigns to authenticated users only
DROP POLICY IF EXISTS "Anyone can view marketing campaigns" ON public.marketing_campaigns;
CREATE POLICY "Authenticated users can manage marketing campaigns" 
ON public.marketing_campaigns 
FOR ALL 
TO authenticated
USING (auth.role() = 'authenticated');

-- 8. Restrict product_categories to require authentication for management
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.product_categories;

CREATE POLICY "Anyone can view active categories" 
ON public.product_categories 
FOR SELECT 
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories" 
ON public.product_categories 
FOR ALL 
TO authenticated
USING (auth.role() = 'authenticated');

-- 9. Fix database function security - add proper search_path to all functions
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.auto_generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.auto_generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.employee_role, 'operator'::public.employee_role)
  );
  RETURN NEW;
END;
$function$;

-- 10. Create secure role management function
CREATE OR REPLACE FUNCTION public.update_user_role_secure(_target_user_id uuid, _new_role employee_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Verificar se quem está executando é CEO
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Apenas CEOs podem alterar roles de usuários';
  END IF;
  
  -- Não permitir que CEO rebaixe a si mesmo
  IF auth.uid() = _target_user_id AND _new_role != 'ceo'::public.employee_role THEN
    RAISE EXCEPTION 'CEOs não podem rebaixar a si mesmos';
  END IF;
  
  -- Atualizar o role do usuário
  UPDATE public.profiles 
  SET 
    role = _new_role,
    updated_at = now()
  WHERE id = _target_user_id;
  
  -- Verificar se a atualização foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;
  
  RETURN true;
END;
$function$;

-- 11. Restrict profiles table to prevent role escalation
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile excluding role" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent users from changing their own role
  (OLD.role = NEW.role OR public.is_admin_user())
);

CREATE POLICY "Only system can insert profiles"
ON public.profiles
FOR INSERT
TO service_role
WITH CHECK (true);

-- 12. Add system settings security
CREATE POLICY "Authenticated users can view system settings" 
ON public.system_settings 
FOR SELECT 
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify system settings" 
ON public.system_settings 
FOR ALL 
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());