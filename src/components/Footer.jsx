import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-logo-container">
          <img 
            src="https://i.imgur.com/HIsH9X5.png" 
            alt="Logo Serviço Social" 
            className="footer-logo"
          />
        </div>
        <div className="footer-text">
          <p className="footer-title">
            <p>Sistema de Gestão de Atletas Alojados</p>
            <p>Departamento de Serviço Social</p>
            <p></p>
            <p class="text-xs text-gray-500 mt-4">© 2025 TechVamp</p>
          </p>
          <p className="footer-department"></p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

