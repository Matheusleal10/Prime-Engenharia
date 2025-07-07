import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProductForm } from '@/hooks/useProductForm';
import { ProductBasicFields } from './forms/ProductBasicFields';
import { ProductDetailsFields } from './forms/ProductDetailsFields';
import { ProductCategoryFields } from './forms/ProductCategoryFields';
import { ProductPricingFields } from './forms/ProductPricingFields';
import { ProductStockFields } from './forms/ProductStockFields';
import { ProductOptionsFields } from './forms/ProductOptionsFields';
import { ProductFiscalFields } from './forms/ProductFiscalFields';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editProduct?: any;
}

export function ProductDialog({ open, onOpenChange, onSuccess, editProduct }: ProductDialogProps) {
  const {
    formData,
    loading,
    skuError,
    skuLoading,
    autoGenerateSKU,
    handleInputChange,
    handleGenerateSKU,
    handleSubmit
  } = useProductForm({ editProduct, onSuccess, onOpenChange });

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
          <ProductBasicFields
            formData={formData}
            skuError={skuError}
            skuLoading={skuLoading}
            autoGenerateSKU={autoGenerateSKU}
            editProduct={editProduct}
            onInputChange={handleInputChange}
            onGenerateSKU={handleGenerateSKU}
          />

          <ProductDetailsFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          <ProductCategoryFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          <ProductPricingFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          <ProductStockFields
            formData={formData}
            onInputChange={handleInputChange}
          />
          
          <ProductOptionsFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          <ProductFiscalFields 
            formData={formData} 
            setFormData={(data) => {
              Object.keys(data).forEach(key => {
                if (key in formData) {
                  handleInputChange(key as keyof typeof formData, data[key]);
                }
              });
            }} 
          />

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