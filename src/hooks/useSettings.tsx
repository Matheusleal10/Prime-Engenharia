import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value, description');

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {} as Record<string, string>) || {};

      setSettings(settingsMap);
    } catch (error) {
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do sistema.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      throw error;
    }
  };

  const saveCompanySettings = async () => {
    setSaving(true);
    try {
      const companySettings = [
        'company_name', 'company_document', 'company_email', 
        'company_phone', 'company_address'
      ];

      for (const key of companySettings) {
        await updateSetting(key, settings[key] || '');
      }

      toast({
        title: "Configurações salvas",
        description: "As informações da empresa foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSystemSettings = async () => {
    setSaving(true);
    try {
      const systemSettings = [
        'default_currency', 'timezone', 'default_min_stock', 
        'default_max_stock', 'notification_email'
      ];

      for (const key of systemSettings) {
        await updateSetting(key, settings[key] || '');
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = async (key: string, checked: boolean) => {
    try {
      await updateSetting(key, checked.toString());
      toast({
        title: "Configuração atualizada",
        description: "A configuração foi alterada com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível alterar a configuração.",
        variant: "destructive"
      });
    }
  };

  return {
    settings,
    setSettings,
    loading,
    saving,
    saveCompanySettings,
    saveSystemSettings,
    toggleSetting
  };
}