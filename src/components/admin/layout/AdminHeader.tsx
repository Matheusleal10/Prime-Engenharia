import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export function AdminHeader() {
  const { user, userProfile, signOut } = useAuth();
  
  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      ceo: 'CEO',
      office: 'Escritório',
      marketing: 'Marketing',
      financial: 'Financeiro',
      operator: 'Operador'
    };
    return roleLabels[role] || role;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-background px-3 md:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <SidebarTrigger />
          <h1 className="text-lg md:text-xl font-semibold truncate">SISTEMA PRIME</h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Site Principal</span>
              <span className="md:hidden">Site</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline truncate max-w-32">{user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <div className="font-medium">{userProfile?.full_name || user?.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {getRoleLabel(userProfile?.role || 'operator')}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="sm:hidden">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Site Principal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}