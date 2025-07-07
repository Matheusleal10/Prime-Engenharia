import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface ProductCategoryFieldsProps {
  formData: {
    category_id: string;
    unit: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProductCategoryFields({ formData, onInputChange }: ProductCategoryFieldsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select 
          value={formData.category_id} 
          onValueChange={(value) => onInputChange('category_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={loading ? "Carregando..." : "Selecione uma categoria"} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.description || category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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