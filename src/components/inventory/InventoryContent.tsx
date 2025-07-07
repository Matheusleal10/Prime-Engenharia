import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryFilters } from './InventoryFilters';
import { InventoryTable } from './InventoryTable';
import { getStockStatus } from '@/utils/inventoryUtils';
import type { InventoryItem } from '@/hooks/useInventory';

interface InventoryContentProps {
  inventory: InventoryItem[];
  loading: boolean;
}

export const InventoryContent = ({ inventory, loading }: InventoryContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle de Estoque</CardTitle>
        <CardDescription>
          Monitore os níveis de estoque de todos os produtos
        </CardDescription>
        <InventoryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
        />
      </CardHeader>
      <CardContent>
        <InventoryTable inventory={filteredInventory} loading={loading} />
      </CardContent>
    </Card>
  );
};