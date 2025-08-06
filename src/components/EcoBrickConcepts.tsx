import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const EcoBrickConcepts = () => {
  const concepts = [
    {
      title: "Composição Sustentável",
      description: "Feito com cimento, areia e água, sem queima, reduzindo a emissão de gases poluentes em até 70%."
    },
    {
      title: "Eficiência Térmica",
      description: "Oferece excelente isolamento térmico, mantendo o ambiente mais fresco no verão e aquecido no inverno."
    },
    {
      title: "Economia de Material",
      description: "Sistema de encaixe dispensa o uso de massa de assentamento, economizando até 50% de materiais."
    },
    {
      title: "Rapidez na Construção",
      description: "Montagem simplificada acelera a obra em até 40%, reduzindo custos de mão de obra."
    }
  ];

  const carouselImages = [
    {
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
      alt: "Construção com tijolo ecológico - Estrutura moderna",
      caption: "Estruturas modernas e sustentáveis"
    },
    {
      src: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800&h=600&fit=crop",
      alt: "Obra em andamento com tijolo ecológico",
      caption: "Agilidade na construção"
    },
    {
      src: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=800&h=600&fit=crop",
      alt: "Arquitetura sustentável com tijolo ecológico",
      caption: "Design arquitetônico inovador"
    },
    {
      src: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
      alt: "Detalhes construtivos do tijolo ecológico",
      caption: "Precisão nos detalhes"
    },
    {
      src: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop",
      alt: "Acabamento com tijolo ecológico",
      caption: "Acabamento natural elegante"
    },
    {
      src: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=800&h=600&fit=crop",
      alt: "Construção sustentável completa",
      caption: "Resultado final sustentável"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-prime-green/5 to-prime-orange/5">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-5xl font-bold text-prime-green mb-6">
            Conheça o Tijolo Ecológico
          </h2>
          <p className="text-lg text-prime-concrete max-w-4xl mx-auto leading-relaxed">
            Uma revolução na construção civil que combina inovação, sustentabilidade e eficiência. 
            O tijolo ecológico da PRIME ENGENHARIA é produzido com tecnologia de ponta, 
            oferecendo qualidade superior e respeito ao meio ambiente.
          </p>
        </div>

        {/* Imagem e Conceitos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Imagem do Tijolo Ecológico */}
          <div className="animate-slide-up">
            <div className="relative rounded-2xl shadow-2xl h-96 overflow-hidden">
              <img 
                src="/lovable-uploads/53e1bebf-da3f-4251-9235-b8d02d67f457.png" 
                alt="Tijolo Ecológico PRIME ENGENHARIA"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-prime-green/10 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Conceitos */}
          <div className="animate-slide-up">
            <h3 className="text-2xl lg:text-3xl font-bold text-prime-concrete-dark mb-8">
              Conceitos Fundamentais
            </h3>
            <div className="space-y-6">
              {concepts.map((concept, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl hover:bg-white transition-colors duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-prime-green text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-prime-concrete-dark mb-2">
                      {concept.title}
                    </h4>
                    <p className="text-prime-concrete leading-relaxed">
                      {concept.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carrossel de Aplicações */}
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-prime-concrete-dark mb-4">
              Aplicações em Obras Reais
            </h3>
            <p className="text-lg text-prime-concrete max-w-3xl mx-auto">
              Veja como o tijolo ecológico transforma projetos arquitetônicos em construções 
              sustentáveis, eficientes e esteticamente superiores.
            </p>
          </div>

          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white font-semibold text-sm">
                              {image.caption}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/90 hover:bg-white" />
            <CarouselNext className="right-4 bg-white/90 hover:bg-white" />
          </Carousel>
        </div>

      </div>
    </section>
  );
};

export default EcoBrickConcepts;