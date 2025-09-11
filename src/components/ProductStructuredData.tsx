import { useEffect } from 'react';

interface ProductData {
  slug: string;
  name: string;
  title: string;
  description: string;
  content: string;
  image: string;
}

interface ProductStructuredDataProps {
  product: ProductData;
}

const ProductStructuredData = ({ product }: ProductStructuredDataProps) => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://primeengenharia.lovable.app/#organization",
          "name": "Prime Engenharia",
          "alternateName": "PRIME ENGENHARIA",
          "description": "Pioneira na produção de tijolos ecológicos e materiais sustentáveis para construção civil em São Luís - MA",
          "url": "https://primeengenharia.lovable.app/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://primeengenharia.lovable.app/lovable-uploads/78ee719a-012e-4248-9651-263c2ae10be1.png"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+55-98-98765-4321",
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
            "https://wa.me/5598987654321"
          ]
        },
        {
          "@type": "LocalBusiness",
          "@id": "https://primeengenharia.lovable.app/#localbusiness",
          "name": "Prime Engenharia",
          "image": "https://primeengenharia.lovable.app/lovable-uploads/78ee719a-012e-4248-9651-263c2ae10be1.png",
          "telephone": "+55-98-98765-4321",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua da Engenharia, 123",
            "addressLocality": "São Luís",
            "addressRegion": "MA",
            "postalCode": "65000-000",
            "addressCountry": "BR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -2.5307,
            "longitude": -44.2969
          },
          "url": "https://primeengenharia.lovable.app/",
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "18:00"
          },
          "priceRange": "$$",
          "servesCuisine": "Materiais de Construção",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Produtos Prime Engenharia",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": product.name,
                  "description": product.description,
                  "image": `https://primeengenharia.lovable.app${product.image}`
                }
              }
            ]
          }
        },
        {
          "@type": "Product",
          "@id": `https://primeengenharia.lovable.app/${product.slug}#product`,
          "name": product.name,
          "description": product.description,
          "image": `https://primeengenharia.lovable.app${product.image}`,
          "brand": {
            "@type": "Brand",
            "name": "Prime Engenharia"
          },
          "manufacturer": {
            "@type": "Organization",
            "name": "Prime Engenharia"
          },
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "BRL",
            "seller": {
              "@type": "Organization",
              "name": "Prime Engenharia"
            }
          },
          "category": "Materiais de Construção",
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Localização",
              "value": "São Luís - MA"
            },
            {
              "@type": "PropertyValue",
              "name": "Sustentabilidade",
              "value": "Produto Ecológico"
            }
          ]
        },
        {
          "@type": "WebPage",
          "@id": `https://primeengenharia.lovable.app/${product.slug}#webpage`,
          "url": `https://primeengenharia.lovable.app/${product.slug}`,
          "name": product.title,
          "description": product.description,
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://primeengenharia.lovable.app/#website"
          },
          "about": {
            "@id": `https://primeengenharia.lovable.app/${product.slug}#product`
          },
          "mainEntity": {
            "@id": `https://primeengenharia.lovable.app/${product.slug}#product`
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Início",
              "item": "https://primeengenharia.lovable.app/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Produtos",
              "item": "https://primeengenharia.lovable.app/#produtos"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": product.name,
              "item": `https://primeengenharia.lovable.app/${product.slug}`
            }
          ]
        }
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]#product-structured-data');
    
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('id', 'product-structured-data');
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const existingScript = document.querySelector('#product-structured-data');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [product]);

  return null;
};

export default ProductStructuredData;