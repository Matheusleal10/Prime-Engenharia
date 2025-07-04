
import React from 'react';

export const EmailJSConfig = {
  // Replace these with your actual EmailJS credentials
  SERVICE_ID: 'your_service_id',
  TEMPLATE_ID: 'your_template_id', 
  PUBLIC_KEY: 'your_public_key',
};

// Email template should include these variables:
// {{from_name}} - Nome do cliente
// {{from_email}} - Email do cliente  
// {{phone}} - Telefone
// {{project_type}} - Tipo de obra
// {{quantity}} - Quantidade de tijolos
// {{message}} - Mensagem
// {{whatsapp_link}} - Link para WhatsApp
// {{reply_to}} - Email para resposta

export const EmailTemplate = `
Novo Lead da Prime Engenharia

Nome: {{from_name}}
Email: {{from_email}}
Telefone: {{phone}}
Tipo de Obra: {{project_type}}
Quantidade: {{quantity}}

Mensagem:
{{message}}

Para entrar em contato via WhatsApp, clique aqui:
{{whatsapp_link}}
`;

export default EmailJSConfig;
