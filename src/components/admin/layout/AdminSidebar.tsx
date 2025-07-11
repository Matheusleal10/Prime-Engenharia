import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  ShoppingCart,
  FileText,
  BarChart3,
  Warehouse,
  DollarSign,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  BookOpen
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Clientes",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Marketing",
    url: "/admin/marketing",
    icon: Megaphone,
  },
  {
    title: "Produtos",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Categorias",
    url: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Pedidos",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Notas Fiscais",
    url: "/admin/invoices",
    icon: FileText,
  },
  {
    title: "Estoque",
    url: "/admin/inventory",
    icon: Warehouse,
  },
  {
    title: "Financeiro",
    url: "/admin/financial",
    icon: DollarSign,
  },
  {
    title: "Fornecedores",
    url: "/admin/suppliers",
    icon: Truck,
  },
  {
    title: "Relatórios",
    url: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Guia de Uso",
    url: "/admin/guide",
    icon: BookOpen,
  },
  {
    title: "Configurações",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const { userProfile, canAccessRoute } = useAuth();

  // Definir quais itens cada role pode acessar
  const getMenuItemsByRole = () => {
    const role = userProfile?.role;
    
    switch (role) {
      case 'ceo':
        return menuItems; // CEO vê tudo
      case 'office':
        return menuItems.filter(item => 
          ['Dashboard', 'Produtos', 'Categorias', 'Estoque', 'Configurações'].includes(item.title)
        );
      case 'marketing':
        return menuItems.filter(item => 
          ['Dashboard', 'Clientes', 'Marketing', 'Configurações'].includes(item.title)
        );
      case 'financial':
        return menuItems.filter(item => 
          ['Dashboard', 'Financeiro', 'Relatórios', 'Configurações'].includes(item.title)
        );
      case 'operator':
        return menuItems.filter(item => 
          ['Dashboard', 'Pedidos', 'Produtos', 'Configurações'].includes(item.title)
        );
      default:
        return [menuItems[0]]; // Apenas Dashboard se role não definido
    }
  };

  const visibleMenuItems = getMenuItemsByRole();

  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (active: boolean) =>
    active 
      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
      : "hover:bg-accent hover:text-accent-foreground";

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className={collapsed && !isMobile ? "w-14" : "w-64"}>
      <SidebarContent>
        {/* Logo & Toggle */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {(!collapsed || isMobile) ? (
              <div className="flex items-center">
                <span className="font-bold text-lg">PRIME ERP</span>
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="font-bold text-sm">PE</span>
              </div>
            )}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className="h-8 w-8 p-0"
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{(!collapsed || isMobile) && "Navegação"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.end}
                      onClick={handleNavClick}
                      className={({ isActive }) => getNavClasses(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      {(!collapsed || isMobile) && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}