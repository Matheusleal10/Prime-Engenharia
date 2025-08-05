
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductModal from './ProductModal';

type Product = {
  id: string;
  name: string;
  icon: string;
  description: string;
  details: string;
  category: string;
  is_featured: boolean;
  sort_order: number;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Novos produtos estáticos
  const newProducts = [
    {
      name: "Blocos",
      description: "Blocos de concreto modulares para construção estrutural e de vedação.",
      details: "Produzidos com cimento, areia e agregados selecionados. Dimensões padronizadas para facilitar o assentamento. Resistência compressiva superior a 4,5 MPa. Ideais para paredes estruturais e de vedação.",
      image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800&h=600&fit=crop",
      benefits: [
        "Alta resistência e durabilidade",
        "Facilidade no assentamento",
        "Excelente custo-benefício",
        "Padronização dimensional",
        "Versatilidade de uso"
      ],
      applications: [
        "Construção de paredes estruturais",
        "Paredes de vedação",
        "Muros e cercas",
        "Construções residenciais",
        "Obras comerciais e industriais"
      ]
    },
    {
      name: "Sextavado",
      description: "Peças hexagonais para pavimentação decorativa e funcional.",
      details: "Peças pré-moldadas em formato hexagonal, oferecendo design moderno e funcionalidade. Produzidas com concreto de alta qualidade. Permitem drenagem e fácil manutenção. Disponíveis em diversas cores e acabamentos.",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop",
      benefits: [
        "Design moderno e atrativo",
        "Facilita drenagem",
        "Resistente ao tráfego",
        "Fácil instalação e manutenção",
        "Variedade de cores disponíveis"
      ],
      applications: [
        "Pavimentação de calçadas",
        "Pátios e jardins",
        "Estacionamentos residenciais",
        "Áreas comerciais",
        "Projetos paisagísticos"
      ]
    },
    {
      name: "Paver",
      description: "Blocos intertravados para pavimentação de alta performance.",
      details: "Blocos de concreto intertravados produzidos com tecnologia avançada. Alta resistência à compressão e baixa absorção de água. Sistema de encaixe que distribui cargas uniformemente. Ideal para áreas de tráfego intenso.",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop",
      benefits: [
        "Alta resistência ao tráfego",
        "Sistema de intertravamento",
        "Baixa absorção de água",
        "Facilita manutenção pontual",
        "Sustentável e reutilizável"
      ],
      applications: [
        "Ruas e avenidas",
        "Estacionamentos comerciais",
        "Pátios industriais",
        "Calçadões e praças",
        "Áreas portuárias"
      ]
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Fallback gracefully with empty array
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredProduct = products.find(p => p.is_featured);
  const otherProducts = products.filter(p => !p.is_featured);

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <section id="produtos" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Produto em Destaque */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-12 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
              </div>
              <div className="h-80 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        ) : featuredProduct ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-12 animate-slide-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center bg-prime-green/10 text-prime-green px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {featuredProduct.icon} Produto Principal
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold text-prime-green mb-6">
                  {featuredProduct.name}
                </h3>

                <p className="text-lg text-prime-concrete mb-6">
                  {featuredProduct.description}
                </p>

                <div className="space-y-4 mb-8">
                  <h4 className="text-xl font-semibold text-prime-concrete-dark mb-4">Principais Benefícios:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                      <span className="text-prime-concrete">Encaixe perfeito e preciso</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                      <span className="text-prime-concrete">Economia de até 30% no cimento</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                      <span className="text-prime-concrete">Resistência superior a 6 MPa</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                      <span className="text-prime-concrete">Redução de 50% no custo final</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                      <span className="text-prime-concrete">Isolamento térmico e acústico</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-prime-green rounded-full"></div>
                      <span className="text-prime-concrete">100% sustentável e reciclável</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-prime-concrete-dark mb-4">Aplicações Ideais:</h4>
                  <p className="text-prime-concrete">
                    {featuredProduct.details}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href="#contato"
                    className="inline-flex items-center justify-center bg-prime-green hover:bg-prime-green-light text-white px-6 py-3 rounded-full font-medium transition-colors"
                  >
                    Solicitar Orçamento
                  </a>
                  <a 
                    href={`https://wa.me/5598982350016?text=Olá! Gostaria de saber mais sobre ${featuredProduct.name.toLowerCase()}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border-2 border-prime-green text-prime-green hover:bg-prime-green hover:text-white px-6 py-3 rounded-full font-medium transition-colors"
                  >
                    Saiba Mais no WhatsApp
                  </a>
                </div>
              </div>

              <div className="relative">
                <img 
                  src="/lovable-uploads/d4ca7e0c-6a7c-473b-b733-44282b4c965e.png" 
                  alt={`${featuredProduct.name} PRIME ENGENHARIA`}
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-prime-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                  Pioneiros em MA
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Vantagens dos Tijolos Ecológicos */}
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-5xl font-bold text-prime-green mb-4">
            Por que escolher o Tijolo Ecológico da PRIME ENGENHARIA?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="text-center p-6 bg-white rounded-2xl hover:bg-prime-green/5 transition-colors shadow-md">
              <div className="text-5xl mb-4">♻️</div>
              <h4 className="text-xl font-bold text-prime-concrete-dark mb-3">Sustentável</h4>
              <p className="text-prime-concrete leading-relaxed">Reduz resíduos e uso de cimento, preservando o meio ambiente</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl hover:bg-prime-green/5 transition-colors shadow-md">
              <div className="text-5xl mb-4">🧱</div>
              <h4 className="text-xl font-bold text-prime-concrete-dark mb-3">Modular</h4>
              <p className="text-prime-concrete leading-relaxed">Fácil encaixe e agilidade na obra, economizando tempo</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl hover:bg-prime-green/5 transition-colors shadow-md">
              <div className="text-5xl mb-4">🏠</div>
              <h4 className="text-xl font-bold text-prime-concrete-dark mb-3">Estético</h4>
              <p className="text-prime-concrete leading-relaxed">Visual moderno e natural para suas construções</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl hover:bg-prime-green/5 transition-colors shadow-md">
              <div className="text-5xl mb-4">🚚</div>
              <h4 className="text-xl font-bold text-prime-concrete-dark mb-3">Entrega rápida</h4>
              <p className="text-prime-concrete leading-relaxed">Atendemos São Luís e região com agilidade</p>
            </div>
          </div>
        </div>

        {/* Outros Produtos */}
        <div>
          <h3 className="text-2xl font-bold text-center text-prime-green mb-8">
            Outros Produtos Disponíveis
          </h3>
          
          {/* Novos Produtos com Modal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {newProducts.map((product, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openModal(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h4 className="text-lg font-semibold text-prime-concrete-dark mb-3 text-center">
                  {product.name}
                </h4>
                <p className="text-sm text-prime-concrete text-center mb-4">
                  {product.description}
                </p>
                <div className="text-center">
                  <span className="text-prime-green hover:text-prime-green-light font-medium text-sm inline-flex items-center">
                    Clique para ver mais
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Produtos do Banco de Dados */}
          {otherProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProducts.map((product, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${(index + newProducts.length) * 0.1}s` }}
                >
                  <div className="text-4xl mb-4 text-center">{product.icon}</div>
                  <h4 className="text-lg font-semibold text-prime-concrete-dark mb-3 text-center">
                    {product.name}
                  </h4>
                  <p className="text-sm text-prime-concrete text-center mb-3">
                    {product.description}
                  </p>
                  <p className="text-xs text-prime-concrete/80 text-center mb-4">
                    {product.details}
                  </p>
                  <div className="text-center">
                    <a 
                      href={`https://wa.me/5598982350016?text=Olá! Gostaria de saber mais sobre ${product.name.toLowerCase()}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-prime-green hover:text-prime-green-light font-medium text-sm inline-flex items-center"
                    >
                      Saiba Mais
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Produto */}
        {selectedProduct && (
          <ProductModal
            isOpen={isModalOpen}
            onClose={closeModal}
            product={selectedProduct}
          />
        )}
      </div>
    </section>
  );
};

export default Products;
