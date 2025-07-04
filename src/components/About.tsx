
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
              Fomos os primeiros a fabricar o <strong className="text-prime-green">Tijolo Ecológico</strong> em 
              São Luís, promovendo construções eficientes, econômicas e responsáveis com o meio ambiente.
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
            <div className="relative">
              <img 
                src="/lovable-uploads/baa55910-9e15-4c81-9d3c-a4a309711581.png" 
                alt="Escritório PRIME ENGENHARIA"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-prime-green/20 to-transparent rounded-2xl flex items-center justify-center">
                <img 
                  src="/lovable-uploads/0b5e2834-14f7-48ac-9d10-1496398c9096.png" 
                  alt="PRIME ENGENHARIA Logo"
                  className="h-24 w-auto opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
