import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    details: string;
    image: string;
    benefits: string[];
    applications: string[];
  };
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-prime-green">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Imagem do Produto */}
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
            <div className="bg-prime-green/5 p-4 rounded-xl">
              <h4 className="font-semibold text-prime-concrete-dark mb-2">Descrição</h4>
              <p className="text-prime-concrete text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="space-y-6">
            {/* Benefícios */}
            <div>
              <h4 className="text-lg font-semibold text-prime-concrete-dark mb-3">
                Principais Benefícios:
              </h4>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-prime-green rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-prime-concrete text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aplicações */}
            <div>
              <h4 className="text-lg font-semibold text-prime-concrete-dark mb-3">
                Aplicações:
              </h4>
              <ul className="space-y-2">
                {product.applications.map((application, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-prime-orange rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-prime-concrete text-sm">{application}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detalhes Técnicos */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-prime-concrete-dark mb-2">Especificações</h4>
              <p className="text-prime-concrete text-sm leading-relaxed">
                {product.details}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a 
                href="#contato"
                onClick={onClose}
                className="inline-flex items-center justify-center bg-prime-green hover:bg-prime-green-light text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Solicitar Orçamento
              </a>
              <a 
                href={`https://wa.me/5598982350016?text=Olá! Gostaria de saber mais sobre ${product.name.toLowerCase()}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border-2 border-prime-green text-prime-green hover:bg-prime-green hover:text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;