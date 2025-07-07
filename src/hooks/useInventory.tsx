import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock_quantity: number;
  min_stock: number;
  max_stock: number;
  location: string;
  price: number;
  cost_price: number;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, category, stock_quantity, min_stock, max_stock, location, price, cost_price')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar estoque",
        description: "Não foi possível carregar o inventário.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    fetchInventory
  };
};