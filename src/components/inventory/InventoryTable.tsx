import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStockStatus, getCategoryLabel } from '@/utils/inventoryUtils';
import type { InventoryItem } from '@/hooks/useInventory';

interface InventoryTableProps {
  inventory: InventoryItem[];
  loading: boolean;
}

export const InventoryTable = ({ inventory, loading }: InventoryTableProps) => {
  if (loading) {
    return <div className="text-center py-8">Carregando estoque...</div>;
  }

  return (
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
        {inventory.map((item) => {
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
  );
};