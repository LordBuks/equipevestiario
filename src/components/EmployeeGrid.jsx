import EmployeeCard from './EmployeeCard';

const EmployeeGrid = ({ employees, onEmployeeClick }) => {
  if (employees.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-base">Nenhum funcionário encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-4">
      {employees.map((employee) => (
        <EmployeeCard 
          key={employee.id} 
          employee={employee} 
          onClick={onEmployeeClick}
        />
      ))}
    </div>
  );
};

export default EmployeeGrid;

