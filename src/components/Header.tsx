
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 lg:h-32">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0b5e2834-14f7-48ac-9d10-1496398c9096.png" 
              alt="PRIME ENGENHARIA" 
              className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 w-auto"
            />
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#sobre" className="text-prime-concrete-dark hover:text-prime-green font-medium transition-colors">
              Sobre
            </a>
            <a href="#produtos" className="text-prime-concrete-dark hover:text-prime-green font-medium transition-colors">
              Produtos
            </a>
            <a href="#vantagens" className="text-prime-concrete-dark hover:text-prime-green font-medium transition-colors">
              Vantagens
            </a>
            <a href="#como-comprar" className="text-prime-concrete-dark hover:text-prime-green font-medium transition-colors">
              Como Comprar
            </a>
            <a href="#contato" className="text-prime-concrete-dark hover:text-prime-green font-medium transition-colors">
              Contato
            </a>
          </nav>

          {/* WhatsApp Button */}
          <a 
            href="https://wa.me/559898708157" 
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-colors"
          >
            Fale conosco
          </a>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="flex flex-col py-4 space-y-4">
              <a href="#sobre" className="text-prime-concrete-dark hover:text-prime-green font-medium px-4" onClick={() => setIsMenuOpen(false)}>
                Sobre
              </a>
              <a href="#produtos" className="text-prime-concrete-dark hover:text-prime-green font-medium px-4" onClick={() => setIsMenuOpen(false)}>
                Produtos
              </a>
              <a href="#vantagens" className="text-prime-concrete-dark hover:text-prime-green font-medium px-4" onClick={() => setIsMenuOpen(false)}>
                Vantagens
              </a>
              <a href="#como-comprar" className="text-prime-concrete-dark hover:text-prime-green font-medium px-4" onClick={() => setIsMenuOpen(false)}>
                Como Comprar
              </a>
              <a href="#contato" className="text-prime-concrete-dark hover:text-prime-green font-medium px-4" onClick={() => setIsMenuOpen(false)}>
                Contato
              </a>
              <a 
                href="https://wa.me/559898708157" 
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium text-center transition-colors"
              >
                Fale conosco
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
