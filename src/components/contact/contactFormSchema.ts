import * as z from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  projectType: z.enum(["residential", "commercial"], {
    required_error: "Selecione o tipo de obra",
  }),
  quantity: z.string().min(1, "Informe a quantidade estimada"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;