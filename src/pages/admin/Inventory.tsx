import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InventoryMovementDialog } from '@/components/admin/InventoryMovementDialog';
import { InventoryStats } from '@/components/inventory/InventoryStats';
import { InventoryContent } from '@/components/inventory/InventoryContent';
import { useInventory } from '@/hooks/useInventory';

export default function Inventory() {
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const { inventory, loading, fetchInventory } = useInventory();

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

      <InventoryStats inventory={inventory} />
      <InventoryContent inventory={inventory} loading={loading} />

      <InventoryMovementDialog
        open={movementDialogOpen}
        onOpenChange={setMovementDialogOpen}
        onSuccess={fetchInventory}
        products={inventory.map(item => ({ id: item.id, name: item.name }))}
      />
    </div>
  );
}