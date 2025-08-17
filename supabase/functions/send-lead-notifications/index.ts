import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  leadId?: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  quantity: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const data: LeadNotificationRequest = await req.json();
    
    // Initialize Supabase client with service role key for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First save the lead to database using service role (bypasses RLS)
    const { error: dbError } = await supabase
      .from('leads')
      .insert([data]);
      
    if (dbError) {
      console.error('Error saving lead to database:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save lead data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { leadId, name, email, phone, project_type, quantity, message } = data;

    // Send notification email to admin team
    const adminEmailResponse = await resend.emails.send({
      from: "Prime Engenharia <noreply@primeengenharia.com>",
      to: ["admin@primeengenharia.com"], // Replace with actual admin email
      subject: `🚀 Novo Lead Recebido - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Novo Lead Recebido!
          </h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">Dados do Cliente:</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Nome:</td>
                <td style="padding: 8px 0; color: #6b7280;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #6b7280;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Telefone:</td>
                <td style="padding: 8px 0; color: #6b7280;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Tipo de Obra:</td>
                <td style="padding: 8px 0; color: #6b7280;">${project_type === 'residential' ? 'Residencial' : 'Comercial'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Quantidade:</td>
                <td style="padding: 8px 0; color: #6b7280;">${quantity}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">Mensagem do Cliente:</h3>
            <p style="color: #78350f; line-height: 1.6;">${message}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://wa.me/55${phone.replace(/\D/g, '')}" 
               style="background-color: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              💬 Responder via WhatsApp
            </a>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${supabaseUrl}/admin/marketing" 
               style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              📊 Ver no CRM
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Lead ID: ${leadId ?? 'N/A'}<br>
            Recebido em: ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `,
    });

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Prime Engenharia <noreply@primeengenharia.com>",
      to: [email],
      subject: "Recebemos sua solicitação de orçamento! 🏗️",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Obrigado pelo seu interesse, ${name}!
          </h1>
          
          <p style="color: #374151; line-height: 1.6;">
            Recebemos sua solicitação de orçamento para o projeto <strong>${project_type === 'residential' ? 'residencial' : 'comercial'}</strong> 
            e nossa equipe entrará em contato em breve.
          </p>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="color: #1e40af; margin-top: 0;">Resumo da sua solicitação:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li><strong>Tipo de Obra:</strong> ${project_type === 'residential' ? 'Residencial' : 'Comercial'}</li>
              <li><strong>Quantidade Estimada:</strong> ${quantity}</li>
              <li><strong>Telefone de Contato:</strong> ${phone}</li>
            </ul>
          </div>

          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">⏰ Próximos Passos:</h3>
            <ol style="color: #15803d; line-height: 1.8;">
              <li>Nossa equipe analisará sua solicitação</li>
              <li>Entraremos em contato via WhatsApp em até 2 horas</li>
              <li>Agendaremos uma visita técnica (se necessário)</li>
              <li>Enviaremos seu orçamento personalizado</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; margin-bottom: 15px;">Tem alguma dúvida? Fale conosco:</p>
            <a href="https://wa.me/5598982350011" 
               style="background-color: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              💬 WhatsApp Direto
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Prime Engenharia</strong><br>
              Qualidade e confiança em cada projeto<br>
              📱 Atendimento: (98) 98235-0016 | Comercial: (98) 98835-0011 | 📧 contato@primeengenharia.com
            </p>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { adminEmailResponse, customerEmailResponse });

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse,
        customerEmail: customerEmailResponse 
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
    console.error("Error in send-lead-notifications function:", error);
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