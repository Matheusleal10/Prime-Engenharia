import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ProductOptionsFieldsProps {
  formData: {
    location: string;
    is_active: boolean;
    is_featured: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

export function ProductOptionsFields({ formData, onInputChange }: ProductOptionsFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="location">Localização</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          placeholder="Ex: Estante A-1, Setor 2"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => onInputChange('is_active', checked)}
          />
          <Label htmlFor="is_active">Produto Ativo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => onInputChange('is_featured', checked)}
          />
          <Label htmlFor="is_featured">Produto Destacado</Label>
        </div>
      </div>
    </>
  );
}