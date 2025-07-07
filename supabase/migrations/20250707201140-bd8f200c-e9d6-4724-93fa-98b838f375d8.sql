-- Criar tabela para categorias de produtos
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Anyone can view active categories" 
ON public.product_categories 
FOR SELECT 
USING (is_active = true);

-- Política para usuários autenticados gerenciarem categorias
CREATE POLICY "Authenticated users can manage categories" 
ON public.product_categories 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Trigger para updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir categorias padrão baseadas no sistema atual
INSERT INTO public.product_categories (name, description) VALUES
('estruturas-metalicas', 'Estruturas Metálicas'),
('blocos-tijolos', 'Blocos e Tijolos'),
('soldas-eletrodos', 'Soldas e Eletrodos'),
('parafusos-fixacao', 'Parafusos e Fixação'),
('tintas-acabamentos', 'Tintas e Acabamentos'),
('ferramentas-manuais', 'Ferramentas Manuais'),
('ferramentas-eletricas', 'Ferramentas Elétricas'),
('materiais-construcao', 'Materiais de Construção'),
('equipamentos-seguranca', 'Equipamentos de Segurança'),
('outros', 'Outros');

-- Adicionar foreign key na tabela products para categorias
ALTER TABLE public.products 
ADD COLUMN category_id UUID REFERENCES public.product_categories(id);

-- Atualizar produtos existentes para usar a nova estrutura
UPDATE public.products 
SET category_id = (
  SELECT id FROM public.product_categories 
  WHERE name = products.category
);

-- Criar índice para performance
CREATE INDEX idx_products_category_id ON public.products(category_id);