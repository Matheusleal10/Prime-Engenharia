
const Products = () => {
  const otherProducts = [
    { name: "Blocos de concreto", icon: "🧱" },
    { name: "Pisos intertravados", icon: "🔲" },
    { name: "Meio-fio", icon: "🛤️" },
    { name: "Lajes e vigotas", icon: "🏗️" },
    { name: "Anéis", icon: "⭕" },
    { name: "Pré-moldados", icon: "🏭" }
  ];

  return (
    <section id="produtos" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-prime-concrete-dark mb-4">
            Nossos <span className="text-prime-green">Produtos</span>
          </h2>
          <p className="text-lg text-prime-concrete max-w-2xl mx-auto">
            Soluções completas em pré-moldados para sua construção
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

              <div className="space-y-4 mb-8">
                <h4 className="text-xl font-semibold text-prime-concrete-dark mb-4">Benefícios:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Encaixe perfeito</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Menor uso de cimento</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Maior resistência</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                    <span className="text-prime-concrete">Menor custo final</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-semibold text-prime-concrete-dark mb-4">Aplicações:</h4>
                <p className="text-prime-concrete">
                  Muros, casas, fachadas e projetos sustentáveis.
                </p>
              </div>

              <a 
                href="#contato"
                className="inline-flex items-center bg-prime-green hover:bg-prime-green-light text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Solicitar orçamento
              </a>
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
            Outros Produtos
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherProducts.map((product, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2">{product.icon}</div>
                <p className="text-sm font-medium text-prime-concrete-dark">{product.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
