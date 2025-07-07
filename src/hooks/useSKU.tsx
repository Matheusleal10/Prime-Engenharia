import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSKU = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSKU = async (category: string): Promise<string | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('generate_sku', {
        product_category: category
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Erro ao gerar SKU",
        description: "Não foi possível gerar o código SKU automaticamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateSKU = async (sku: string, productId?: string): Promise<boolean> => {
    if (!sku.trim()) return true; // SKU vazio é válido
    
    try {
      const { data, error } = await supabase.rpc('validate_sku_uniqueness', {
        sku_code: sku,
        product_id: productId || null
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Erro ao validar SKU",
        description: "Não foi possível validar a unicidade do SKU.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getSKUSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .like('key', 'sku_%');

      if (error) throw error;
      
      const settings = data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>) || {};

      return settings;
    } catch (error) {
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações de SKU.",
        variant: "destructive"
      });
      return {};
    }
  };

  return {
    generateSKU,
    validateSKU,
    getSKUSettings,
    loading
  };
};