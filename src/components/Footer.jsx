import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-logo-container">
          <img 
            src="/src/assets/stk_logo.jpg" 
            alt="Logo STK" 
            className="footer-logo round"
          />
        </div>
        <div className="footer-text">
          <div className="footer-title">
            <p>Gestão de Agentes de Segurança</p>
            <p>Equipe do Vestiário</p>
            <p className="text-xs text-gray-500 mt-4">© 2025 TechVamp</p>
          </div>
          <p className="footer-department"></p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

