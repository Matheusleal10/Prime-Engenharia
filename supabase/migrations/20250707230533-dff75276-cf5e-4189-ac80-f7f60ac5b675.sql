-- Atualizar enum de roles para incluir os tipos específicos de funcionários
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('ceo', 'office', 'marketing', 'financial', 'operator');

-- Atualizar tabela profiles para usar o novo enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE public.app_role USING role::public.app_role,
ALTER COLUMN role SET DEFAULT 'operator';

-- Criar função para verificar roles específicos
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- Criar função para verificar se user é admin (CEO)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'ceo')
$$;

-- Atualizar configurações do sistema para incluir roles disponíveis
INSERT INTO system_settings (key, value, description) VALUES
('available_roles', '{"ceo": "CEO - Acesso Total", "office": "Escritório - Produtos e Estoque", "marketing": "Marketing - Clientes e Leads", "financial": "Financeiro - Relatórios", "operator": "Operador - Básico"}', 'Roles disponíveis no sistema')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;