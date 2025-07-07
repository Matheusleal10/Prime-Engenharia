-- Criar função para CEOs alterarem roles de outros usuários
CREATE OR REPLACE FUNCTION public.update_user_role(_target_user_id uuid, _new_role public.employee_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Verificar se quem está executando é CEO
  IF NOT public.is_admin(auth.uid()) THEN
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
$$;

-- Criar função para listar todos os usuários (apenas para CEOs)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role public.employee_role,
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Verificar se quem está executando é CEO
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Apenas CEOs podem visualizar todos os usuários';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;