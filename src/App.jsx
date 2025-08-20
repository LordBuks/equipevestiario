import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import PlayerGrid from './components/PlayerGrid';
import PlayerModalWithTabs from './components/PlayerModalWithTabs';
import SectorsPage from './pages/SectorsPage'; // Importando o componente renomeado
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import WelcomeScreen from './components/WelcomeScreen';
import LoggedInWelcome from './components/LoggedInWelcome';
import { usePersonnel } from './hooks/usePersonnel';
import './App.css';

function AppContent() {
  const { currentUser, loading: authLoading, logout } = useAuth();
  const { personnel, loading: personnelLoading, error, getPersonnelByType, getPersonnelByAssignment } = usePersonnel();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSectorsPage, setShowSectorsPage] = useState(false); // Renomeado para showSectorsPage
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Especial"); // Categoria padrão para a tela principal

  // Atualizar categoria quando mudar para página de setores ou painel admin
  useEffect(() => {
    if (showSectorsPage) {
      // Não define categoria padrão aqui, SectorsPage gerencia suas próprias categorias (assignments)
    } else if (!showAdminPanel) {
      setSelectedCategory("Especial"); // Categoria padrão para jogadores na tela principal
    }
  }, [showSectorsPage, showAdminPanel]);

  // Filtrar pessoal para PlayerGrid (Especial/Agente)
  const filteredPlayers = getPersonnelByType(selectedCategory);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };

  const handleClosePlayerModal = () => {
    setIsPlayerModalOpen(false);
    setSelectedPlayer(null);
  };

  const handleAdminClick = () => {
    setShowAdminPanel(true);
    setShowWelcomeBack(false);
    setShowSectorsPage(false);
  };

  const handleBackToPublic = () => {
    setShowAdminPanel(false);
    setShowWelcomeBack(false);
    setShowSectorsPage(false);
  };

  const handleContinueToMain = () => {
    setShowWelcomeBack(false);
    setShowSectorsPage(false);
  };

  const handleShowSectorsPage = () => { // Renomeado para handleShowSectorsPage
    setShowSectorsPage(true);
    setShowWelcomeBack(false);
    setShowAdminPanel(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Se o usuário não estiver logado e a autenticação não estiver carregando, exibe a tela de login
  if (!currentUser && !authLoading) {
    return <Login />;
  }

  // Se a autenticação ou os dados estiverem carregando, exibe a tela de carregamento
  if (authLoading || personnelLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#E5050F] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário estiver logado e a tela de boas-vindas estiver ativa, exibe LoggedInWelcome
  if (currentUser && showWelcomeBack) {
    return (
      <LoggedInWelcome 
        user={currentUser} 
        onContinue={handleContinueToMain} 
        onAdminClick={handleAdminClick} 
        onLogout={handleLogout}
        onShowSectorsPage={handleShowSectorsPage} // Renomeado
      />
    );
  }

  // Se o usuário estiver logado e showAdminPanel for verdadeiro, exibe o painel administrativo
  if (currentUser && showAdminPanel) {
    return <AdminPanel onBackToPublic={handleBackToPublic} />;
  }

  // Se o usuário estiver logado e showSectorsPage for verdadeiro, exibe a página de setores
  if (currentUser && showSectorsPage) {
    return (
      <SectorsPage 
        onAdminClick={handleAdminClick}
        onBackToWelcome={() => setShowWelcomeBack(true)}
      />
    );
  }

  // Se o usuário estiver logado e showWelcomeBack for falso, exibe o conteúdo principal do site
  if (currentUser && !showWelcomeBack) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onAdminClick={handleAdminClick} 
          onBackToWelcome={() => setShowWelcomeBack(true)}
        />
        <CategoryMenu 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={["Especial", "Agente"]} // Categorias padronizadas
          title="Categorias de Agentes"
        />
        
        {error && (
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 sm:px-4 py-3 rounded text-sm sm:text-base">
              <p>⚠️ Usando dados de demonstração. {error}</p>
            </div>
          </div>
        )}
        
        <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <PlayerGrid 
            players={filteredPlayers}
            onPlayerClick={handlePlayerClick}
          />
        </main>

        <PlayerModalWithTabs 
          player={selectedPlayer}
          isOpen={isPlayerModalOpen}
          onClose={handleClosePlayerModal}
        />
      </div>
    );
  }

  // Fallback
  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;


