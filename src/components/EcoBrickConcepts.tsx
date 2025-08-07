import React, { useRef } from "react";
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
      description: "É um material de construção fabricado com uma mistura de solo, cimento (em pequena proporção) e água, sem a necessidade de queima. Essa característica o diferencia dos tijolos convencionais, reduzindo o impacto ambiental através da diminuição da emissão de gases poluentes e do consumo de energia."
    },
    {
      title: "Eficiência térmica e acústica",
      description: "Por sua densidade e composição, o tijolo ecológico proporciona maior isolamento térmico, mantendo ambientes mais frescos no verão e aquecidos no inverno, o que reduz custos com energia elétrica. Também apresenta bom isolamento acústico, tornando o espaço mais silencioso e confortável."
    },
    {
      title: "Economia de Material",
      description: "Tijolo ecológico é um sistema de construção que dispensa o uso de alguns produtos da construção tradicional e a diminuição de outros como: ferro, areia, cimento, brita e outros, economizando em até 30% de material."
    },
    {
      title: "Rapidez e Eficiência",
      description: "Com o tijolo ecológico, sua construção avança até 40% mais rápido. Os blocos se encaixam com precisão, dispensam reboco pesado e agilizam toda a parte elétrica e hidráulica. Menos retrabalho, menos desperdício e mais obra entregue no prazo!"
    }
  ];

  const carouselImages = [
    {
      src: "/lovable-uploads/bc848687-2925-40da-9cfb-63c672d8eb3b.png",
      alt: "Muro construído com tijolo ecológico",
      caption: "Construção sólida e durável"
    },
    {
      src: "/lovable-uploads/44b95eb4-9bdc-43c5-b92e-4030d4d4cdaa.png",
      alt: "Interior moderno com parede de tijolo ecológico",
      caption: "Design contemporâneo e aconchegante"
    },
    {
      src: "/lovable-uploads/f1798e79-056b-492b-838c-94fe4a7cdf91.png",
      alt: "Casa moderna com tijolo ecológico",
      caption: "Arquitetura moderna e sustentável"
    },
    {
      src: "/lovable-uploads/80a92efe-cd0b-4f57-bfa6-bcd88b4137dc.png",
      alt: "Construção em andamento com tijolo ecológico",
      caption: "Eficiência na construção"
    },
    {
      src: "/lovable-uploads/c3af6a9a-8693-4032-952a-184e0c672624.png",
      alt: "Cozinha moderna com tijolo ecológico",
      caption: "Sofisticação em ambientes internos"
    },
    {
      src: "/lovable-uploads/42add67d-29f2-49c8-a270-585dc2684c70.png",
      alt: "Casa contemporânea com tijolo ecológico",
      caption: "Design arquitetônico avançado"
    },
    {
      src: "/lovable-uploads/0eb0163a-e0d1-4b85-a4c3-93c5bdcad767.png",
      alt: "Fundação residencial com tijolo ecológico",
      caption: "Base sólida para construção"
    },
    {
      src: "/lovable-uploads/bcab7693-7f71-4037-931e-59f96e17d70c.png",
      alt: "Escritório moderno com tijolo ecológico",
      caption: "Ambiente profissional e elegante"
    },
    {
      src: "/lovable-uploads/8f25d509-e90e-49df-81df-4579727d2dc4.png",
      alt: "Casa ecológica completa",
      caption: "Projeto finalizado com sustentabilidade"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-prime-green/5 to-prime-orange/5">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-5xl font-bold text-prime-green mb-6 text-center">
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