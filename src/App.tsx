import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/admin/RoleProtectedRoute";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { DebugLogs } from "@/components/DebugLogs";
import { SystemHealthMonitor } from "@/components/SystemHealthMonitor";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";
import Marketing from "./pages/admin/Marketing";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Invoices from "./pages/admin/Invoices";
import Inventory from "./pages/admin/Inventory";
import Financial from "./pages/admin/Financial";
import Suppliers from "./pages/admin/Suppliers";
import Reports from "./pages/admin/Reports";
import Guide from "./pages/admin/Guide";
import Settings from "./pages/admin/Settings";
import CustomerPortal from "./pages/CustomerPortal";

const queryClient = new QueryClient();

const App = () => {
  usePerformanceMonitor();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <DebugLogs enabled={process.env.NODE_ENV === 'development'} />
            <Toaster />
            <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/customer-portal" element={<CustomerPortal />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'marketing']}>
                  <Customers />
                </RoleProtectedRoute>
              } />
              <Route path="marketing" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'marketing']}>
                  <Marketing />
                </RoleProtectedRoute>
              } />
              <Route path="products" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'office', 'operator']}>
                  <Products />
                </RoleProtectedRoute>
              } />
              <Route path="categories" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'office']}>
                  <Categories />
                </RoleProtectedRoute>
              } />
              <Route path="orders" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'operator']}>
                  <Orders />
                </RoleProtectedRoute>
              } />
              <Route path="invoices" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'financial']}>
                  <Invoices />
                </RoleProtectedRoute>
              } />
              <Route path="inventory" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'office']}>
                  <Inventory />
                </RoleProtectedRoute>
              } />
              <Route path="financial" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'financial']}>
                  <Financial />
                </RoleProtectedRoute>
              } />
              <Route path="suppliers" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'office']}>
                  <Suppliers />
                </RoleProtectedRoute>
              } />
              <Route path="reports" element={
                <RoleProtectedRoute allowedRoles={['ceo', 'financial']}>
                  <Reports />
                </RoleProtectedRoute>
              } />
              <Route path="guide" element={<Guide />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <SystemHealthMonitor />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
