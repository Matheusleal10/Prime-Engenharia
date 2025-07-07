import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sefazService } from '@/services/sefazService';
import { Building2, FileText, Shield, AlertTriangle } from 'lucide-react';

export function FiscalSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    company_cnpj: '',
    company_ie: '',
    company_im: '',
    company_regime_tributario: '3',
    sefaz_environment: 'homologacao',
    certificate_path: '',
    certificate_password: '',
    invoice_serie_nfe: '001',
    next_invoice_number_nfe: '1'
  });
  const [configValid, setConfigValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', Object.keys(settings));

      if (error) throw error;

      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value || '';
        return acc;
      }, {} as Record<string, string>);

      setSettings(prev => ({ ...prev, ...settingsMap }));
      validateConfiguration({ ...settings, ...settingsMap });
    } catch (error) {
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações fiscais.",
        variant: "destructive"
      });
    }
  };

  const validateConfiguration = async (config: typeof settings) => {
    try {
      const validation = await sefazService.validateConfig();
      setConfigValid(validation.valid);
      setValidationErrors(validation.errors);
    } catch (error) {
      setConfigValid(false);
      setValidationErrors(['Erro ao validar configuração']);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || '',
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('system_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      await validateConfiguration(settings);
      
      toast({
        title: "Configurações salvas",
        description: "Configurações fiscais atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setSettings(prev => ({ ...prev, company_cnpj: formatted }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados da Empresa
          </CardTitle>
          <CardDescription>
            Informações fiscais da empresa para emissão de NF-e
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_cnpj">CNPJ *</Label>
              <Input
                id="company_cnpj"
                value={settings.company_cnpj}
                onChange={(e) => handleCNPJChange(e.target.value)}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_ie">Inscrição Estadual *</Label>
              <Input
                id="company_ie"
                value={settings.company_ie}
                onChange={(e) => setSettings(prev => ({ ...prev, company_ie: e.target.value }))}
                placeholder="000.000.000.000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_im">Inscrição Municipal</Label>
              <Input
                id="company_im"
                value={settings.company_im}
                onChange={(e) => setSettings(prev => ({ ...prev, company_im: e.target.value }))}
                placeholder="000000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_regime_tributario">Regime Tributário</Label>
              <Select
                value={settings.company_regime_tributario}
                onValueChange={(value) => setSettings(prev => ({ ...prev, company_regime_tributario: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Simples Nacional</SelectItem>
                  <SelectItem value="2">Simples Nacional - Excesso</SelectItem>
                  <SelectItem value="3">Regime Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Certificado Digital
          </CardTitle>
          <CardDescription>
            Configurações do certificado digital para assinatura da NF-e
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certificate_path">Caminho do Certificado *</Label>
              <Input
                id="certificate_path"
                type="file"
                accept=".p12,.pfx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSettings(prev => ({ ...prev, certificate_path: file.name }));
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Arquivo .p12 ou .pfx do certificado digital
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate_password">Senha do Certificado *</Label>
              <Input
                id="certificate_password"
                type="password"
                value={settings.certificate_password}
                onChange={(e) => setSettings(prev => ({ ...prev, certificate_password: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configurações de NF-e
          </CardTitle>
          <CardDescription>
            Parâmetros para emissão de Notas Fiscais Eletrônicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sefaz_environment">Ambiente SEFAZ</Label>
              <Select
                value={settings.sefaz_environment}
                onValueChange={(value) => setSettings(prev => ({ ...prev, sefaz_environment: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homologacao">Homologação (Teste)</SelectItem>
                  <SelectItem value="producao">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_serie_nfe">Série da NF-e</Label>
              <Input
                id="invoice_serie_nfe"
                value={settings.invoice_serie_nfe}
                onChange={(e) => setSettings(prev => ({ ...prev, invoice_serie_nfe: e.target.value }))}
                placeholder="001"
                maxLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_invoice_number_nfe">Próximo Número</Label>
              <Input
                id="next_invoice_number_nfe"
                type="number"
                min="1"
                value={settings.next_invoice_number_nfe}
                onChange={(e) => setSettings(prev => ({ ...prev, next_invoice_number_nfe: e.target.value }))}
                placeholder="1"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Status da Configuração</h4>
            
            {configValid ? (
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Configuração válida para emissão de NF-e</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Configuração incompleta</span>
                </div>
                
                {validationErrors.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <p className="text-sm font-medium text-amber-800 mb-2">Problemas encontrados:</p>
                    <ul className="text-sm text-amber-700 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}