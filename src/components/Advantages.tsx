
const Advantages = () => {
  const advantages = [{
    icon: "♻️",
    title: "Sustentável", 
    description: "Reduz resíduos e uso de cimento, preservando o meio ambiente"
  }, {
    icon: "🧱",
    title: "Modular",
    description: "Fácil encaixe e agilidade na obra, economizando tempo"
  }, {
    icon: "🏠",
    title: "Estético",
    description: "Visual moderno e natural para suas construções"
  }, {
    icon: "🚚",
    title: "Entrega rápida",
    description: "Atendemos São Luís e região com agilidade"
  }];
  
  return (
    <section id="vantagens" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-prime-green mb-4">
            Por que escolher o Tijolo Ecológico da PRIME ENGENHARIA?
          </h2>
          <p className="text-lg text-prime-concrete max-w-3xl mx-auto"></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-prime-green/5 transition-colors animate-slide-up group hover:transform hover:scale-105 transition-transform duration-300" 
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-bold text-prime-concrete-dark mb-3">
                {advantage.title}
              </h3>
              <p className="text-prime-concrete leading-relaxed">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a href="#contato" className="inline-flex items-center bg-prime-orange hover:bg-prime-orange-light text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            Conheça nossos produtos
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
