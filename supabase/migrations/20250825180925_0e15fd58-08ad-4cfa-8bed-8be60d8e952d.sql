-- Fix for Security Definer View: switch to security_invoker and configure safe access
-- 1) Make the view run with invoker privileges
ALTER VIEW public.products_public SET (security_invoker = true);

-- 2) Ensure anon cannot broadly select from products, only whitelisted columns
REVOKE ALL ON TABLE public.products FROM anon;

GRANT SELECT (
  id,
  price,
  is_featured,
  is_active,
  sort_order,
  name,
  icon,
  description,
  details,
  category,
  unit
) ON public.products TO anon;

-- 3) Allow anon to read only active rows via RLS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'products' 
      AND policyname = 'Anonymous can view active products'
  ) THEN
    CREATE POLICY "Anonymous can view active products"
    ON public.products
    FOR SELECT
    TO anon
    USING (is_active = true);
  END IF;
END $$;

-- 4) Grant access to the view for anon so clients can query it directly
GRANT SELECT ON public.products_public TO anon;
