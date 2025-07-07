import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductStockFieldsProps {
  formData: {
    stock_quantity: string;
    min_stock: string;
    max_stock: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProductStockFields({ formData, onInputChange }: ProductStockFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="stock_quantity">Estoque Atual</Label>
        <Input
          id="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={(e) => onInputChange('stock_quantity', e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="min_stock">Estoque Mínimo</Label>
        <Input
          id="min_stock"
          type="number"
          value={formData.min_stock}
          onChange={(e) => onInputChange('min_stock', e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max_stock">Estoque Máximo</Label>
        <Input
          id="max_stock"
          type="number"
          value={formData.max_stock}
          onChange={(e) => onInputChange('max_stock', e.target.value)}
          placeholder="0"
        />
      </div>
    </div>
  );
}