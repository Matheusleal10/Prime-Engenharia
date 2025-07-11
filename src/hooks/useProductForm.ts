import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSKU } from '@/hooks/useSKU';

interface ProductFormData {
  name: string;
  description: string;
  details: string;
  category_id: string;
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
  // Campos fiscais
  ncm: string;
  cfop: string;
  icms_cst: string;
  icms_rate: number;
  pis_rate: number;
  cofins_rate: number;
  origin: string;
}

interface UseProductFormProps {
  editProduct?: any;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useProductForm({ editProduct, onSuccess, onOpenChange }: UseProductFormProps) {
  const { toast } = useToast();
  const { generateSKU, validateSKU, getSKUSettings, loading: skuLoading } = useSKU();
  const [loading, setLoading] = useState(false);
  const [skuError, setSkuError] = useState('');
  const [autoGenerateSKU, setAutoGenerateSKU] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>({
    name: editProduct?.name || '',
    description: editProduct?.description || '',
    details: editProduct?.details || '',
    category_id: editProduct?.category_id || '',
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
    // Campos fiscais
    ncm: editProduct?.ncm || '00000000',
    cfop: editProduct?.cfop || '5102',
    icms_cst: editProduct?.icms_cst || '00',
    icms_rate: editProduct?.icms_rate || 0,
    pis_rate: editProduct?.pis_rate || 0,
    cofins_rate: editProduct?.cofins_rate || 0,
    origin: editProduct?.origin || '0'
  });

  // Load initial settings
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSKUSettings();
      setAutoGenerateSKU(settings.sku_auto_generate === 'true');
    };
    loadSettings();
  }, []);

  // Auto-generate SKU when category changes (only for new products)
  useEffect(() => {
    if (!editProduct && autoGenerateSKU && formData.category_id && !formData.sku) {
      handleGenerateSKU();
    }
  }, [formData.category_id, autoGenerateSKU]);

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time SKU validation
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
    if (!formData.category_id) {
      toast({
        title: "Selecione uma categoria",
        description: "É necessário selecionar uma categoria para gerar o SKU.",
        variant: "destructive"
      });
      return;
    }

    const newSKU = await generateSKU(formData.category_id);
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

    // Validate SKU if provided
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
        category_id: formData.category_id || null,
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
        // Campos fiscais
        ncm: formData.ncm || '00000000',
        cfop: formData.cfop || '5102',
        icms_cst: formData.icms_cst || '00',
        icms_rate: formData.icms_rate || 0,
        pis_rate: formData.pis_rate || 0,
        cofins_rate: formData.cofins_rate || 0,
        origin: formData.origin || '0'
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

  return {
    formData,
    loading,
    skuError,
    skuLoading,
    autoGenerateSKU,
    editProduct,
    handleInputChange,
    handleGenerateSKU,
    handleSubmit
  };
}