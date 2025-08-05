import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { contactFormSchema, ContactFormData } from './contactFormSchema';

export const useContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const formatWhatsAppMessage = (data: ContactFormData) => {
    const projectTypeText = data.projectType === 'residential' ? 'Residencial' : 'Comercial';
    const date = new Date().toLocaleString('pt-BR');
    
    return `🏗️ *Nova Solicitação de Orçamento - Prime Engenharia*

📋 *Dados do Cliente:*
👤 Nome: ${data.name}
📧 Email: ${data.email}
📱 Telefone: ${data.phone}

🏢 *Detalhes do Projeto:*
🏠 Tipo de Obra: ${projectTypeText}
🧱 Quantidade Estimada: ${data.quantity}

💬 *Mensagem:*
${data.message}

⏰ *Data da Solicitação:* ${date}

---
*Solicitação enviada através do site da Prime Engenharia*`;
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Salvar lead no Supabase
      const { data: leadData, error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          project_type: data.projectType,
          quantity: data.quantity,
          message: data.message
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 2. Enviar notificações por email
      try {
        await supabase.functions.invoke('send-lead-notifications', {
          body: {
            leadId: leadData.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            project_type: data.projectType,
            quantity: data.quantity,
            message: data.message
          }
        });
      } catch (emailError) {
        console.error('Error sending notifications:', emailError);
        // Continue mesmo se o email falhar
      }

      // 3. Redirecionar para WhatsApp com mensagem formatada
      const whatsappMessage = formatWhatsAppMessage(data);
      const whatsappNumber = '5598883500011'; // Número comercial para orçamentos
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Solicitação enviada! ✅",
        description: "Você será redirecionado para o WhatsApp para continuar a conversa!",
      });

      form.reset();
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Erro ao enviar solicitação",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
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