import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface CompanySettingsProps {
  settings: Record<string, string>;
  onSettingsChange: (settings: Record<string, string>) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export function CompanySettings({ settings, onSettingsChange, onSave, saving }: CompanySettingsProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();

  const updateSetting = (key: string, value: string) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(data.path);

      updateSetting('company_logo_url', publicUrl);
      
      toast({
        title: "Logo enviada com sucesso",
        description: "A logo da empresa foi atualizada."
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a logo.",
        variant: "destructive"
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    updateSetting('company_logo_url', '');
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
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Logo da Empresa</Label>
          <div className="flex items-center space-x-4">
            {settings.company_logo_url && (
              <div className="relative">
                <img 
                  src={settings.company_logo_url} 
                  alt="Logo da empresa" 
                  className="h-16 w-16 object-contain border rounded-md p-2"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeLogo}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploadingLogo}
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadingLogo ? 'Enviando...' : 'Enviar Logo'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Nome da Empresa</Label>
            <Input
              id="company_name"
              value={settings.company_name || ''}
              onChange={(e) => updateSetting('company_name', e.target.value)}
              placeholder="PRIME ENGENHARIA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_cnpj">CNPJ</Label>
            <Input
              id="company_cnpj"
              value={settings.company_cnpj || ''}
              onChange={(e) => updateSetting('company_cnpj', e.target.value)}
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
              placeholder="contato@primeengenharia.com.br"
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
              placeholder="000000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_address">Endereço</Label>
          <Textarea
            id="company_address"
            value={settings.company_address || ''}
            onChange={(e) => updateSetting('company_address', e.target.value)}
            placeholder="São Paulo, SP - Brasil"
            rows={3}
          />
        </div>

        {/* Banking Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Bancárias</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_bank_name">Nome do Banco</Label>
              <Input
                id="company_bank_name"
                value={settings.company_bank_name || ''}
                onChange={(e) => updateSetting('company_bank_name', e.target.value)}
                placeholder="Banco do Brasil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_bank_agency">Agência</Label>
              <Input
                id="company_bank_agency"
                value={settings.company_bank_agency || ''}
                onChange={(e) => updateSetting('company_bank_agency', e.target.value)}
                placeholder="1234-5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_bank_account">Conta</Label>
              <Input
                id="company_bank_account"
                value={settings.company_bank_account || ''}
                onChange={(e) => updateSetting('company_bank_account', e.target.value)}
                placeholder="12345-6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_bank_pix">PIX</Label>
              <Input
                id="company_bank_pix"
                value={settings.company_bank_pix || ''}
                onChange={(e) => updateSetting('company_bank_pix', e.target.value)}
                placeholder="contato@primeengenharia.com.br"
              />
            </div>
          </div>
        </div>
        <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Informações'}
        </Button>
      </CardContent>
    </Card>
  );
}