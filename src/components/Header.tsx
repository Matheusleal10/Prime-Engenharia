
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-prime-green/95 shadow-lg' : 'bg-prime-green'
    } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-24 lg:h-28' : 'h-32 lg:h-44'
        }`}>
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/99364a38-8664-4454-9977-176085566d0d.png" 
              alt="PRIME ENGENHARIA" 
              className="h-10 lg:h-[70px] w-auto"
            />
          </div>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 lg:space-x-12">
            <a href="#sobre" className={`text-white hover:text-prime-concrete font-bold transition-all ${
              isScrolled ? 'text-base' : 'text-lg'
            }`}>
              Sobre
            </a>
            <a href="#produtos" className={`text-white hover:text-prime-concrete font-bold transition-all ${
              isScrolled ? 'text-base' : 'text-lg'
            }`}>
              Produtos
            </a>
            <a href="#como-comprar" className={`text-white hover:text-prime-concrete font-bold transition-all ${
              isScrolled ? 'text-base' : 'text-lg'
            }`}>
              Como Comprar
            </a>
            <a href="#contato" className={`text-white hover:text-prime-concrete font-bold transition-all ${
              isScrolled ? 'text-base' : 'text-lg'
            }`}>
              Contato
            </a>
          </nav>

          {/* WhatsApp Button */}
          <a 
            href="https://wa.me/5598982350016"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden lg:flex items-center bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-all ${
              isScrolled ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base'
            }`}
          >
            Fale conosco
          </a>

          {/* Menu Mobile Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-prime-green border-t border-white/20">
            <nav className="flex flex-col py-3 space-y-4">
              <a href="#sobre" className="text-white hover:text-prime-concrete font-bold text-lg px-4" onClick={() => setIsMenuOpen(false)}>
                Sobre
              </a>
              <a href="#produtos" className="text-white hover:text-prime-concrete font-bold text-lg px-4" onClick={() => setIsMenuOpen(false)}>
                Produtos
              </a>
              <a href="#como-comprar" className="text-white hover:text-prime-concrete font-bold text-lg px-4" onClick={() => setIsMenuOpen(false)}>
                Como Comprar
              </a>
              <a href="#contato" className="text-white hover:text-prime-concrete font-bold text-lg px-4" onClick={() => setIsMenuOpen(false)}>
                Contato
              </a>
              <a 
                href="https://wa.me/5598982350016"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 bg-white hover:bg-white/90 text-prime-green px-4 py-2 rounded-full font-medium text-center transition-colors"
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
