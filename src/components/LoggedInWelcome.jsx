import { Users, Settings, Shield, LogOut } from 'lucide-react';
import Footer from './Footer';

const LoggedInWelcome = ({ user, onContinue, onAdminClick, onLogout, onShowSectorsPage }) => {
  const isAdminUser = user && user.email === 'gestor@inter.com';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <main className="flex-grow flex items-center justify-center px-3 sm:px-4 lg:px-6 py-3">
        <div className="w-full max-w-3xl text-center">
          <img 
            src="https://i.imgur.com/aVevWWG.png" 
            alt="SC Internacional" 
            className="h-16 w-16 mx-auto mb-4 rounded-full object-contain"
          />
          <p className="text-base text-gray-600 mb-3">
            {user?.email}
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-5 mb-3">
            <h2 className="text-lg font-semibold text-[#E5050F] mb-3">
              Bem vindo!
            </h2>
            
            <p className="text-sm text-gray-700 mb-5">
              Agora você tem acesso ao Sistema de Gestão dos Agentes de Segurança.
              Aqui você pode visualizar os dados.
            </p>

            <div className="grid md:grid-cols-2 gap-3 mb-5">
              <div className="bg-white border-2 border-[#E5050F] rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Users className="text-[#E5050F] mr-2" size={18} />
                  <h3 className="text-sm font-bold text-[#E5050F]">
                    Acesso aos Dados
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Visualize informações detalhadas dos Agentes Cadastrados no Sitema.
                </p>
              </div>

              <div className="bg-white border-2 border-[#E5050F] rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Shield className="text-[#E5050F] mr-2" size={18} />
                  <h3 className="text-sm font-bold text-[#E5050F]">
                    Dados Protegidos
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Todas as informações são tratadas com segurança e conforme 
                  as diretrizes da LGPD.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={onContinue}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#E5050F] border-2 border-white text-white rounded-md welcome-button hover:bg-white hover:text-[#E5050F] hover:border-[#E5050F] transition-colors text-sm font-semibold min-w-[140px]"
              >
                <Users size={18} />
                <span>Efetivo</span>
              </button>

              <button
                onClick={onShowSectorsPage} // Alterado de onShowEmployeesPage para onShowSectorsPage
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#E5050F] border-2 border-white text-white rounded-md welcome-button hover:bg-white hover:text-[#E5050F] hover:border-[#E5050F] transition-colors text-sm font-semibold min-w-[140px]"
              >
                <Users size={18} />
                <span>Setores</span>
              </button>

              {isAdminUser && (
                <button
                  onClick={onAdminClick}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#E5050F] border-2 border-white text-white rounded-md welcome-button hover:bg-white hover:text-[#E5050F] hover:border-[#E5050F] transition-colors text-sm font-semibold min-w-[140px]"
                >
                  <Settings size={18} />
                  <span>Painel Admin</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#E5050F] border-2 border-white text-white rounded-md welcome-button hover:bg-white hover:text-[#E5050F] hover:border-[#E5050F] transition-colors text-sm font-semibold min-w-[140px]"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default LoggedInWelcome;


