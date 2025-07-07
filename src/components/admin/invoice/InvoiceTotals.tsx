interface InvoiceTotalsProps {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

export function InvoiceTotals({ subtotal, discountAmount, taxAmount, total }: InvoiceTotalsProps) {
  return (
    <div className="bg-muted p-4 rounded space-y-2">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>R$ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Desconto:</span>
        <span>R$ {discountAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Impostos:</span>
        <span>R$ {taxAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}