
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  projectType: z.enum(["residential", "commercial"], {
    required_error: "Selecione o tipo de obra",
  }),
  quantity: z.string().min(1, "Informe a quantidade estimada"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Salvar lead no Supabase
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

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Seu orçamento foi registrado. Entraremos em contato em breve.",
      });

      reset();
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-prime-concrete-dark mb-6">
        Solicite seu Orçamento
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Seu nome completo"
            className="mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="seu@email.com"
            className="mt-1"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="(98) 99999-9999"
            className="mt-1"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="projectType">Tipo de Obra *</Label>
          <select
            id="projectType"
            {...register("projectType")}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-prime-green"
          >
            <option value="">Selecione o tipo</option>
            <option value="residential">Residencial</option>
            <option value="commercial">Comercial</option>
          </select>
          {errors.projectType && (
            <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="quantity">Quantidade Estimada de Tijolos *</Label>
          <Input
            id="quantity"
            {...register("quantity")}
            placeholder="Ex: 5.000 tijolos"
            className="mt-1"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message">Mensagem *</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Descreva detalhes do seu projeto..."
            rows={4}
            className="mt-1"
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-prime-green hover:bg-prime-green-light text-white py-3 text-lg font-semibold"
        >
          {isSubmitting ? "Enviando..." : "Solicitar Orçamento"}
        </Button>
      </form>

      <p className="text-sm text-gray-600 mt-4 text-center">
        * Campos obrigatórios. Seus dados estão seguros conosco.
      </p>
    </div>
  );
};

export default ContactForm;
