import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackRoute?: string;
}

export function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackRoute = '/admin' 
}: RoleProtectedRouteProps) {
  const { userProfile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/admin/login" replace />;
  }

  const hasAccess = allowedRoles.includes(userProfile.role) || userProfile.role === 'ceo';

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Lock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta área do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Seu perfil atual: <strong className="capitalize">{userProfile.role}</strong>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.history.back()}
              >
                Voltar
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => window.location.href = fallbackRoute}
              >
                Ir ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}