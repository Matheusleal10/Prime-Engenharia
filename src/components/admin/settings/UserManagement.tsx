import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Crown, Building2, Megaphone, Calculator, Wrench, Search, Edit } from 'lucide-react';
import { useUsers, User as UserType } from '@/hooks/useUsers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function UserManagement() {
  const { users, loading, updating, updateUserRole } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [newRole, setNewRole] = useState<UserType['role']>('operator');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const roleOptions = {
    ceo: { label: 'CEO - Acesso Total', icon: Crown, color: 'bg-purple-100 text-purple-800' },
    office: { label: 'Escritório - Produtos e Estoque', icon: Building2, color: 'bg-blue-100 text-blue-800' },
    marketing: { label: 'Marketing - Clientes e Leads', icon: Megaphone, color: 'bg-green-100 text-green-800' },
    financial: { label: 'Financeiro - Relatórios', icon: Calculator, color: 'bg-yellow-100 text-yellow-800' },
    operator: { label: 'Operador - Básico', icon: Wrench, color: 'bg-gray-100 text-gray-800' }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setNewRole(user.role);
    setIsDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingUser || !newRole) return;
    
    const success = await updateUserRole(editingUser.id, newRole);
    if (success) {
      setIsDialogOpen(false);
      setEditingUser(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando usuários...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Gerenciamento de Usuários</span>
        </CardTitle>
        <CardDescription>
          Gerencie os cargos e permissões dos usuários do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de Pesquisa */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const roleInfo = roleOptions[user.role];
                const RoleIcon = roleInfo.icon;
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || user.email}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={roleInfo.color}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleInfo.label.split(' - ')[0]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        disabled={updating}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum usuário encontrado.
          </div>
        )}

        {/* Dialog de Edição */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cargo do Usuário</DialogTitle>
              <DialogDescription>
                Altere o cargo de {editingUser?.full_name || editingUser?.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Novo Cargo</label>
                <Select value={newRole} onValueChange={(value) => setNewRole(value as UserType['role'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleOptions).map(([key, role]) => {
                      const RoleIcon = role.icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <RoleIcon className="h-4 w-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={updating}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdateRole}
                  disabled={updating || !newRole || newRole === editingUser?.role}
                >
                  {updating ? 'Atualizando...' : 'Atualizar Cargo'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}