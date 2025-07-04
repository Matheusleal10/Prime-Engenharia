
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Como funciona o processo de compra e entrega?",
      answer: "Nosso processo é simples: 1) Entre em contato via WhatsApp ou formulário; 2) Nossa equipe faz o orçamento personalizado; 3) Confirmado o pedido, iniciamos a produção; 4) Entregamos no prazo combinado em sua obra. O prazo médio de entrega é de 7 a 15 dias úteis, dependendo da quantidade."
    },
    {
      question: "Quais são as principais vantagens técnicas dos tijolos ecológicos?",
      answer: "Os tijolos ecológicos da PRIME ENGENHARIA possuem resistência superior a 6 MPa, encaixe perfeito que reduz o uso de argamassa em até 30%, excelente isolamento térmico e acústico, e são 100% sustentáveis. Além disso, não precisam ser queimados, reduzindo significativamente o impacto ambiental."
    },
    {
      question: "Os produtos são realmente sustentáveis? Possuem certificações?",
      answer: "Sim! Nossos tijolos são produzidos com materiais reciclados e não passam por queima, reduzindo drasticamente a emissão de CO2. Utilizamos cimento, areia e materiais reciclados em nossa composição. Estamos em processo de certificação ambiental e seguimos todas as normas técnicas brasileiras (ABNT)."
    },
    {
      question: "Qual é a área de atendimento da PRIME ENGENHARIA?",
      answer: "Atendemos toda a região metropolitana de São Luís - MA, incluindo Raposa, Paço do Lumiar, São José de Ribamar e cidades vizinhas. Para regiões mais distantes, consulte disponibilidade e condições especiais de entrega através do nosso WhatsApp."
    },
    {
      question: "Qual é o prazo de entrega dos produtos?",
      answer: "O prazo padrão de entrega é de 7 a 15 dias úteis após a confirmação do pedido, dependendo da quantidade solicitada. Para pedidos urgentes, consulte disponibilidade de prazo reduzido. Sempre cumprimos os prazos acordados!"
    },
    {
      question: "Vocês oferecem assistência técnica e orientação para construção?",
      answer: "Sim! Nossa equipe técnica oferece orientação completa sobre o uso correto dos produtos, técnicas de assentamento e melhores práticas de construção. Também fornecemos suporte durante toda a obra para garantir o melhor resultado."
    },
    {
      question: "Como posso calcular a quantidade de tijolos necessária para minha obra?",
      answer: "Nossa equipe técnica faz o cálculo gratuito baseado no seu projeto. Basta enviar as medidas da obra (comprimento, largura e altura das paredes) via WhatsApp que calcularemos a quantidade exata necessária, incluindo uma margem de segurança."
    },
    {
      question: "Qual é a forma de pagamento aceita?",
      answer: "Aceitamos diversas formas de pagamento: dinheiro, PIX, cartão de débito/crédito, transferência bancária e parcelamento em até 6x sem juros (consulte condições). Para pedidos grandes, oferecemos condições especiais de pagamento."
    }
  ];

  return (
    <section id="faq" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-prime-concrete-dark mb-4">
            <span className="text-prime-green">Perguntas</span> <span className="text-prime-green">Frequentes</span>
          </h2>
          <p className="text-lg text-prime-concrete max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos produtos e serviços
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 px-6"
              >
                <AccordionTrigger className="text-left text-prime-concrete-dark hover:text-prime-green font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-prime-concrete leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-lg text-prime-concrete mb-6">
            Não encontrou sua dúvida? Fale conosco!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/559898708157?text=Olá! Tenho uma dúvida sobre os produtos da PRIME ENGENHARIA."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
              </svg>
              WhatsApp
            </a>
            <a 
              href="#contato"
              className="inline-flex items-center border-2 border-prime-green text-prime-green hover:bg-prime-green hover:text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Formulário de Contato
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
