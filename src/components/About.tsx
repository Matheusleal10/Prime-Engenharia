
const About = () => {
  return (
    <section id="sobre" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="mb-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-prime-green">
                Sobre a PRIME ENGENHARIA
              </h2>
            </div>
            
            <p className="text-lg text-prime-concrete leading-relaxed mb-6">
              Com anos de experiência no mercado de pré-moldados, a PRIME ENGENHARIA oferece 
              qualidade, inovação e sustentabilidade.
            </p>
            
            <p className="text-lg text-prime-concrete leading-relaxed mb-8">
              Fomos os primeiros a fabricar o <strong className="text-prime-green">Tijolo Ecológico</strong> no 
              Maranhão, promovendo construções eficientes, econômicas e responsáveis com o meio ambiente.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-prime-green/5 rounded-lg">
                <h3 className="text-2xl font-bold text-prime-green mb-2">15+</h3>
                <p className="text-sm text-prime-concrete">Anos de experiência</p>
              </div>
              <div className="text-center p-4 bg-prime-orange/5 rounded-lg">
                <h3 className="text-2xl font-bold text-prime-orange mb-2">1°</h3>
                <p className="text-sm text-prime-concrete">Pioneiros em MA</p>
              </div>
            </div>
          </div>

          <div className="animate-slide-up">
            <div className="relative bg-gray-50 rounded-2xl shadow-2xl h-96 overflow-hidden">
              <img 
                src="/lovable-uploads/f2c71910-3c12-4f27-95ad-af066f1ebfc3.png" 
                alt="PRIME ENGENHARIA Escritório"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
