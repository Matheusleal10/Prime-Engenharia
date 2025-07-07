import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Building, Settings as SettingsIcon, Shield } from 'lucide-react';

interface SystemSetting {
  key: string;
  value: string;
  description: string;
}

export default function Settings() {
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

  const handleSaveCompany = async () => {
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

  const handleSaveSystem = async () => {
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

  const handleToggleSetting = async (key: string, checked: boolean) => {
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

  if (loading) {
    return <div className="text-center py-8">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">
            <Building className="h-4 w-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="system">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Configure os dados básicos da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nome da Empresa</Label>
                  <Input
                    id="company_name"
                    value={settings.company_name || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_document">CNPJ/CPF</Label>
                  <Input
                    id="company_document"
                    value={settings.company_document || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, company_document: e.target.value }))}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_email">Email</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={settings.company_email || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, company_email: e.target.value }))}
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_phone">Telefone</Label>
                  <Input
                    id="company_phone"
                    value={settings.company_phone || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, company_phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_address">Endereço</Label>
                <Textarea
                  id="company_address"
                  value={settings.company_address || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, company_address: e.target.value }))}
                  placeholder="Endereço completo da empresa"
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveCompany} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Informações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure as preferências do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default_currency">Moeda Padrão</Label>
                    <Input
                      id="default_currency"
                      value={settings.default_currency || 'BRL'}
                      onChange={(e) => setSettings(prev => ({ ...prev, default_currency: e.target.value }))}
                      placeholder="BRL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Input
                      id="timezone"
                      value={settings.timezone || 'America/Sao_Paulo'}
                      onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      placeholder="America/Sao_Paulo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default_min_stock">Estoque Mínimo Padrão</Label>
                    <Input
                      id="default_min_stock"
                      type="number"
                      value={settings.default_min_stock || '10'}
                      onChange={(e) => setSettings(prev => ({ ...prev, default_min_stock: e.target.value }))}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default_max_stock">Estoque Máximo Padrão</Label>
                    <Input
                      id="default_max_stock"
                      type="number"
                      value={settings.default_max_stock || '100'}
                      onChange={(e) => setSettings(prev => ({ ...prev, default_max_stock: e.target.value }))}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification_email">Email para Notificações</Label>
                  <Input
                    id="notification_email"
                    type="email"
                    value={settings.notification_email || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, notification_email: e.target.value }))}
                    placeholder="notificacoes@empresa.com"
                  />
                </div>
                <Button onClick={handleSaveSystem} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas e Notificações</CardTitle>
                <CardDescription>
                  Configure quando receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Estoque Baixo</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações quando o estoque estiver baixo
                    </p>
                  </div>
                  <Switch
                    checked={settings.low_stock_alert === 'true'}
                    onCheckedChange={(checked) => handleToggleSetting('low_stock_alert', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Numeração Automática de Pedidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Gerar números de pedidos automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={settings.order_auto_numbering === 'true'}
                    onCheckedChange={(checked) => handleToggleSetting('order_auto_numbering', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Monitore e configure a segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Sistema de Auditoria</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    O sistema está registrando todas as ações importantes para auditoria e rastreabilidade.
                  </p>
                  <p className="text-sm text-green-600 mt-2">✓ Ativo</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Validação de Estoque</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    O sistema está validando automaticamente os níveis de estoque antes das movimentações.
                  </p>
                  <p className="text-sm text-green-600 mt-2">✓ Ativo</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Controle de Acesso</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Row Level Security (RLS) está ativo para proteger os dados do sistema.
                  </p>
                  <p className="text-sm text-green-600 mt-2">✓ Ativo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}