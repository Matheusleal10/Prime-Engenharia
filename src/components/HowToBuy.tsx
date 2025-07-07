const HowToBuy = () => {
  const steps = [
    {
      number: "1",
      title: "Escolha os produtos desejados",
      description: "Navegue por nosso catálogo e selecione os produtos que melhor atendem sua necessidade"
    },
    {
      number: "2", 
      title: "Solicite um orçamento pelo WhatsApp",
      description: "Entre em contato conosco através do WhatsApp para receber um orçamento personalizado"
    },
    {
      number: "3",
      title: "Combine a entrega e finalize a compra",
      description: "Acerte os detalhes da entrega e forme de pagamento diretamente com nossa equipe"
    }
  ];

  return (
    <section id="como-comprar" className="py-16 lg:py-24 bg-gradient-to-br from-prime-green to-prime-green-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Como Comprar
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Um processo simples e rápido para você adquirir nossos produtos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-prime-orange rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto shadow-lg">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-white/30 transform -translate-y-1/2"></div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">
                {step.title}
              </h3>
              
              <p className="text-white/80 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a 
            href="#vantagens" 
            className="inline-flex items-center bg-white hover:bg-gray-100 text-prime-green px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <svg className="mr-3 w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Ver as Vantagens
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowToBuy;
