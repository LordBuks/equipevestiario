import { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from './Header';
import CategoryMenu from './CategoryMenu';
import EmployeeGrid from './EmployeeGrid';
import EmployeeModal from './EmployeeModal';
import PersonnelSelector from './PersonnelSelector';
import { usePersonnel } from '../hooks/usePersonnel';

const EmployeesPageNew = ({ onAdminClick, onBackToWelcome }) => {
  const { 
    personnel, 
    loading: personnelLoading, 
    error: personnelError, 
    getPersonnelByAssignment,
    getAvailableForAssignment,
    addAssignment
  } = usePersonnel();
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPersonnelSelectorOpen, setIsPersonnelSelectorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Visitantes");

  const filteredEmployees = getPersonnelByAssignment(selectedCategory);
  const availablePersonnel = getAvailableForAssignment(selectedCategory);

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

  const handleAddAgentToPost = () => {
    setIsPersonnelSelectorOpen(true);
  };

  const handlePersonnelSelect = async (person) => {
    try {
      await addAssignment(person.id, selectedCategory);
      setIsPersonnelSelectorOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar agente ao posto:', error);
      alert('Erro ao adicionar agente ao posto. Tente novamente.');
    }
  };

  if (personnelLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E5050F] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando funcionários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAdminClick={onAdminClick} onBackToWelcome={handleBackToWelcomePage} />
      
      {/* Título específico para funcionários */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Setores
            </h1>
            <p className="text-lg text-gray-600">
              Gerencie os postos de serviço.
            </p>
          </div>
        </div>
      </div>

      <CategoryMenu 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={["Visitantes", "Imprensa", "Presidência", "Rampa"]}
        title="Distribuição de Agentes"
      />
      
      {personnelError && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>⚠️ Usando dados de demonstração. {personnelError}</p>
          </div>
        </div>
      )}
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Botão para adicionar agente existente ao posto */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddAgentToPost}
            className="flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C5040E] transition-colors"
          >
            <Plus size={20} />
            <span>Adicionar Agente ao Posto</span>
          </button>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum agente encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Não há agentes cadastrados na categoria "{selectedCategory}" no momento.
              </p>
              <button
                onClick={handleAddAgentToPost}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C5040E] transition-colors"
              >
                <Plus size={20} />
                <span>Adicionar Primeiro Agente</span>
              </button>
            </div>
          </div>
        ) : (
          <EmployeeGrid 
            employees={filteredEmployees}
            onEmployeeClick={handleEmployeeClick}
          />
        )}
      </main>

      <EmployeeModal 
        employee={selectedEmployee}
        isOpen={isEmployeeModalOpen}
        onClose={handleCloseEmployeeModal}
      />

      <PersonnelSelector
        isOpen={isPersonnelSelectorOpen}
        onClose={() => setIsPersonnelSelectorOpen(false)}
        onSelect={handlePersonnelSelect}
        availablePersonnel={availablePersonnel}
        assignment={selectedCategory}
      />
    </div>
  );
};

export default EmployeesPageNew;

