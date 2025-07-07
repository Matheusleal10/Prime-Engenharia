-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);

-- Create policies for company logo uploads
CREATE POLICY "Company logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload company logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update company logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete company logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

-- Add company logo URL and additional company information to system settings
INSERT INTO system_settings (key, value, description) VALUES 
('company_logo_url', '', 'URL da logo da empresa'),
('company_cnpj', '', 'CNPJ da empresa'),
('company_ie', '', 'Inscrição Estadual da empresa'),
('company_im', '', 'Inscrição Municipal da empresa'),
('company_website', '', 'Website da empresa'),
('company_bank_name', '', 'Nome do banco'),
('company_bank_agency', '', 'Agência bancária'),
('company_bank_account', '', 'Conta bancária'),
('company_bank_pix', '', 'Chave PIX')
ON CONFLICT (key) DO NOTHING;