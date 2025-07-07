import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProductDetailsFieldsProps {
  formData: {
    description: string;
    details: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProductDetailsFields({ formData, onInputChange }: ProductDetailsFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Descrição breve do produto"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Detalhes</Label>
        <Textarea
          id="details"
          value={formData.details}
          onChange={(e) => onInputChange('details', e.target.value)}
          placeholder="Detalhes completos do produto"
          rows={3}
        />
      </div>
    </>
  );
}