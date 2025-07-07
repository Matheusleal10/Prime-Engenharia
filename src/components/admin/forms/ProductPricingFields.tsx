import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductPricingFieldsProps {
  formData: {
    price: string;
    cost_price: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProductPricingFields({ formData, onInputChange }: ProductPricingFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="price">Preço de Venda</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => onInputChange('price', e.target.value)}
          placeholder="0.00"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cost_price">Preço de Custo</Label>
        <Input
          id="cost_price"
          type="number"
          step="0.01"
          value={formData.cost_price}
          onChange={(e) => onInputChange('cost_price', e.target.value)}
          placeholder="0.00"
        />
      </div>
    </div>
  );
}