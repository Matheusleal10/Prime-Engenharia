-- Primeiro, criar o novo enum
CREATE TYPE public.employee_role AS ENUM ('ceo', 'office', 'marketing', 'financial', 'operator');

-- Adicionar nova coluna com o tipo correto
ALTER TABLE public.profiles ADD COLUMN employee_role public.employee_role DEFAULT 'operator';

-- Migrar dados existentes
UPDATE public.profiles SET employee_role = 
  CASE 
    WHEN role = 'admin' THEN 'ceo'::public.employee_role
    WHEN role = 'seller' THEN 'office'::public.employee_role
    WHEN role = 'operator' THEN 'operator'::public.employee_role
    ELSE 'operator'::public.employee_role
  END;

-- Remover coluna antiga e renomear a nova
ALTER TABLE public.profiles DROP COLUMN role;
ALTER TABLE public.profiles RENAME COLUMN employee_role TO role;

-- Criar função para verificar roles específicos
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.employee_role)
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
  SELECT public.has_role(_user_id, 'ceo'::public.employee_role)
$$;

-- Atualizar configurações do sistema para incluir roles disponíveis
INSERT INTO system_settings (key, value, description) VALUES
('available_roles', '{"ceo": "CEO - Acesso Total", "office": "Escritório - Produtos e Estoque", "marketing": "Marketing - Clientes e Leads", "financial": "Financeiro - Relatórios", "operator": "Operador - Básico"}', 'Roles disponíveis no sistema')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;