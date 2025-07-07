import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

interface SystemSettingsProps {
  settings: Record<string, string>;
  onSettingsChange: (settings: Record<string, string>) => void;
  onSave: () => Promise<void>;
  onToggleSetting: (key: string, checked: boolean) => Promise<void>;
  saving: boolean;
}

export function SystemSettings({ settings, onSettingsChange, onSave, onToggleSetting, saving }: SystemSettingsProps) {
  const updateSetting = (key: string, value: string) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configure as preferências do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default_currency">Moeda Padrão</Label>
              <Input
                id="default_currency"
                value={settings.default_currency || 'BRL'}
                onChange={(e) => updateSetting('default_currency', e.target.value)}
                placeholder="BRL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Input
                id="timezone"
                value={settings.timezone || 'America/Sao_Paulo'}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                placeholder="America/Sao_Paulo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_min_stock">Estoque Mínimo Padrão</Label>
              <Input
                id="default_min_stock"
                type="number"
                value={settings.default_min_stock || '10'}
                onChange={(e) => updateSetting('default_min_stock', e.target.value)}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_max_stock">Estoque Máximo Padrão</Label>
              <Input
                id="default_max_stock"
                type="number"
                value={settings.default_max_stock || '100'}
                onChange={(e) => updateSetting('default_max_stock', e.target.value)}
                placeholder="100"
              />
            </div>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="notification_email">Email para Notificações</Label>
            <Input
              id="notification_email"
              type="email"
              value={settings.notification_email || ''}
              onChange={(e) => updateSetting('notification_email', e.target.value)}
              placeholder="notificacoes@empresa.com"
            />
          </div>
          <div className="lg:col-span-2">
            <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
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
              onCheckedChange={(checked) => onToggleSetting('low_stock_alert', checked)}
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
              onCheckedChange={(checked) => onToggleSetting('order_auto_numbering', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Fiscais</CardTitle>
          <CardDescription>
            Configure os dados fiscais da empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_cnpj">CNPJ da Empresa</Label>
              <Input
                id="company_cnpj"
                value={settings.company_cnpj || ''}
                onChange={(e) => updateSetting('company_cnpj', e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_ie">Inscrição Estadual</Label>
              <Input
                id="company_ie"
                value={settings.company_ie || ''}
                onChange={(e) => updateSetting('company_ie', e.target.value)}
                placeholder="000.000.000.000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_im">Inscrição Municipal</Label>
              <Input
                id="company_im"
                value={settings.company_im || ''}
                onChange={(e) => updateSetting('company_im', e.target.value)}
                placeholder="000000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax_regime">Regime Tributário</Label>
              <Select
                value={settings.tax_regime || 'simples'}
                onValueChange={(value) => updateSetting('tax_regime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples Nacional</SelectItem>
                  <SelectItem value="presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="real">Lucro Real</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoice_series">Série das Notas Fiscais</Label>
              <Input
                id="invoice_series"
                value={settings.invoice_series || '001'}
                onChange={(e) => updateSetting('invoice_series', e.target.value)}
                placeholder="001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default_tax_rate">Alíquota Padrão de Impostos (%)</Label>
              <Input
                id="default_tax_rate"
                type="number"
                step="0.01"
                value={settings.default_tax_rate || '0'}
                onChange={(e) => updateSetting('default_tax_rate', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoice_observations">Observações Padrão das Notas Fiscais</Label>
            <Textarea
              id="invoice_observations"
              value={settings.invoice_observations || ''}
              onChange={(e) => updateSetting('invoice_observations', e.target.value)}
              placeholder="Observações que aparecerão em todas as notas fiscais"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}