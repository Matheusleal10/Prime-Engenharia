import { supabase } from '@/integrations/supabase/client';

export interface SefazConfig {
  cnpj: string;
  ie: string;
  regimeTributario: string;
  environment: 'homologacao' | 'producao';
  certificatePath: string;
  certificatePassword: string;
  serie: string;
}

export interface NFeProcotol {
  protocol: string;
  accessKey: string;
  authorizationDate: string;
  status: 'authorized' | 'rejected' | 'pending';
  errorMessage?: string;
}

class SefazService {
  private config: SefazConfig | null = null;

  async loadConfig(): Promise<SefazConfig> {
    if (this.config) return this.config;

    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', [
        'company_cnpj',
        'company_ie', 
        'company_regime_tributario',
        'sefaz_environment',
        'certificate_path',
        'certificate_password',
        'invoice_serie_nfe'
      ]);

    if (error) throw error;

    const configMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    this.config = {
      cnpj: configMap.company_cnpj || '',
      ie: configMap.company_ie || '',
      regimeTributario: configMap.company_regime_tributario || '3',
      environment: (configMap.sefaz_environment as 'homologacao' | 'producao') || 'homologacao',
      certificatePath: configMap.certificate_path || '',
      certificatePassword: configMap.certificate_password || '',
      serie: configMap.invoice_serie_nfe || '001'
    };

    return this.config;
  }

  async validateConfig(): Promise<{ valid: boolean; errors: string[] }> {
    const config = await this.loadConfig();
    const errors: string[] = [];

    if (!config.cnpj) errors.push('CNPJ da empresa não configurado');
    if (!config.ie) errors.push('Inscrição Estadual não configurada');
    if (!config.certificatePath) errors.push('Certificado digital não configurado');
    if (!config.certificatePassword) errors.push('Senha do certificado não configurada');

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async sendToSefaz(invoiceXml: string, invoiceId: string): Promise<NFeProcotol> {
    const config = await this.loadConfig();
    const validation = await this.validateConfig();

    if (!validation.valid) {
      throw new Error(`Configuração inválida: ${validation.errors.join(', ')}`);
    }

    try {
      // Atualizar status para processando
      await this.updateInvoiceStatus(invoiceId, 'processing');

      // TODO: Implementar integração real com SEFAZ
      // Por enquanto, simular resposta para demonstração
      if (config.environment === 'homologacao') {
        // Simular processo de homologação
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const protocol: NFeProcotol = {
          protocol: `${Date.now()}`,
          accessKey: this.generateAccessKey(config.serie),
          authorizationDate: new Date().toISOString(),
          status: 'authorized'
        };

        await this.updateInvoiceWithProtocol(invoiceId, protocol);
        return protocol;
      } else {
        throw new Error('Integração com ambiente de produção ainda não implementada');
      }
    } catch (error) {
      await this.updateInvoiceStatus(invoiceId, 'rejected', error.message);
      throw error;
    }
  }

  async consultarStatusNFe(accessKey: string): Promise<NFeProcotol> {
    const config = await this.loadConfig();
    
    // TODO: Implementar consulta real na SEFAZ
    // Por enquanto, retornar status mockado
    return {
      protocol: `PROT-${Date.now()}`,
      accessKey,
      authorizationDate: new Date().toISOString(),
      status: 'authorized'
    };
  }

  async cancelarNFe(accessKey: string, justification: string): Promise<boolean> {
    const config = await this.loadConfig();
    
    if (justification.length < 15) {
      throw new Error('Justificativa deve ter pelo menos 15 caracteres');
    }

    // TODO: Implementar cancelamento real na SEFAZ
    // Por enquanto, simular cancelamento
    return true;
  }

  private generateAccessKey(serie: string): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
    
    return `35${year}${month}00000000000000055${serie.padStart(3, '0')}000000001${randomNum}`;
  }

  private async updateInvoiceStatus(invoiceId: string, status: string, errorMessage?: string): Promise<void> {
    const updateData: any = { 
      sefaz_status: status,
      updated_at: new Date().toISOString()
    };

    if (errorMessage) {
      updateData.sefaz_error_message = errorMessage;
    }

    const { error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoiceId);

    if (error) throw error;
  }

  private async updateInvoiceWithProtocol(invoiceId: string, protocol: NFeProcotol): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .update({
        sefaz_status: protocol.status,
        sefaz_protocol: protocol.protocol,
        access_key: protocol.accessKey,
        sefaz_authorization_date: protocol.authorizationDate,
        sefaz_error_message: protocol.errorMessage || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId);

    if (error) throw error;
  }

  async generateDANFE(invoiceId: string): Promise<string> {
    // TODO: Implementar geração real do DANFE
    // Por enquanto, retornar URL mockada
    return `https://exemplo.com/danfe/${invoiceId}.pdf`;
  }
}

export const sefazService = new SefazService();