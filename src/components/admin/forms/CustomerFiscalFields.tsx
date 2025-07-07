import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerFiscalFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function CustomerFiscalFields({ formData, setFormData }: CustomerFiscalFieldsProps) {
  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const handleCpfCnpjChange = (value: string) => {
    const formatted = formatCpfCnpj(value);
    const numbers = value.replace(/\D/g, '');
    
    setFormData({
      ...formData,
      cpf_cnpj: formatted,
      customer_class: numbers.length <= 11 ? 'pessoa_fisica' : 'pessoa_juridica'
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados Fiscais</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cpf_cnpj">CPF/CNPJ *</Label>
          <Input
            id="cpf_cnpj"
            value={formData.cpf_cnpj || ''}
            onChange={(e) => handleCpfCnpjChange(e.target.value)}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            maxLength={18}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_class">Tipo de Pessoa</Label>
          <Select
            value={formData.customer_class || 'pessoa_fisica'}
            onValueChange={(value) => setFormData({ ...formData, customer_class: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
              <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.customer_class === 'pessoa_juridica' && (
          <div className="space-y-2">
            <Label htmlFor="ie">Inscrição Estadual</Label>
            <Input
              id="ie"
              value={formData.ie || ''}
              onChange={(e) => setFormData({ ...formData, ie: e.target.value })}
              placeholder="000.000.000.000"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Endereço Completo (Obrigatório para NF-e)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="full_address">Logradouro *</Label>
            <Input
              id="full_address"
              value={formData.full_address || formData.address || ''}
              onChange={(e) => setFormData({ ...formData, full_address: e.target.value, address: e.target.value })}
              placeholder="Rua, Avenida, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_number">Número *</Label>
            <Input
              id="address_number"
              value={formData.address_number || ''}
              onChange={(e) => setFormData({ ...formData, address_number: e.target.value })}
              placeholder="123"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address_complement">Complemento</Label>
            <Input
              id="address_complement"
              value={formData.address_complement || ''}
              onChange={(e) => setFormData({ ...formData, address_complement: e.target.value })}
              placeholder="Apto, Sala, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood || ''}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              placeholder="Centro"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="São Paulo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado *</Label>
            <Input
              id="state"
              value={formData.state || ''}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="SP"
              maxLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip_code">CEP *</Label>
            <Input
              id="zip_code"
              value={formData.zip_code || ''}
              onChange={(e) => {
                const formatted = e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
                setFormData({ ...formData, zip_code: formatted });
              }}
              placeholder="00000-000"
              maxLength={9}
            />
          </div>
        </div>
      </div>
    </div>
  );
}