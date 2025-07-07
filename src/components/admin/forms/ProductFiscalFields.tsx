import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFiscalFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ProductFiscalFields({ formData, setFormData }: ProductFiscalFieldsProps) {
  const cstOptions = [
    { value: '00', label: '00 - Tributada integralmente' },
    { value: '10', label: '10 - Tributada e com cobrança do ICMS por substituição tributária' },
    { value: '20', label: '20 - Com redução de base de cálculo' },
    { value: '30', label: '30 - Isenta ou não tributada e com cobrança do ICMS por substituição tributária' },
    { value: '40', label: '40 - Isenta' },
    { value: '41', label: '41 - Não tributada' },
    { value: '50', label: '50 - Suspensão' },
    { value: '51', label: '51 - Diferimento' },
    { value: '60', label: '60 - ICMS cobrado anteriormente por substituição tributária' },
    { value: '70', label: '70 - Com redução de base de cálculo e cobrança do ICMS por substituição tributária' },
    { value: '90', label: '90 - Outras' }
  ];

  const originOptions = [
    { value: '0', label: '0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8' },
    { value: '1', label: '1 - Estrangeira - Importação direta, exceto a indicada no código 6' },
    { value: '2', label: '2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7' },
    { value: '3', label: '3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%' },
    { value: '4', label: '4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos' },
    { value: '5', label: '5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%' },
    { value: '6', label: '6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX' },
    { value: '7', label: '7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX' },
    { value: '8', label: '8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%' }
  ];

  const cfopOptions = [
    { value: '5101', label: '5101 - Venda de produção do estabelecimento' },
    { value: '5102', label: '5102 - Venda de mercadoria adquirida ou recebida de terceiros' },
    { value: '5103', label: '5103 - Venda de produção do estabelecimento, efetuada fora do estabelecimento' },
    { value: '5104', label: '5104 - Venda de mercadoria adquirida ou recebida de terceiros, efetuada fora do estabelecimento' },
    { value: '5109', label: '5109 - Venda de produção do estabelecimento, não tributada pelo ICMS' },
    { value: '5110', label: '5110 - Venda de mercadoria adquirida ou recebida de terceiros, não tributada pelo ICMS' },
    { value: '5116', label: '5116 - Venda de produção do estabelecimento originada de encomenda para entrega futura' },
    { value: '5117', label: '5117 - Venda de mercadoria adquirida ou recebida de terceiros, originada de encomenda para entrega futura' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Fiscais</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ncm">NCM *</Label>
          <Input
            id="ncm"
            value={formData.ncm || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              const formatted = value.replace(/(\d{4})(\d{4})/, '$1.$2');
              setFormData({ ...formData, ncm: formatted });
            }}
            placeholder="0000.00.00"
            maxLength={10}
          />
          <p className="text-xs text-muted-foreground">
            Nomenclatura Comum do Mercosul - obrigatório para NF-e
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cfop">CFOP *</Label>
          <Select
            value={formData.cfop || '5102'}
            onValueChange={(value) => setFormData({ ...formData, cfop: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cfopOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Origem *</Label>
          <Select
            value={formData.origin || '0'}
            onValueChange={(value) => setFormData({ ...formData, origin: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {originOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icms_cst">CST ICMS *</Label>
          <Select
            value={formData.icms_cst || '00'}
            onValueChange={(value) => setFormData({ ...formData, icms_cst: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cstOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icms_rate">Alíquota ICMS (%)</Label>
          <Input
            id="icms_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.icms_rate || ''}
            onChange={(e) => setFormData({ ...formData, icms_rate: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pis_rate">Alíquota PIS (%)</Label>
          <Input
            id="pis_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.pis_rate || ''}
            onChange={(e) => setFormData({ ...formData, pis_rate: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cofins_rate">Alíquota COFINS (%)</Label>
          <Input
            id="cofins_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.cofins_rate || ''}
            onChange={(e) => setFormData({ ...formData, cofins_rate: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}