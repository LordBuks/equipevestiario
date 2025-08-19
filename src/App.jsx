import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import PlayerGrid from './components/PlayerGrid';
import PlayerModalWithTabs from './components/PlayerModalWithTabs';
import EmployeesPage from './components/EmployeesPage';
import AdminPanelWithStories from './components/AdminPanelWithStories';
import Login from './components/Login';
import WelcomeScreen from './components/WelcomeScreen';
import LoggedInWelcome from './components/LoggedInWelcome';
import { usePlayers } from './hooks/usePlayers';
import { useEmployees } from './hooks/useEmployees';
import './App.css';

function AppContent() {
  const { currentUser, loading: authLoading, logout } = useAuth();
  const { players, loading: playersLoading, error, getPlayersByCategory } = usePlayers();
  const { employees, loading: employeesLoading, error: employeesError, getEmployeesByFunction } = useEmployees();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showEmployeesPage, setShowEmployeesPage] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Sub20");

  // Atualizar categoria quando mudar para página de funcionários ou painel admin
  useEffect(() => {
    if (showEmployeesPage) {
      setSelectedCategory("Monitores");
    } else if (!showAdminPanel) {
      setSelectedCategory("Sub20");
    }
  }, [showEmployeesPage, showAdminPanel]);

  const filteredPlayers = getPlayersByCategory(selectedCategory);
  const filteredEmployees = getEmployeesByFunction(selectedCategory);

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
    setShowEmployeesPage(false);
  };

  const handleBackToPublic = () => {
    setShowAdminPanel(false);
    setShowWelcomeBack(false);
    setShowEmployeesPage(false);
  };

  const handleContinueToMain = () => {
    setShowWelcomeBack(false);
    setShowEmployeesPage(false);
  };

  const handleShowEmployeesPage = () => {
    setShowEmployeesPage(true);
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
  if (authLoading || playersLoading || employeesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E5050F] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
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
        onShowEmployeesPage={handleShowEmployeesPage}
      />
    );
  }

  // Se o usuário estiver logado e showAdminPanel for verdadeiro, exibe o painel administrativo
  if (currentUser && showAdminPanel) {
    return <AdminPanelWithStories onBackToPublic={handleBackToPublic} />;
  }

  // Se o usuário estiver logado e showEmployeesPage for verdadeiro, exibe a página de funcionários
  if (currentUser && showEmployeesPage) {
    return (
      <EmployeesPage 
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
        />
        
        {error && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>⚠️ Usando dados de demonstração. {error}</p>
            </div>
          </div>
        )}
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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


