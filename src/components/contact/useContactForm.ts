import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { contactFormSchema, ContactFormData } from './contactFormSchema';
import { sanitizeInput, isValidEmail, createAuditLog } from '@/utils/securityUtils';

export const useContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const formatWhatsAppMessage = (data: ContactFormData) => {
    const projectTypeText = data.projectType === 'residential' ? 'Residencial' : 'Comercial';
    const date = new Date().toLocaleString('pt-BR');
    
    // Sanitize all data for WhatsApp message
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      quantity: sanitizeInput(data.quantity),
      message: sanitizeInput(data.message)
    };
    
    return `🏗️ *Nova Solicitação de Orçamento - Prime Engenharia*

📋 *Dados do Cliente:*
👤 Nome: ${sanitizedData.name}
📧 Email: ${sanitizedData.email}
📱 Telefone: ${sanitizedData.phone}

🏢 *Detalhes do Projeto:*
🏠 Tipo de Obra: ${projectTypeText}
🧱 Quantidade Estimada: ${sanitizedData.quantity}

💬 *Mensagem:*
${sanitizedData.message}

⏰ *Data da Solicitação:* ${date}

---
*Solicitação enviada através do site da Prime Engenharia*`;
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Validate email format
      if (!isValidEmail(data.email)) {
        throw new Error('Formato de email inválido');
      }

      // Sanitize all inputs with length limits
      const sanitizedData = {
        name: sanitizeInput(data.name).substring(0, 100),
        email: sanitizeInput(data.email).substring(0, 100),
        phone: sanitizeInput(data.phone).substring(0, 20),
        project_type: data.projectType, // This is from a select, so it's safe
        quantity: sanitizeInput(data.quantity).substring(0, 50),
        message: sanitizeInput(data.message).substring(0, 1000)
      };

      // Create audit log
      createAuditLog({
        action: 'lead_form_submission',
        details: {
          email: sanitizedData.email,
          projectType: sanitizedData.project_type
        }
      });

      // 1. Salvar lead no Supabase
      const { error } = await supabase
        .from('leads')
        .insert([sanitizedData] as any, { returning: 'minimal' } as any);
      if (error) {
        throw error;
      }

      // 2. Enviar notificações por email
      try {
        await supabase.functions.invoke('send-lead-notifications', {
          body: {
            ...sanitizedData
          }
        });
      } catch (emailError) {
        console.error('Error sending notifications:', emailError);
        // Continue mesmo se o email falhar
      }

      // 3. Redirecionar para WhatsApp com mensagem formatada
      const whatsappMessage = formatWhatsAppMessage(data);
      const whatsappNumber = '5598982350011'; // Número comercial atualizado para orçamentos
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Solicitação enviada! ✅",
        description: "Você será redirecionado para o WhatsApp para continuar a conversa!",
      });

      form.reset();
    } catch (error: any) {
      console.error('Error saving lead:', error);
      
      // Create audit log for errors
      createAuditLog({
        action: 'lead_form_error',
        details: {
          error: error.message,
          email: data.email
        }
      });

      toast({
        title: "Erro ao enviar solicitação",
        description: sanitizeInput(error.message || "Tente novamente ou entre em contato pelo WhatsApp."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};