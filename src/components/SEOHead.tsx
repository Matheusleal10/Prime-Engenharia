import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  structuredData?: object;
}

const SEOHead = ({
  title = "PRIME ENGENHARIA - Tijolos Ecológicos em São Luís - MA",
  description = "PRIME ENGENHARIA é pioneira na produção de tijolos ecológicos em São Luís - MA. Qualidade, sustentabilidade e inovação em pré-moldados.",
  keywords = "tijolos ecológicos, tijolo ecológico são luís, construção sustentável, pré-moldados, prime engenharia, tijolo prensado, construção civil maranhão, materiais sustentáveis, eco brick, construção verde",
  canonicalUrl = "https://primeengenharia.lovable.app/",
  ogTitle,
  ogDescription,
  ogImage = "https://primeengenharia.lovable.app/lovable-uploads/78ee719a-012e-4248-9651-263c2ae10be1.png",
  ogUrl,
  structuredData
}: SEOHeadProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update or create link tags
    const updateLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', 'PRIME ENGENHARIA');

    // Open Graph tags
    updateMeta('og:title', ogTitle || title, true);
    updateMeta('og:description', ogDescription || description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:url', ogUrl || canonicalUrl, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:site_name', 'PRIME ENGENHARIA', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', ogTitle || title);
    updateMeta('twitter:description', ogDescription || description);
    updateMeta('twitter:image', ogImage);

    // Canonical URL
    updateLink('canonical', canonicalUrl);

    // Structured Data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    }

    // Location meta tags for local SEO
    updateMeta('geo.region', 'BR-MA');
    updateMeta('geo.placename', 'São Luís');
    updateMeta('geo.position', '-2.5307;-44.2969');
    updateMeta('ICBM', '-2.5307, -44.2969');
  }, [title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, ogUrl, structuredData]);

  return null;
};

export default SEOHead;