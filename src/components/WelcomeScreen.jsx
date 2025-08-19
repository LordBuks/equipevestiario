import React from 'react';
import interLogo from '../assets/inter-logo.png';

const WelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <img 
        src={interLogo} 
        alt="Sport Club Internacional" 
        className="h-24 w-24 mb-6"
      />
      <h1 className="text-4xl font-bold text-[#E5050F] mb-4">Bem-vindo ao Celeiro!</h1>
      <p className="text-lg text-gray-700 mb-8">O sistema de gestão de atletas do Sport Club Internacional.</p>
      <p className="text-md text-gray-600">Por favor, faça login para continuar.</p>
    </div>
  );
};

export default WelcomeScreen;


