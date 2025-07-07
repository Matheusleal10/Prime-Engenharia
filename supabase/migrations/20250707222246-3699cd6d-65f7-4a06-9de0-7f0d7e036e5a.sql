-- Adicionar configurações fiscais da empresa
INSERT INTO system_settings (key, value, description) VALUES
('company_cnpj', '', 'CNPJ da empresa para NF-e'),
('company_ie', '', 'Inscrição Estadual da empresa'),
('company_im', '', 'Inscrição Municipal da empresa'),
('company_regime_tributario', '3', 'Regime tributário (1-Simples Nacional, 2-Simples Nacional - excesso, 3-Regime Normal)'),
('sefaz_environment', 'homologacao', 'Ambiente SEFAZ (homologacao/producao)'),
('certificate_path', '', 'Caminho do certificado digital'),
('certificate_password', '', 'Senha do certificado digital'),
('invoice_serie_nfe', '001', 'Série da NF-e'),
('next_invoice_number_nfe', '1', 'Próximo número da NF-e')
ON CONFLICT (key) DO NOTHING;

-- Adicionar campos fiscais obrigatórios aos clientes
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS cpf_cnpj text,
ADD COLUMN IF NOT EXISTS ie text,
ADD COLUMN IF NOT EXISTS customer_class text DEFAULT 'pessoa_fisica',
ADD COLUMN IF NOT EXISTS full_address text,
ADD COLUMN IF NOT EXISTS address_number text,
ADD COLUMN IF NOT EXISTS address_complement text,
ADD COLUMN IF NOT EXISTS neighborhood text,
ADD COLUMN IF NOT EXISTS city_code text,
ADD COLUMN IF NOT EXISTS country_code text DEFAULT '1058';

-- Adicionar campos fiscais aos produtos
ALTER TABLE products
ADD COLUMN IF NOT EXISTS ncm text DEFAULT '00000000',
ADD COLUMN IF NOT EXISTS cfop text DEFAULT '5102',
ADD COLUMN IF NOT EXISTS icms_cst text DEFAULT '00',
ADD COLUMN IF NOT EXISTS icms_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS pis_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS cofins_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS origin text DEFAULT '0';

-- Adicionar campos de controle fiscal às notas fiscais
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS sefaz_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS sefaz_protocol text,
ADD COLUMN IF NOT EXISTS sefaz_authorization_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS sefaz_error_message text,
ADD COLUMN IF NOT EXISTS danfe_url text,
ADD COLUMN IF NOT EXISTS access_key text,
ADD COLUMN IF NOT EXISTS environment text DEFAULT 'homologacao';

-- Atualizar campos existentes se necessário
UPDATE invoices SET sefaz_status = 'pending' WHERE sefaz_status IS NULL;
UPDATE invoices SET environment = 'homologacao' WHERE environment IS NULL;