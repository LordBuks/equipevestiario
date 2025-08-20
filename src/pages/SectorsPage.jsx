import { useState, useEffect } from 'react';
import Header from '../components/Header'; // Caminho corrigido
import CategoryMenu from '../components/CategoryMenu';
import EmployeeGrid from '../components/EmployeeGrid';
import EmployeeModal from '../components/EmployeeModal';
import { playersService } from '../services/firebaseService';

const SectorsPage = ({ onAdminClick, onBackToWelcome }) => { // Renomeado para SectorsPage
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const assignments = [
    'Escolta Visitante',
    'Escolta Futebol',
    'Escolta Familiares',
    'Escolta Direção',
    'Escolta Túnel'
  ];

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const data = await playersService.getAll();
        setAllPlayers(data);
      } catch (err) {
        setError('Erro ao carregar dados: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  const filteredPlayers = selectedCategory
    ? allPlayers.filter(player => player.assignments && player.assignments.includes(selectedCategory))
    : allPlayers.filter(player => player.assignments && player.assignments.length > 0);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

  const handleCloseEmployeeModal = () => {
    setIsEmployeeModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleBackToWelcomePage = () => {
    if (onBackToWelcome) {
      onBackToWelcome();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E5050F] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAdminClick={onAdminClick} onBackToWelcome={handleBackToWelcomePage} />
      
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Postos de Trabalho
            </h1>
            <p className="text-lg text-gray-600">
              Visualize a distribuição dos Agentes por posto.
            </p>
          </div>
        </div>
      </div>

      <CategoryMenu 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={assignments}
        title="Distribuição de Pessoas"
      />
      
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>⚠️ {error}</p>
          </div>
        </div>
      )}
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma pessoa encontrada
              </h3>
              <p className="text-gray-600">
                Não há Agentes cadastradas no setor "{selectedCategory || 'selecionado'}" no momento.
              </p>
            </div>
          </div>
        ) : (
          <EmployeeGrid 
            employees={filteredPlayers}
            onEmployeeClick={handleEmployeeClick}
          />
        )}
      </main>

      <EmployeeModal 
        employee={selectedEmployee}
        isOpen={isEmployeeModalOpen}
        onClose={handleCloseEmployeeModal}
      />
    </div>
  );
};

export default SectorsPage;

