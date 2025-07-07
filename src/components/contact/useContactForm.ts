import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import emailjs from '@emailjs/browser';
import { contactFormSchema, ContactFormData } from './contactFormSchema';

export const useContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Salvar lead no Supabase
      const { error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          project_type: data.projectType,
          quantity: data.quantity,
          message: data.message
        });

      if (error) {
        throw error;
      }

      // 2. Enviar emails via EmailJS + Gmail
      try {
        const templateParams = {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone,
          project_type: data.projectType === 'residential' ? 'Residencial' : 'Comercial',
          quantity: data.quantity,
          message: data.message,
          date: new Date().toLocaleString('pt-BR'),
          to_email: 'faleconosco@primeeng.com.br',
        };

        await emailjs.send(
          'service_zmcuo68', // Service ID do EmailJS
          'template_v5cw98k', // Template ID do EmailJS
          templateParams,
          'aTYdCtniLrHdldjd5' // Public Key do EmailJS
        );

        console.log('Email enviado com sucesso via EmailJS + Gmail');
      } catch (emailError) {
        console.error('EmailJS failed:', emailError);
        // Continua mesmo se email falhar
      }

      toast({
        title: "Orçamento solicitado com sucesso! ✅",
        description: "Recebemos sua solicitação e enviaremos uma resposta em até 24h no seu email!",
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