import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  itemId: string;
  itemName: string;
  tableName: 'products' | 'customers' | 'suppliers' | 'orders' | 'financial_transactions';
  itemType: string;
}

export function DeleteDialog({ open, onOpenChange, onSuccess, itemId, itemName, tableName, itemType }: DeleteDialogProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      toast({
        title: `${itemType} excluído`,
        description: `${itemName} foi excluído com sucesso.`,
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: `Não foi possível excluir ${itemName}.`,
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir "{itemName}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}