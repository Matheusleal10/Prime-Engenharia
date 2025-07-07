import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
    </div>
  );
}