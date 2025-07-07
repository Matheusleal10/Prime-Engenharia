import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceItem, Product } from '@/components/admin/types/invoice';

interface InvoiceItemsListProps {
  items: InvoiceItem[];
  products: Product[];
  updateItem: (index: number, field: keyof InvoiceItem, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
}

export function InvoiceItemsList({ items, products, updateItem, addItem, removeItem }: InvoiceItemsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Itens da Nota Fiscal</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 border rounded">
            <div className="col-span-2">
              <Label className="text-xs">Produto</Label>
              <Select
                value={item.product_id}
                onValueChange={(value) => {
                  const product = products.find(p => p.id === value);
                  updateItem(index, 'product_id', value);
                  if (product) {
                    updateItem(index, 'description', product.name);
                    updateItem(index, 'unit_price', product.price || 0);
                  }
                }}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <Label className="text-xs">Descrição</Label>
              <Input
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="h-8"
                placeholder="Descrição"
              />
            </div>

            <div className="col-span-1">
              <Label className="text-xs">Qtd</Label>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                className="h-8"
                min="1"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-xs">Preço Unit.</Label>
              <Input
                type="number"
                step="0.01"
                value={item.unit_price}
                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                className="h-8"
              />
            </div>

            <div className="col-span-1">
              <Label className="text-xs">Desc. %</Label>
              <Input
                type="number"
                step="0.01"
                value={item.discount}
                onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                className="h-8"
                min="0"
                max="100"
              />
            </div>

            <div className="col-span-1">
              <Label className="text-xs">Taxa %</Label>
              <Input
                type="number"
                step="0.01"
                value={item.tax_rate}
                onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                className="h-8"
                min="0"
              />
            </div>

            <div className="col-span-1">
              <Label className="text-xs">Subtotal</Label>
              <Input
                value={item.subtotal.toFixed(2)}
                readOnly
                className="h-8 bg-muted"
              />
            </div>

            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}