const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "Engenheiro Civil",
      project: "Residencial Vila Verde",
      quote: "Os tijolos ecológicos da PRIME ENGENHARIA superaram nossas expectativas. A qualidade é excepcional e o encaixe perfeito facilitou muito nossa obra.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Arquiteta",
      project: "Casa Sustentável",
      quote: "Trabalhar com os produtos da PRIME foi uma experiência incrível. Além da qualidade, o atendimento é diferenciado e sempre pontual nas entregas.",
      rating: 5
    },
    {
      name: "João Silva",
      role: "Construtor",
      project: "Muro Residencial",
      quote: "Economizei muito material e tempo usando os tijolos ecológicos. A resistência é comprovada e a aparência final ficou perfeita.",
      rating: 5
    },
    {
      name: "Ana Oliveira",
      role: "Proprietária",
      project: "Reforma Residencial",
      quote: "Escolhi a PRIME pela sustentabilidade, mas me surpreendi com a economia. Reduzi em 40% o custo da minha obra mantendo a qualidade.",
      rating: 5
    }
  ];

  return (
    <section id="depoimentos" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-prime-green mb-4 text-center">
            O que nossos Clientes dizem
          </h2>
          <p className="text-lg text-prime-concrete max-w-2xl mx-auto">
            Confira os depoimentos de quem já construiu com qualidade e sustentabilidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg 
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-prime-concrete text-center mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="text-center">
                <div className="w-12 h-12 bg-prime-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-prime-green font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h4 className="font-semibold text-prime-concrete-dark">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-prime-concrete">
                  {testimonial.role}
                </p>
                <p className="text-xs text-prime-green font-medium mt-1">
                  {testimonial.project}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-lg text-prime-concrete mb-6">
            Faça parte da nossa lista de clientes satisfeitos!
          </p>
          <a 
            href="#contato"
            className="inline-flex items-center bg-prime-orange hover:bg-prime-orange-light text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Solicitar Meu Orçamento
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
