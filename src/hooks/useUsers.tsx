import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'ceo' | 'office' | 'marketing' | 'financial' | 'operator';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const fetchUsers = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: User['role']) => {
    setUpdating(true);
    try {
      const { error } = await supabase.rpc('update_user_role', {
        _target_user_id: userId,
        _new_role: newRole
      });

      if (error) throw error;

      // Atualizar a lista local
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole, updated_at: new Date().toISOString() }
          : user
      ));

      toast({
        title: "Cargo atualizado",
        description: "O cargo do usuário foi alterado com sucesso."
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar cargo",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin]);

  return {
    users,
    loading,
    updating,
    fetchUsers,
    updateUserRole
  };
}