import { useEffect } from 'react';

const StructuredData = () => {
  useEffect(() => {
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "PRIME ENGENHARIA",
      "description": "Pioneira na produção de tijolos ecológicos em São Luís - MA. Qualidade, sustentabilidade e inovação em pré-moldados.",
      "url": "https://primeengenharia.lovable.app",
      "logo": "https://primeengenharia.lovable.app/lovable-uploads/78ee719a-012e-4248-9651-263c2ae10be1.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-98-98235-0011",
        "contactType": "customer service",
        "availableLanguage": "Portuguese"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "São Luís",
        "addressRegion": "MA",
        "addressCountry": "BR"
      },
      "sameAs": [
        "https://wa.me/5598982350011"
      ],
      "foundingDate": "2009",
      "numberOfEmployees": "15+",
      "industry": "Construction Materials",
      "areaServed": {
        "@type": "State",
        "name": "Maranhão"
      }
    };

    const localBusinessData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "PRIME ENGENHARIA",
      "description": "Pioneira na produção de tijolos ecológicos em São Luís - MA",
      "image": "https://primeengenharia.lovable.app/lovable-uploads/78ee719a-012e-4248-9651-263c2ae10be1.png",
      "url": "https://primeengenharia.lovable.app",
      "telephone": "+55-98-98235-0011",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "São Luís",
        "addressRegion": "MA",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -2.5307,
        "longitude": -44.2969
      },
      "openingHours": "Mo-Fr 08:00-18:00",
      "priceRange": "$$",
      "acceptsReservations": false,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Produtos de Construção Sustentável",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Tijolo Ecológico"
            }
          }
        ]
      }
    };

    const productData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Tijolo Ecológico",
      "description": "Tijolos ecológicos de alta qualidade, sustentáveis e duráveis para construção civil",
      "brand": {
        "@type": "Brand",
        "name": "PRIME ENGENHARIA"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "PRIME ENGENHARIA"
      },
      "category": "Materiais de Construção",
      "material": "Solo-cimento",
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Sustentável",
          "value": "Sim"
        },
        {
          "@type": "PropertyValue",
          "name": "Resistência",
          "value": "Alta"
        }
      ]
    };

    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "O que são tijolos ecológicos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Os tijolos ecológicos são produzidos através da prensagem de uma mistura de solo, cimento e água, dispensando o processo de queima em fornos. Isso os torna mais sustentáveis e com menor impacto ambiental."
          }
        },
        {
          "@type": "Question",
          "name": "Qual a resistência dos tijolos ecológicos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Os tijolos ecológicos possuem alta resistência à compressão, sendo mais resistentes que os tijolos convencionais. Eles são ideais para construções residenciais e comerciais."
          }
        },
        {
          "@type": "Question",
          "name": "É possível fazer financiamento?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim, trabalhamos com diversas opções de pagamento e financiamento para facilitar a aquisição dos nossos produtos. Entre em contato para conhecer as condições."
          }
        }
      ]
    };

    // Combine all structured data
    const allStructuredData = {
      "@context": "https://schema.org",
      "@graph": [organizationData, localBusinessData, productData, faqData]
    };

    // Add structured data to head
    let script = document.querySelector('script[type="application/ld+json"]');
    
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(allStructuredData);
  }, []);

  return null;
};

export default StructuredData;