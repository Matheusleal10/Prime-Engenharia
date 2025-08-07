import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const EcoBrickConcepts = () => {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

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
      src: "/lovable-uploads/b7411e99-7a1f-4103-b6ed-2fd1c93d10d5.png",
      alt: "Ambiente decorativo com tijolo ecológico",
      caption: "Decoração sofisticada e acolhedora"
    },
    {
      src: "/lovable-uploads/329aa2c5-fbed-4b44-b7e4-376a7c7189cf.png",
      alt: "Construção estrutural com tijolo ecológico",
      caption: "Construção sólida e durável"
    },
    {
      src: "/lovable-uploads/0da55251-b81f-4e23-8516-c20323877559.png",
      alt: "Casa moderna pronta com tijolo ecológico",
      caption: "Casa pronta com design contemporâneo"
    },
    {
      src: "/lovable-uploads/327ac52d-a7e3-4322-8795-fb5f3c34e28a.png",
      alt: "Escada decorativa com tijolo ecológico",
      caption: "Decoração elegante e funcional"
    },
    {
      src: "/lovable-uploads/3f9b2f9f-9ab3-427c-96fd-adb96230e710.png",
      alt: "Muro em construção com tijolo ecológico",
      caption: "Construção precisa e eficiente"
    },
    {
      src: "/lovable-uploads/087c2736-d128-4e63-b978-1630813f20fb.png",
      alt: "Residência finalizada com tijolo ecológico",
      caption: "Casa pronta com arquitetura moderna"
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

          <Carousel 
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
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