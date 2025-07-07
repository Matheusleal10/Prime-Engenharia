import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';

interface ProductBasicFieldsProps {
  formData: {
    name: string;
    sku: string;
  };
  skuError: string;
  skuLoading: boolean;
  autoGenerateSKU: boolean;
  editProduct?: any;
  onInputChange: (field: string, value: string) => void;
  onGenerateSKU: () => void;
}

export function ProductBasicFields({
  formData,
  skuError,
  skuLoading,
  autoGenerateSKU,
  editProduct,
  onInputChange,
  onGenerateSKU
}: ProductBasicFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Nome do produto"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sku" className="flex items-center justify-between">
          SKU
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onGenerateSKU}
            disabled={skuLoading}
            className="h-6 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${skuLoading ? 'animate-spin' : ''}`} />
            Gerar
          </Button>
        </Label>
        <Input
          id="sku"
          value={formData.sku}
          onChange={(e) => onInputChange('sku', e.target.value)}
          placeholder="Código SKU será gerado automaticamente"
          className={skuError ? 'border-destructive' : ''}
        />
        {skuError && (
          <p className="text-sm text-destructive">{skuError}</p>
        )}
        {autoGenerateSKU && !editProduct && (
          <p className="text-xs text-muted-foreground">
            SKU será gerado automaticamente baseado na categoria
          </p>
        )}
      </div>
    </div>
  );
}