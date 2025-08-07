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
      src: "/lovable-uploads/27732a31-4255-434c-9f37-42d77049b0b2.png",
      alt: "Construção em andamento com tijolo ecológico",
      caption: "Eficiência na construção"
    },
    {
      src: "/lovable-uploads/a89c1d2b-5407-44df-9749-ee55768fbccf.png",
      alt: "Sala de estar moderna com parede de tijolo ecológico",
      caption: "Elegância em ambientes residenciais"
    },
    {
      src: "/lovable-uploads/23cfa301-6b01-4461-b5cc-3b73186f0e36.png",
      alt: "Estrutura em construção com tijolo ecológico",
      caption: "Precisão no acabamento"
    },
    {
      src: "/lovable-uploads/cc5947e6-c7e4-453d-94c2-57ef43ec269a.png",
      alt: "Ambiente aconchegante com tijolo ecológico",
      caption: "Conforto e estilo sustentável"
    },
    {
      src: "/lovable-uploads/4d9dcfca-38b0-4939-b755-c6cdd4f1b6d8.png",
      alt: "Construção residencial com tijolo ecológico",
      caption: "Estrutura sólida e eficiente"
    },
    {
      src: "/lovable-uploads/61be12da-ae64-4a1d-b54e-7c2eec53a435.png",
      alt: "Decoração sofisticada com tijolo ecológico",
      caption: "Sofisticação natural"
    },
    {
      src: "/lovable-uploads/3047a7fc-98f9-4987-899b-ffbbcecdf326.png",
      alt: "Design minimalista com tijolo ecológico",
      caption: "Minimalismo sustentável"
    },
    {
      src: "/lovable-uploads/7ee50644-397b-40a4-ab8c-1bed6915814f.png",
      alt: "Integração arquitetônica com tijolo ecológico",
      caption: "Integração perfeita dos ambientes"
    },
    {
      src: "/lovable-uploads/c507cb86-0946-46e9-b115-ee267cd6d8d9.png",
      alt: "Parede externa decorativa com tijolo ecológico",
      caption: "Versatilidade em fachadas"
    },
    {
      src: "/lovable-uploads/fe05a24a-6270-4e9c-b40c-9158052689ca.png",
      alt: "Arquitetura contemporânea com tijolo ecológico",
      caption: "Modernidade sustentável"
    },
    {
      src: "/lovable-uploads/86e6ec1b-79e0-4cb7-884a-3469f2ad7313.png",
      alt: "Banheiro moderno com tijolo ecológico",
      caption: "Aplicação em ambientes úmidos"
    },
    {
      src: "/lovable-uploads/eda99da4-871e-4b25-a4b1-200606578589.png",
      alt: "Sala de estar com tijolo ecológico",
      caption: "Ambientes acolhedores"
    },
    {
      src: "/lovable-uploads/f1c6e620-d537-4655-b783-a2b2635ebaa9.png",
      alt: "Quarto moderno com tijolo ecológico",
      caption: "Conforto e design industrial"
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
                    <div className="relative overflow-hidden rounded-lg group cursor-pointer">
                      <div className="aspect-square w-full">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white font-semibold text-sm drop-shadow-lg">
                            {image.caption}
                          </p>
                        </div>
                      </div>
                    </div>
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