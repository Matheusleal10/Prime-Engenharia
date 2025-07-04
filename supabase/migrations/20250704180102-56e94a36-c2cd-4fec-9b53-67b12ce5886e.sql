-- Criar tabela para produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'outros' CHECK (category IN ('principal', 'outros')),
  price DECIMAL(10,2),
  unit TEXT DEFAULT 'unidade',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (produtos são visíveis para todos)
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Política para inserção/atualização (apenas para uso futuro com auth)
CREATE POLICY "Authenticated users can manage products" 
ON public.products 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Trigger para updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_sort_order ON public.products(sort_order);

-- Inserir dados dos produtos existentes
INSERT INTO public.products (name, icon, description, details, category, is_featured, sort_order) VALUES
-- Produto principal
('Tijolo Ecológico', '🧱', 'Nossos tijolos ecológicos são produzidos com materiais sustentáveis e tecnologia avançada, oferecendo resistência superior e impacto ambiental reduzido.', 'Ideais para construção sustentável, oferecendo encaixe perfeito, economia de cimento, resistência superior a 6 MPa e isolamento térmico e acústico.', 'principal', true, 1),

-- Outros produtos
('Blocos de concreto', '🧱', 'Blocos estruturais de alta resistência para construções sólidas e duráveis.', 'Ideais para alvenaria estrutural, oferecendo resistência mecânica superior e durabilidade comprovada.', 'outros', false, 2),

('Pisos intertravados', '🔲', 'Pisos drenantes e antiderrapantes, ideais para calçadas e estacionamentos.', 'Sistema de pavimentação sustentável com alta resistência ao tráfego e fácil manutenção.', 'outros', false, 3),

('Meio-fio', '🛤️', 'Peças padronizadas para delimitação de vias e organização urbana.', 'Produzidos conforme normas ABNT, garantindo qualidade e padronização em projetos urbanos.', 'outros', false, 4),

('Lajes e vigotas', '🏗️', 'Sistema de lajes pré-moldadas para construções ágeis e econômicas.', 'Solução completa para coberturas e entre-pisos com rapidez na execução e economia de materiais.', 'outros', false, 5),

('Anéis', '⭕', 'Anéis de concreto para poços, fossas e sistemas de drenagem.', 'Peças circulares pré-moldadas com encaixe perfeito para sistemas de saneamento e drenagem.', 'outros', false, 6),

('Pré-moldados', '🏭', 'Diversas peças pré-moldadas sob medida para seu projeto específico.', 'Soluções personalizadas em concreto pré-moldado para atender às necessidades específicas de cada projeto.', 'outros', false, 7);