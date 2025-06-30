
const Products = () => {
  const otherProducts = [
    { 
      name: "Blocos de concreto", 
      icon: "🧱",
      description: "Blocos estruturais de alta resistência para construções sólidas e duráveis.",
      details: "Ideais para alvenaria estrutural, oferecendo resistência mecânica superior e durabilidade comprovada."
    },
    { 
      name: "Pisos intertravados", 
      icon: "🔲",
      description: "Pisos drenantes e antiderrapantes, ideais para calçadas e estacionamentos.",
      details: "Sistema de pavimentação sustentável com alta resistência ao tráfego e fácil manutenção."
    },
    { 
      name: "Meio-fio", 
      icon: "🛤️",
      description: "Peças padronizadas para delimitação de vias e organização urbana.",
      details: "Produzidos conforme normas ABNT, garantindo qualidade e padronização em projetos urbanos."
    },
    { 
      name: "Lajes e vigotas", 
      icon: "🏗️",
      description: "Sistema de lajes pré-moldadas para construções ágeis e econômicas.",
      details: "Solução completa para coberturas e entre-pisos com rapidez na execução e economia de materiais."
    },
    { 
      name: "Anéis", 
      icon: "⭕",
      description: "Anéis de concreto para poços, fossas e sistemas de drenagem.",
      details: "Peças circulares pré-moldadas com encaixe perfeito para sistemas de saneamento e drenagem."
    },
    { 
      name: "Pré-moldados", 
      icon: "🏭",
      description: "Diversas peças pré-moldadas sob medida para seu projeto específico.",
      details: "Soluções personalizadas em concreto pré-moldado para atender às necessidades específicas de cada projeto."
    }
  ];

  return (
    <section id="produtos" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-prime-concrete-dark mb-4">
            Nossos <span className="text-prime-green">Produtos</span>
          </h2>
          <p className="text-lg text-prime-concrete max-w-2xl mx-auto">
            Soluções completas em pré-moldados sustentáveis para sua construção
          </p>
        </div>

        {/* Tijolo Ecológico - Destaque */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-12 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center bg-prime-green/10 text-prime-green px-3 py-1 rounded-full text-sm font-medium mb-4">
                🌱 Produto Principal
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-prime-concrete-dark mb-6">
                Tijolo Ecológico
              </h3>

              <p className="text-lg text-prime-concrete mb-6">
                Nossos tijolos ecológicos são produzidos com materiais sustentáveis e tecnologia avançada, oferecendo resistência superior e impacto ambiental reduzido.
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="text-xl font-semibold text-prime-concrete-dark mb-4">Principais Benefícios:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Encaixe perfeito e preciso</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Economia de até 30% no cimento</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Resistência superior a 6 MPa</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Redução de 50% no custo final</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Isolamento térmico e acústico</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">100% sustentável e reciclável</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-semibold text-prime-concrete-dark mb-4">Aplicações Ideais:</h4>
                <p className="text-prime-concrete">
                  Construção de casas, muros, fachadas, divisórias internas e projetos sustentáveis de todos os portes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="#contato"
                  className="inline-flex items-center justify-center bg-prime-green hover:bg-prime-green-light text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Solicitar Orçamento
                </a>
                <a 
                  href="https://wa.me/5598999999999?text=Olá! Gostaria de saber mais sobre os tijolos ecológicos."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-prime-green text-prime-green hover:bg-prime-green hover:text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Saiba Mais no WhatsApp
                </a>
              </div>
            </div>

            <div className="relative">
              <img 
                src="/lovable-uploads/d4ca7e0c-6a7c-473b-b733-44282b4c965e.png" 
                alt="Tijolos Ecológicos PRIME ENGENHARIA"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-prime-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                Pioneiros em MA
              </div>
            </div>
          </div>
        </div>

        {/* Outros Produtos */}
        <div>
          <h3 className="text-2xl font-bold text-center text-prime-concrete-dark mb-8">
            Outros Produtos Disponíveis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProducts.map((product, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 text-center">{product.icon}</div>
                <h4 className="text-lg font-semibold text-prime-concrete-dark mb-3 text-center">
                  {product.name}
                </h4>
                <p className="text-sm text-prime-concrete text-center mb-3">
                  {product.description}
                </p>
                <p className="text-xs text-prime-concrete/80 text-center mb-4">
                  {product.details}
                </p>
                <div className="text-center">
                  <a 
                    href={`https://wa.me/5598999999999?text=Olá! Gostaria de saber mais sobre ${product.name.toLowerCase()}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-prime-green hover:text-prime-green-light font-medium text-sm inline-flex items-center"
                  >
                    Saiba Mais
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
