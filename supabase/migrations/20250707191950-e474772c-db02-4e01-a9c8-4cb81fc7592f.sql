-- Remover a constraint restritiva de categorias para permitir flexibilidade total
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;

-- Atualizar a coluna para remover a restrição e manter apenas o valor padrão
ALTER TABLE public.products ALTER COLUMN category DROP DEFAULT;
ALTER TABLE public.products ALTER COLUMN category SET DEFAULT 'outros';