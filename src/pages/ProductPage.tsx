import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import ProductStructuredData from '@/components/ProductStructuredData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ProductData {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
  content: string;
  image: string;
  benefits: string[];
  applications: string[];
  specifications: string[];
}

const productData: Record<string, ProductData> = {
  'blocos-de-concreto': {
    slug: 'blocos-de-concreto',
    name: 'Blocos de Concreto Estrutural',
    title: 'Blocos de Concreto Estrutural | Prime Engenharia Maranhão',
    description: 'Blocos de concreto estrutural de alta resistência para obras em São Luís e todo Maranhão. Qualidade e economia em sua construção.',
    keywords: 'blocos de concreto, bloco estrutural, construção civil maranhão, prime engenharia, blocos são luís, material construção',
    content: 'Os blocos de concreto da Prime Engenharia são produzidos com tecnologia de ponta, garantindo resistência, durabilidade e padrão de qualidade para sua obra. Utilizados em projetos residenciais, comerciais e industriais, nossos blocos proporcionam excelente desempenho estrutural e rapidez na execução da alvenaria. Além de oferecer economia no custo final da construção, os blocos de concreto possuem medidas padronizadas que facilitam o encaixe e reduzem o desperdício de argamassa. Trabalhamos com diferentes dimensões, atendendo às necessidades específicas de cada projeto. Na Prime Engenharia, prezamos pela inovação e sustentabilidade, oferecendo produtos que respeitam normas técnicas e asseguram confiança para engenheiros, arquitetos e construtores.',
    image: '/lovable-uploads/78ee719a-012e-4248-9651-263c2ae10be1.png',
    benefits: ['Alta resistência estrutural', 'Medidas padronizadas', 'Redução de desperdícios', 'Rapidez na execução'],
    applications: ['Projetos residenciais', 'Construções comerciais', 'Obras industriais', 'Alvenaria estrutural'],
    specifications: ['Diferentes dimensões disponíveis', 'Conformidade com normas técnicas', 'Tecnologia de ponta na produção', 'Controle de qualidade rigoroso']
  },
  'piso-sextavado': {
    slug: 'piso-sextavado',
    name: 'Piso Sextavado de Concreto',
    title: 'Piso Sextavado de Concreto | Prime Engenharia Maranhão',
    description: 'Piso sextavado em concreto, resistente e durável para calçadas, praças e áreas urbanas. Fornecimento em São Luís e região.',
    keywords: 'piso sextavado, pavimentação, calçadas, praças, piso concreto são luís, prime engenharia',
    content: 'O piso sextavado da Prime Engenharia é a solução ideal para pavimentação de áreas externas. Com formato geométrico exclusivo, oferece resistência, durabilidade e um excelente acabamento estético. Indicado para calçadas, estacionamentos, praças e áreas de grande circulação, o piso sextavado garante praticidade na instalação e fácil manutenção. Além disso, sua superfície antiderrapante contribui para a segurança de pedestres e veículos. Produzido dentro de rigorosos padrões de qualidade, o piso sextavado da Prime Engenharia alia funcionalidade e beleza, sendo uma escolha inteligente para projetos públicos e privados.',
    image: '/lovable-uploads/c69c4e20-fe9b-4264-8cc7-d8ecdfe67c8d.png',
    benefits: ['Formato geométrico exclusivo', 'Superfície antiderrapante', 'Fácil instalação', 'Baixa manutenção'],
    applications: ['Calçadas', 'Estacionamentos', 'Praças públicas', 'Áreas de circulação'],
    specifications: ['Acabamento estético superior', 'Padrões rigorosos de qualidade', 'Resistência ao tráfego', 'Segurança para pedestres']
  },
  'tijolo-ecologico': {
    slug: 'tijolo-ecologico',
    name: 'Tijolo Ecológico de Solo-Cimento',
    title: 'Tijolo Ecológico de Solo-Cimento | Prime Engenharia Maranhão',
    description: 'Tijolos ecológicos sustentáveis, resistentes e econômicos. A solução inteligente para construções modernas em São Luís e Maranhão.',
    keywords: 'tijolo ecológico, solo cimento, construção sustentável, eco brick, tijolo prensado, prime engenharia maranhão',
    content: 'O tijolo ecológico da Prime Engenharia é produzido a partir de solo-cimento, sem necessidade de queima, o que reduz o impacto ambiental e torna sua obra mais sustentável. Além de ecologicamente correto, o tijolo ecológico proporciona economia significativa em argamassa e acabamento, pois possui encaixe preciso e pode ser deixado aparente. Com excelente resistência e isolamento térmico, é ideal para construções modernas, sustentáveis e econômicas. Escolher o tijolo ecológico é investir em qualidade, inovação e respeito ao meio ambiente.',
    image: '/lovable-uploads/f1c6e620-d537-4655-b783-a2b2635ebaa9.png',
    benefits: ['Produção sem queima', 'Economia em argamassa', 'Excelente isolamento térmico', 'Pode ficar aparente'],
    applications: ['Construções residenciais', 'Projetos sustentáveis', 'Obras modernas', 'Construção econômica'],
    specifications: ['Solo-cimento prensado', 'Encaixe de precisão', 'Impacto ambiental reduzido', 'Resistência comprovada']
  },
  'paver': {
    slug: 'paver',
    name: 'Paver Intertravado de Concreto',
    title: 'Paver Intertravado de Concreto | Prime Engenharia Maranhão',
    description: 'Paver de concreto intertravado para calçadas, ruas e estacionamentos. Alta resistência e fácil manutenção.',
    keywords: 'paver intertravado, pavimento concreto, paver são luís, prime engenharia, pavimentação urbana',
    content: 'O paver intertravado da Prime Engenharia é um pavimento de concreto versátil, durável e de fácil aplicação. Indicado para áreas de tráfego leve e médio, como ruas, praças, condomínios e estacionamentos, o paver garante resistência e beleza ao projeto. Sua principal vantagem é o sistema intertravado, que distribui as cargas de forma eficiente e permite a manutenção simples em caso de necessidade. Disponível em diferentes cores e formatos, o paver da Prime Engenharia combina praticidade e estética, sendo uma opção sustentável e funcional para obras públicas e privadas.',
    image: '/lovable-uploads/44b95eb4-9bdc-43c5-b92e-4030d4d4cdaa.png',
    benefits: ['Sistema intertravado eficiente', 'Diferentes cores e formatos', 'Manutenção simples', 'Distribuição de cargas'],
    applications: ['Ruas residenciais', 'Condomínios', 'Estacionamentos', 'Praças'],
    specifications: ['Tráfego leve e médio', 'Versatilidade de aplicação', 'Durabilidade comprovada', 'Estética e funcionalidade']
  },
  'hidrofugante-aqua100': {
    slug: 'hidrofugante-aqua100',
    name: 'Hidrofugante Aqua100',
    title: 'Hidrofugante Aqua100 | Proteção Contra Umidade - Prime Engenharia',
    description: 'Hidrofugante Aqua100: proteção avançada contra umidade para blocos, tijolos e concretos. Segurança e durabilidade para sua obra.',
    keywords: 'hidrofugante, aqua100, proteção umidade, impermeabilização, prime engenharia, tratamento alvenaria',
    content: 'O hidrofugante Aqua100 é um produto desenvolvido para proteger superfícies de alvenaria contra a penetração de água. Aplicado em blocos, tijolos ecológicos e concretos, cria uma barreira invisível que mantém a estética original e garante maior durabilidade. Com formulação moderna, o Aqua100 não altera a cor do material, é de fácil aplicação e oferece longa proteção. Sua utilização reduz riscos de infiltração, mofo e deterioração precoce dos materiais. Na Prime Engenharia, disponibilizamos o Aqua100 como solução eficaz para aumentar a vida útil das construções, assegurando mais economia e segurança.',
    image: '/lovable-uploads/baa55910-9e15-4c81-9d3c-a4a309711581.png',
    benefits: ['Barreira invisível contra água', 'Não altera a cor do material', 'Fácil aplicação', 'Longa proteção'],
    applications: ['Blocos de concreto', 'Tijolos ecológicos', 'Superfícies de concreto', 'Alvenaria em geral'],
    specifications: ['Formulação moderna', 'Proteção contra infiltração', 'Reduz mofo e deterioração', 'Aumenta vida útil']
  },
  'tijofix': {
    slug: 'tijofix',
    name: 'Tijofix - Argamassa para Tijolo Ecológico',
    title: 'Tijofix – Argamassa para Tijolo Ecológico | Prime Engenharia Maranhão',
    description: 'Tijofix: argamassa ideal para assentamento de tijolos ecológicos. Maior aderência, economia e praticidade na obra.',
    keywords: 'tijofix, argamassa tijolo ecológico, assentamento, prime engenharia, construção sustentável',
    content: 'O Tijofix é uma argamassa especialmente desenvolvida para o assentamento de tijolos ecológicos. Sua fórmula garante alta aderência, resistência e praticidade na execução da obra. Com o Tijofix, o processo de construção se torna mais rápido e econômico, reduzindo desperdícios e aumentando a produtividade. Além disso, contribui para acabamentos mais limpos e precisos. Na Prime Engenharia, o Tijofix é fornecido com garantia de qualidade e desempenho, sendo a escolha certa para quem busca eficiência e economia na utilização de tijolos ecológicos.',
    image: '/lovable-uploads/99364a38-8664-4454-9977-176085566d0d.png',
    benefits: ['Alta aderência', 'Redução de desperdícios', 'Acabamentos precisos', 'Aumento da produtividade'],
    applications: ['Assentamento de tijolos ecológicos', 'Construção sustentável', 'Obras residenciais', 'Projetos comerciais'],
    specifications: ['Fórmula especialmente desenvolvida', 'Garantia de qualidade', 'Processo mais rápido', 'Economia na obra']
  },
  'impermeabilizante-ecolojit': {
    slug: 'impermeabilizante-ecolojit',
    name: 'Impermeabilizante Ecolojit',
    title: 'Impermeabilizante Ecolojit | Proteção Sustentável - Prime Engenharia Maranhão',
    description: 'Impermeabilizante Ecolojit: solução ecológica para proteção de superfícies contra umidade. Sustentabilidade e eficiência em sua obra.',
    keywords: 'impermeabilizante ecolojit, proteção sustentável, impermeabilização ecológica, prime engenharia',
    content: 'O Impermeabilizante Ecolojit é uma solução sustentável e inovadora para proteção de superfícies contra a ação da água. Ideal para blocos, tijolos e estruturas de concreto, cria uma camada protetora que aumenta a durabilidade e reduz custos com manutenção. Por ser ecológico, o Ecolojit não agride o meio ambiente e pode ser aplicado em diferentes tipos de construção, desde residenciais até grandes projetos. Na Prime Engenharia, trabalhamos para oferecer produtos que unem tecnologia, sustentabilidade e eficiência, e o Ecolojit é um exemplo disso.',
    image: '/lovable-uploads/a1726bce-fcff-4b72-9b38-cb9c22b573ec.png',
    benefits: ['Solução sustentável', 'Não agride o meio ambiente', 'Reduz custos de manutenção', 'Aumenta durabilidade'],
    applications: ['Blocos de concreto', 'Tijolos ecológicos', 'Estruturas de concreto', 'Diferentes tipos de construção'],
    specifications: ['Inovação tecnológica', 'Proteção contra água', 'Aplicação versátil', 'Camada protetora durável']
  }
};

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    if (slug && productData[slug]) {
      setProduct(productData[slug]);
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Produto não encontrado</h1>
            <Link to="/#produtos">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Produtos
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={product.title}
        description={product.description}
        keywords={product.keywords}
        canonicalUrl={`https://primeengenharia.lovable.app/${product.slug}`}
        ogImage={`https://primeengenharia.lovable.app${product.image}`}
      />
      <ProductStructuredData product={product} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Início</Link></li>
            <li>›</li>
            <li><Link to="/#produtos" className="hover:text-foreground">Produtos</Link></li>
            <li>›</li>
            <li className="text-foreground font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.content}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={() => window.open('https://wa.me/5598987654321?text=Olá, tenho interesse no ' + product.name, '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={() => window.open('tel:+5598987654321', '_self')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Ligar Agora
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-4">Benefícios</h3>
            <ul className="space-y-2">
              {product.benefits.map((benefit, index) => (
                <li key={index} className="text-muted-foreground flex items-start">
                  <span className="text-prime-green mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-4">Aplicações</h3>
            <ul className="space-y-2">
              {product.applications.map((application, index) => (
                <li key={index} className="text-muted-foreground flex items-start">
                  <span className="text-prime-orange mr-2">•</span>
                  {application}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-4">Especificações</h3>
            <ul className="space-y-2">
              {product.specifications.map((spec, index) => (
                <li key={index} className="text-muted-foreground flex items-start">
                  <span className="text-prime-concrete mr-2">→</span>
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Back to Products */}
        <div className="text-center">
          <Link to="/#produtos">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver Todos os Produtos
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;