import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface CompanySettingsProps {
  settings: Record<string, string>;
  onSettingsChange: (settings: Record<string, string>) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export function CompanySettings({ settings, onSettingsChange, onSave, saving }: CompanySettingsProps) {
  const updateSetting = (key: string, value: string) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
        <CardDescription>
          Configure os dados básicos da sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Nome da Empresa</Label>
            <Input
              id="company_name"
              value={settings.company_name || ''}
              onChange={(e) => updateSetting('company_name', e.target.value)}
              placeholder="Nome da sua empresa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_document">CNPJ/CPF</Label>
            <Input
              id="company_document"
              value={settings.company_document || ''}
              onChange={(e) => updateSetting('company_document', e.target.value)}
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_email">Email</Label>
            <Input
              id="company_email"
              type="email"
              value={settings.company_email || ''}
              onChange={(e) => updateSetting('company_email', e.target.value)}
              placeholder="contato@empresa.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_phone">Telefone</Label>
            <Input
              id="company_phone"
              value={settings.company_phone || ''}
              onChange={(e) => updateSetting('company_phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_address">Endereço</Label>
          <Textarea
            id="company_address"
            value={settings.company_address || ''}
            onChange={(e) => updateSetting('company_address', e.target.value)}
            placeholder="Endereço completo da empresa"
            rows={3}
          />
        </div>
        <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Informações'}
        </Button>
      </CardContent>
    </Card>
  );
}