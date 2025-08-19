import { useState } from 'react';
import Header from './Header';
import CategoryMenu from './CategoryMenu';
import EmployeeGrid from './EmployeeGrid';
import EmployeeModal from './EmployeeModal';
import { useEmployees } from '../hooks/useEmployees';

const EmployeesPage = ({ onAdminClick, onBackToWelcome }) => {
  const { employees, loading: employeesLoading, error: employeesError, getEmployeesByFunction } = useEmployees();
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Monitores");

  const filteredEmployees = getEmployeesByFunction(selectedCategory);

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

  if (employeesLoading) {
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
              Magic Team do Alojamento
            </h1>
            <p className="text-lg text-gray-600">
              Conheça a equipe do alojamento.
            </p>
          </div>
        </div>
      </div>

      <CategoryMenu 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={["Monitores", "Assistentes Sociais", "Pedagogia"]}
        title="Funcionários por Função"
      />
      
      {employeesError && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>⚠️ Usando dados de demonstração. {employeesError}</p>
          </div>
        </div>
      )}
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum funcionário encontrado
              </h3>
              <p className="text-gray-600">
                Não há funcionários cadastrados na categoria "{selectedCategory}" no momento.
              </p>
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
    </div>
  );
};

export default EmployeesPage;

