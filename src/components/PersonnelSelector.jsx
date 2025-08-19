import { useState, useEffect } from 'react';
import { X, Search, User } from 'lucide-react';

const PersonnelSelector = ({ isOpen, onClose, onSelect, availablePersonnel, assignment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);

  useEffect(() => {
    if (availablePersonnel) {
      const filtered = availablePersonnel.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.registration && person.registration.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPersonnel(filtered);
    }
  }, [availablePersonnel, searchTerm]);

  const handleSelect = (person) => {
    onSelect(person);
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Selecionar Agente para {assignment}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Barra de pesquisa */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Pesquisar por nome, nome completo ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de pessoal */}
          <div className="max-h-96 overflow-y-auto">
            {filteredPersonnel.length === 0 ? (
              <div className="text-center py-8">
                <User className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhuma pessoa encontrada com esse termo de busca.' : 'Nenhuma pessoa disponível para atribuição.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredPersonnel.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => handleSelect(person)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {/* Foto */}
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                      {person.photoData?.url || person.photoUrl ? (
                        <img
                          src={person.photoData?.url || person.photoUrl}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{person.name}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {person.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{person.fullName}</p>
                      {person.registration && (
                        <p className="text-xs text-gray-500">Matrícula: {person.registration}</p>
                      )}
                      {person.assignments && person.assignments.length > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Atribuições atuais: {person.assignments.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Indicador de seleção */}
                    <div className="ml-4">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#E5050F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredPersonnel.length} pessoa(s) disponível(is)
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelSelector;

