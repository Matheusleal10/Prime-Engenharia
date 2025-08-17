-- Fix the security definer view issue by removing WITH (security_barrier)
-- This is safer as it doesn't escalate privileges
DROP VIEW IF EXISTS public.products_public;

CREATE VIEW public.products_public AS
SELECT 
  id,
  name,
  icon,
  description,
  details,
  category,
  unit,
  price,
  is_featured,
  is_active,
  sort_order
FROM public.products
WHERE is_active = true;

-- Ensure proper permissions on the view
REVOKE ALL ON public.products_public FROM PUBLIC;
GRANT SELECT ON public.products_public TO anon, authenticated;