import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadEmailRequest {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  quantity: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, projectType, quantity, message }: LeadEmailRequest = await req.json();

    console.log("Processing lead email for:", name, email);

    // Formatação de dados para melhor apresentação
    const projectTypeLabel = projectType === 'residential' ? 'Residencial' : 'Comercial';
    const currentDate = new Date().toLocaleDateString('pt-BR');

    // 1. Email de notificação para a empresa (você)
    const adminEmailResponse = await resend.emails.send({
      from: "PRIME ENGENHARIA <noreply@primeeng.com.br>",
      to: ["faleconosco@primeeng.com.br"],
      subject: `🚀 Novo Orçamento Solicitado - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PRIME ENGENHARIA</h1>
            <p style="color: #e0f2e7; margin: 5px 0 0 0;">Novo Orçamento Solicitado</p>
          </div>
          
          <div style="padding: 30px; background-color: white; margin: 20px;">
            <h2 style="color: #16a34a; margin-bottom: 20px;">📋 Detalhes do Lead</h2>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #334155; margin-top: 0;">👤 Dados Pessoais</h3>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #16a34a;">${email}</a></p>
              <p><strong>Telefone:</strong> <a href="tel:${phone}" style="color: #16a34a;">${phone}</a></p>
            </div>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #334155; margin-top: 0;">🏗️ Detalhes do Projeto</h3>
              <p><strong>Tipo de Obra:</strong> ${projectTypeLabel}</p>
              <p><strong>Quantidade Estimada:</strong> ${quantity}</p>
              <p><strong>Data da Solicitação:</strong> ${currentDate}</p>
            </div>
            
            <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: #334155; margin-top: 0;">💬 Mensagem</h3>
              <p style="line-height: 1.6;">${message}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="https://wa.me/55${phone.replace(/\D/g, '')}" 
                 style="background-color: #22c55e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">
                📱 Chamar no WhatsApp
              </a>
              <a href="mailto:${email}" 
                 style="background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                ✉️ Responder por Email
              </a>
            </div>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b;">
            <p style="margin: 0;">PRIME ENGENHARIA - Tijolos Ecológicos</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">São Luís - MA | primeeng.com.br</p>
          </div>
        </div>
      `,
    });

    // 2. Email de confirmação para o cliente
    const clientEmailResponse = await resend.emails.send({
      from: "PRIME ENGENHARIA <noreply@primeeng.com.br>",
      to: [email],
      subject: `✅ Orçamento Recebido - PRIME ENGENHARIA`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PRIME ENGENHARIA</h1>
            <p style="color: #e0f2e7; margin: 5px 0 0 0;">Tijolos Ecológicos Sustentáveis</p>
          </div>
          
          <div style="padding: 30px; background-color: white; margin: 20px;">
            <h2 style="color: #16a34a; margin-bottom: 20px;">Olá, ${name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #334155;">
              Recebemos sua solicitação de orçamento para <strong>${projectTypeLabel}</strong> 
              e ficamos muito felizes com seu interesse em nossos tijolos ecológicos!
            </p>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
              <h3 style="color: #16a34a; margin-top: 0;">📋 Resumo da sua solicitação:</h3>
              <p><strong>Tipo de Obra:</strong> ${projectTypeLabel}</p>
              <p><strong>Quantidade:</strong> ${quantity}</p>
              <p><strong>Data:</strong> ${currentDate}</p>
            </div>
            
            <h3 style="color: #16a34a;">⏰ Próximos Passos:</h3>
            <ul style="color: #334155; line-height: 1.8;">
              <li>Nossa equipe analisará suas necessidades</li>
              <li>Entraremos em contato em até <strong>24 horas</strong></li>
              <li>Elaboraremos um orçamento personalizado</li>
              <li>Agendaremos uma visita técnica (se necessário)</li>
            </ul>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #16a34a; margin-top: 0;">🌱 Por que escolher nossos tijolos ecológicos?</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>✅ Economia de até 30% no cimento</div>
                <div>✅ Resistência superior a 6 MPa</div>
                <div>✅ Isolamento térmico e acústico</div>
                <div>✅ 100% sustentável</div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wa.me/5598999999999?text=Olá! Acabei de solicitar um orçamento pelo site e gostaria de conversar." 
                 style="background-color: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                💬 Conversar no WhatsApp
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 30px;">
              Tem alguma dúvida? Entre em contato conosco:<br>
              📞 (98) 99999-9999 | ✉️ faleconosco@primeeng.com.br
            </p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b;">
            <p style="margin: 0;">PRIME ENGENHARIA - Pioneiros em Tijolos Ecológicos no Maranhão</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">São Luís - MA | primeeng.com.br</p>
          </div>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);
    console.log("Client email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmailId: adminEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lead-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);