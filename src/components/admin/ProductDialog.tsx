import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSKU } from '@/hooks/useSKU';
import { RefreshCw } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  details: string;
  category: string;
  price: string;
  cost_price: string;
  sku: string;
  stock_quantity: string;
  min_stock: string;
  max_stock: string;
  location: string;
  unit: string;
  is_active: boolean;
  is_featured: boolean;
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editProduct?: any;
}

export function ProductDialog({ open, onOpenChange, onSuccess, editProduct }: ProductDialogProps) {
  const { toast } = useToast();
  const { generateSKU, validateSKU, getSKUSettings, loading: skuLoading } = useSKU();
  const [loading, setLoading] = useState(false);
  const [skuError, setSkuError] = useState('');
  const [autoGenerateSKU, setAutoGenerateSKU] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>({
    name: editProduct?.name || '',
    description: editProduct?.description || '',
    details: editProduct?.details || '',
    category: editProduct?.category || 'outros',
    price: editProduct?.price?.toString() || '',
    cost_price: editProduct?.cost_price?.toString() || '',
    sku: editProduct?.sku || '',
    stock_quantity: editProduct?.stock_quantity?.toString() || '0',
    min_stock: editProduct?.min_stock?.toString() || '0',
    max_stock: editProduct?.max_stock?.toString() || '0',
    location: editProduct?.location || '',
    unit: editProduct?.unit || 'unidade',
    is_active: editProduct?.is_active ?? true,
    is_featured: editProduct?.is_featured ?? false,
  });

  // Carregar configurações iniciais
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSKUSettings();
      setAutoGenerateSKU(settings.sku_auto_generate === 'true');
    };
    loadSettings();
  }, []);

  // Gerar SKU automaticamente quando categoria mudar (apenas para novos produtos)
  useEffect(() => {
    if (!editProduct && autoGenerateSKU && formData.category && !formData.sku) {
      handleGenerateSKU();
    }
  }, [formData.category, autoGenerateSKU]);

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validar SKU em tempo real
    if (field === 'sku' && typeof value === 'string') {
      validateSKUField(value);
    }
  };

  const validateSKUField = async (sku: string) => {
    if (!sku.trim()) {
      setSkuError('');
      return;
    }

    const isValid = await validateSKU(sku, editProduct?.id);
    if (!isValid) {
      setSkuError('Este SKU já está em uso por outro produto');
    } else {
      setSkuError('');
    }
  };

  const handleGenerateSKU = async () => {
    if (!formData.category) {
      toast({
        title: "Selecione uma categoria",
        description: "É necessário selecionar uma categoria para gerar o SKU.",
        variant: "destructive"
      });
      return;
    }

    const newSKU = await generateSKU(formData.category);
    if (newSKU) {
      setFormData(prev => ({ ...prev, sku: newSKU }));
      setSkuError('');
      toast({
        title: "SKU gerado",
        description: `Novo SKU: ${newSKU}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e descrição são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validar SKU se fornecido
    if (formData.sku && formData.sku.trim()) {
      const isSkuValid = await validateSKU(formData.sku, editProduct?.id);
      if (!isSkuValid) {
        toast({
          title: "SKU inválido",
          description: "Este SKU já está em uso por outro produto.",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        details: formData.details,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        sku: formData.sku || null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        min_stock: parseInt(formData.min_stock) || 0,
        max_stock: parseInt(formData.max_stock) || 0,
        location: formData.location || null,
        unit: formData.unit,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        icon: 'Package', // Default icon
      };

      if (editProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editProduct.id);
        
        if (error) throw error;
        toast({ title: "Produto atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        toast({ title: "Produto criado com sucesso!" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>
            {editProduct ? 'Edite as informações do produto' : 'Cadastre um novo produto no sistema'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                  onClick={handleGenerateSKU}
                  disabled={skuLoading || !formData.category}
                  className="h-6 text-xs"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${skuLoading ? 'animate-spin' : ''}`} />
                  Gerar
                </Button>
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição breve do produto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Detalhes</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder="Detalhes completos do produto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
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
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
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
                onChange={(e) => handleInputChange('cost_price', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Estoque Atual</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock">Estoque Mínimo</Label>
              <Input
                id="min_stock"
                type="number"
                value={formData.min_stock}
                onChange={(e) => handleInputChange('min_stock', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_stock">Estoque Máximo</Label>
              <Input
                id="max_stock"
                type="number"
                value={formData.max_stock}
                onChange={(e) => handleInputChange('max_stock', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ex: Estante A-1, Setor 2"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Produto Ativo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Produto Destacado</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : editProduct ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}