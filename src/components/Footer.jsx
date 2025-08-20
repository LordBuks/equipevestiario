import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-container bg-gray-800 text-white py-4 sm:py-6 pt-8 sm:pt-10">
      <div className="footer-content max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Logo centralizado */}
          <div className="footer-logo-container flex justify-center">
            {/* Imagem diretamente sem círculo cinza ao redor */}
            <img 
              src="/stk_logo.jpg" 
              alt="Logo STK" 
              className="footer-logo w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover object-center"
              onError={(e) => {
                // Se a imagem não carregar, mostra as iniciais em um círculo
                e.target.outerHTML = '<div class="w-12 h-12 sm:w-14 sm:h-14 bg-gray-600 rounded-full flex items-center justify-center"><span class="text-white font-bold text-sm sm:text-base">STK</span></div>';
              }}
            />
          </div>
          
          {/* Textos centralizados */}
          <div className="footer-text text-center">
            <div className="footer-title">
              <p className="text-sm sm:text-base font-medium">Gestão de Agentes de Segurança</p>
              <p className="text-sm sm:text-base">Equipe do Vestiário</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">© 2025 TechVamp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

