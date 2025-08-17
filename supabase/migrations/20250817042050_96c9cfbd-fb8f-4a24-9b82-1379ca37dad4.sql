-- 1) Remove public SELECT from products
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

-- 2) Create a safe public view that exposes only non-sensitive fields
CREATE OR REPLACE VIEW public.products_public
WITH (security_barrier) AS
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

-- 3) Allow read access only to the safe view
GRANT USAGE ON SCHEMA public TO anon, authenticated;
REVOKE ALL ON public.products_public FROM PUBLIC;
GRANT SELECT ON public.products_public TO anon, authenticated;
