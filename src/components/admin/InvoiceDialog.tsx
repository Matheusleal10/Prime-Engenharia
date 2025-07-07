import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { InvoiceFormHeader } from './invoice/InvoiceFormHeader';
import { InvoiceItemsList } from './invoice/InvoiceItemsList';
import { InvoiceTotals } from './invoice/InvoiceTotals';
import { InvoiceDialogProps } from './types/invoice';

export function InvoiceDialog({ open, onOpenChange, onSuccess, editInvoice }: InvoiceDialogProps) {
  const {
    loading,
    customers,
    orders,
    products,
    items,
    formData,
    setFormData,
    updateItem,
    addItem,
    removeItem,
    calculateTotals,
    initializeForm,
    submitForm
  } = useInvoiceForm(editInvoice);

  useEffect(() => {
    initializeForm(open);
  }, [open, editInvoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(onSuccess, onOpenChange);
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editInvoice ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
          </DialogTitle>
          <DialogDescription>
            {editInvoice ? 'Edite os dados da nota fiscal.' : 'Preencha os dados para criar uma nova nota fiscal.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InvoiceFormHeader
            formData={formData}
            setFormData={setFormData}
            customers={customers}
            orders={orders}
          />

          <InvoiceItemsList
            items={items}
            products={products}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
          />

          <InvoiceTotals
            subtotal={subtotal}
            discountAmount={discountAmount}
            taxAmount={taxAmount}
            total={total}
          />

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações adicionais"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : editInvoice ? 'Salvar Alterações' : 'Criar Nota Fiscal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}