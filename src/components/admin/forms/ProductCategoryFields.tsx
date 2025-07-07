import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductCategoryFieldsProps {
  formData: {
    category: string;
    unit: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProductCategoryFields({ formData, onInputChange }: ProductCategoryFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => onInputChange('category', e.target.value)}
          placeholder="Digite ou selecione uma categoria"
          list="categories-datalist"
        />
        <datalist id="categories-datalist">
          <option value="estruturas-metalicas">Estruturas Metálicas</option>
          <option value="blocos-tijolos">Blocos e Tijolos</option>
          <option value="soldas-eletrodos">Soldas e Eletrodos</option>
          <option value="parafusos-fixacao">Parafusos e Fixação</option>
          <option value="tintas-acabamentos">Tintas e Acabamentos</option>
          <option value="ferramentas-manuais">Ferramentas Manuais</option>
          <option value="ferramentas-eletricas">Ferramentas Elétricas</option>
          <option value="materiais-construcao">Materiais de Construção</option>
          <option value="equipamentos-seguranca">Equipamentos de Segurança</option>
          <option value="outros">Outros</option>
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="unit">Unidade</Label>
        <Select value={formData.unit} onValueChange={(value) => onInputChange('unit', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unidade">Unidade</SelectItem>
            <SelectItem value="metro">Metro</SelectItem>
            <SelectItem value="kg">Quilograma</SelectItem>
            <SelectItem value="litro">Litro</SelectItem>
            <SelectItem value="m2">Metro Quadrado</SelectItem>
            <SelectItem value="m3">Metro Cúbico</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}