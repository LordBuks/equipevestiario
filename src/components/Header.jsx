import { useState } from 'react';
import { LogIn, LogOut, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import interLogo from '../assets/inter-logo.png';

const Header = ({ onAdminClick, onBackToWelcome }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 min-h-[3.5rem]">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <img 
                src={interLogo} 
                alt="Sport Club Internacional" 
                className="h-10 w-10 flex-shrink-0"
              />
              <h1 className="text-xl font-bold text-[#E5050F] tracking-wide whitespace-nowrap">CELEIRO</h1>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
              {currentUser ? (
                <>
                  {/* Botão de voltar para a tela de boas-vindas */}
                  {onBackToWelcome && (
                    <button
                      onClick={onBackToWelcome}
                      className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 ease-in-out transform hover:scale-105 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Voltar</span>
                    </button>
                  )}
                  {/* Só mostra o botão Painel Admin para o administrador */}
                  {currentUser.email === 'gabiru@inter.com' && (
                    <button
                      onClick={onAdminClick}
                      className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 bg-[#E5050F] text-white rounded-md hover:bg-[#C20C18] transition-all duration-200 ease-in-out transform hover:scale-105 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      <Settings size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Painel Admin</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 ease-in-out transform hover:scale-105 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <LogOut size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Sair</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 bg-[#E5050F] text-white rounded-md hover:bg-[#C20C18] transition-all duration-200 ease-in-out transform hover:scale-105 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <LogIn size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLoginForm && (
        <LoginForm onClose={() => setShowLoginForm(false)} />
      )}
    </>
  );
};

export default Header;

