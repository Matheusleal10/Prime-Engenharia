-- 1) Remove public read from base table products
DROP POLICY IF EXISTS "Anonymous can view active products" ON public.products;

-- 2) Secure RPC to expose only safe product fields to the public
CREATE OR REPLACE FUNCTION public.get_public_products()
RETURNS TABLE (
  id uuid,
  price numeric,
  is_featured boolean,
  is_active boolean,
  sort_order integer,
  name text,
  icon text,
  description text,
  details text,
  category text,
  unit text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.price,
    p.is_featured,
    p.is_active,
    p.sort_order,
    p.name,
    p.icon,
    p.description,
    p.details,
    p.category,
    p.unit
  FROM public.products p
  WHERE p.is_active = true
  ORDER BY p.sort_order ASC, p.created_at ASC
$$;
