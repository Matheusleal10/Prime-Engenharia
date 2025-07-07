import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Package, AlertTriangle, Filter, DollarSign, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InventoryMovementDialog } from '@/components/admin/InventoryMovementDialog';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock_quantity: number;
  min_stock: number;
  max_stock: number;
  location: string;
  price: number;
  cost_price: number;
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, category, stock_quantity, min_stock, max_stock, location, price, cost_price')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar estoque",
        description: "Não foi possível carregar o inventário.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (current: number, min: number, max: number) => {
    if (current <= min) return { status: 'low', label: 'Baixo', variant: 'destructive' as const };
    if (current >= max) return { status: 'high', label: 'Alto', variant: 'secondary' as const };
    return { status: 'normal', label: 'Normal', variant: 'default' as const };
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const stockStatus = getStockStatus(item.stock_quantity, item.min_stock, item.max_stock);
    const matchesStock = stockFilter === 'all' || stockStatus.status === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = inventory.filter(item => item.stock_quantity <= item.min_stock).length;
  
  const totalValue = inventory.reduce((sum, item) => {
    const value = (item.cost_price || 0) * item.stock_quantity;
    return sum + value;
  }, 0);
  
  const uniqueLocations = new Set(inventory.filter(item => item.location).map(item => item.location)).size;
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'estruturas-metalicas': 'Estruturas Metálicas',
      'blocos-tijolos': 'Blocos e Tijolos',
      'soldas-eletrodos': 'Soldas e Eletrodos',
      'parafusos-fixacao': 'Parafusos e Fixação',
      'tintas-acabamentos': 'Tintas e Acabamentos',
      'ferramentas-manuais': 'Ferramentas Manuais',
      'ferramentas-eletricas': 'Ferramentas Elétricas',
      'materiais-construcao': 'Materiais de Construção',
      'equipamentos-seguranca': 'Equipamentos de Segurança',
      'outros': 'Outros'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estoque</h1>
          <p className="text-muted-foreground">Controle de inventário e movimentações</p>
        </div>
        <Button onClick={() => setMovementDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Localizações</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueLocations}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Controle de Estoque</CardTitle>
          <CardDescription>
            Monitore os níveis de estoque de todos os produtos
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="estruturas-metalicas">Estruturas Metálicas</SelectItem>
                  <SelectItem value="blocos-tijolos">Blocos e Tijolos</SelectItem>
                  <SelectItem value="soldas-eletrodos">Soldas e Eletrodos</SelectItem>
                  <SelectItem value="parafusos-fixacao">Parafusos e Fixação</SelectItem>
                  <SelectItem value="tintas-acabamentos">Tintas e Acabamentos</SelectItem>
                  <SelectItem value="ferramentas-manuais">Ferramentas Manuais</SelectItem>
                  <SelectItem value="ferramentas-eletricas">Ferramentas Elétricas</SelectItem>
                  <SelectItem value="materiais-construcao">Materiais de Construção</SelectItem>
                  <SelectItem value="equipamentos-seguranca">Equipamentos de Segurança</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[150px]">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="low">Estoque Baixo</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Estoque Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando estoque...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Mín/Máx</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.stock_quantity, item.min_stock, item.max_stock);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku || '-'}</TableCell>
                      <TableCell>{getCategoryLabel(item.category)}</TableCell>
                      <TableCell>{item.location || '-'}</TableCell>
                      <TableCell>{item.stock_quantity}</TableCell>
                      <TableCell>{item.min_stock} / {item.max_stock}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <InventoryMovementDialog
        open={movementDialogOpen}
        onOpenChange={setMovementDialogOpen}
        onSuccess={fetchInventory}
        products={inventory.map(item => ({ id: item.id, name: item.name }))}
      />
    </div>
  );
}