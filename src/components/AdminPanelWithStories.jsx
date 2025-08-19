import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Upload, Heart, User, Briefcase } from 'lucide-react';
import { playersService, storiesService, storageService, utils, employeesService } from '../services/firebaseService';
import PlayerForm from './PlayerForm';
import PlayerStoryForm from './PlayerStoryForm';
import EmployeeForm from './EmployeeForm';

const AdminPanelWithStories = ({ onBackToPublic }) => {
  const [activeTab, setActiveTab] = useState('players');
  const [players, setPlayers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [error, setError] = useState('');

  const categories = ['Sub20', 'Sub17', 'Sub16', 'Sub15', 'Sub14'];
  const functions = ['Monitor', 'Assistente Social', 'Pedagoga'];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const playersData = await playersService.getAll();
      setPlayers(playersData);
      
      if (activeTab === 'employees') {
        const employeesData = await employeesService.getAll();
        setEmployees(employeesData);
      }
      
      if (activeTab === 'stories') {
        const storiesData = await storiesService.getAll();
        setStories(storiesData);
      }
    } catch (error) {
      setError('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Funções para jogadores
  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setShowPlayerForm(true);
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setShowPlayerForm(true);
  };

  const handleDeletePlayer = async (player) => {
    if (!window.confirm(`Tem certeza que deseja remover ${player.name}?`)) {
      return;
    }

    try {
      if (player.photoData) {
        await storageService.deletePlayerPhoto(player.photoData);
      }
      await playersService.delete(player.id);
      await loadData();
    } catch (error) {
      setError('Erro ao remover jogador');
      console.error(error);
    }
  };

  const handlePlayerFormSubmit = async (playerData) => {
    try {
      if (editingPlayer) {
        await playersService.update(editingPlayer.id, playerData);
      } else {
        await playersService.add(playerData);
      }
      setShowPlayerForm(false);
      setEditingPlayer(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
      throw error;
    }
  };

  // Funções para funcionários
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (!window.confirm(`Tem certeza que deseja remover ${employee.name}?`)) {
      return;
    }

    try {
      if (employee.photoData) {
        await storageService.deletePlayerPhoto(employee.photoData);
      }
      await employeesService.delete(employee.id);
      await loadData();
    } catch (error) {
      setError('Erro ao remover funcionário');
      console.error(error);
    }
  };

  const handleEmployeeFormSubmit = async (employeeData) => {
    try {
      if (editingEmployee) {
        await employeesService.update(editingEmployee.id, employeeData);
      } else {
        await employeesService.add(employeeData);
      }
      setShowEmployeeForm(false);
      setEditingEmployee(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      throw error;
    }
  };

  // Funções para histórias
  const handleAddStory = () => {
    setEditingStory(null);
    setShowStoryForm(true);
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
    setShowStoryForm(true);
  };

  const handleDeleteStory = async (story) => {
    const player = players.find(p => p.id === story.playerId);
    const playerName = player ? player.name : 'este jogador';
    
    if (!window.confirm(`Tem certeza que deseja remover a história de ${playerName}?`)) {
      return;
    }

    try {
      await storiesService.delete(story.id);
      await loadData();
    } catch (error) {
      setError('Erro ao remover história');
      console.error(error);
    }
  };

  const handleStoryFormSubmit = async (storyData) => {
    try {
      if (editingStory) {
        await storiesService.update(editingStory.id, storyData);
      } else {
        await storiesService.add(storyData);
      }
      setShowStoryForm(false);
      setEditingStory(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar história:', error);
      throw error;
    }
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (player.fullName && player.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || player.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.fullName && employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || employee.function === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredStories = stories.filter(story => {
    const player = players.find(p => p.id === story.playerId);
    if (!player) return false;
    
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (player.fullName && player.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || player.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E5050F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Painel Administrativo</h2>
              <div className="flex items-center space-x-4">
                {activeTab === 'players' && (
                  <button
                    onClick={handleAddPlayer}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C20C18] transition-colors"
                  >
                    <Plus size={20} />
                    <span>Adicionar Jogador</span>
                  </button>
                )}
                {activeTab === 'employees' && (
                  <button
                    onClick={handleAddEmployee}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C20C18] transition-colors"
                  >
                    <Plus size={20} />
                    <span>Adicionar Funcionário</span>
                  </button>
                )}
                {activeTab === 'stories' && (
                  <button
                    onClick={handleAddStory}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C20C18] transition-colors"
                  >
                    <Plus size={20} />
                    <span>Adicionar História</span>
                  </button>
                )}
                <button
                  onClick={onBackToPublic}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Voltar ao Site
                </button>
              </div>
            </div>
          </div>

          {/* Sistema de Abas */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('players')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'players'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User size={16} />
                Gerenciar Jogadores
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'employees'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Briefcase size={16} />
                Gerenciar Funcionários
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'stories'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Heart size={16} />
                Gerenciar Histórias
              </button>
            </nav>
          </div>

          {/* Filtros */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                >
                  {activeTab === 'employees' ? (
                    <>
                      <option value="">Todas as funções</option>
                      {functions.map(func => (
                        <option key={func} value={func}>{func}</option>
                      ))}
                    </>
                  ) : (
                    <>
                      <option value="">Todas as categorias</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Conteúdo das Abas */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {activeTab === 'players' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Jogadores ({filteredPlayers.length})
                  </h3>
                </div>

                {filteredPlayers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum jogador encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlayers.map(player => (
                      <div key={player.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {player.photoData?.url || player.photoUrl ? (
                              <img
                                src={player.photoData?.url || player.photoUrl}
                                alt={player.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="text-gray-400" size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{player.name}</h3>
                            <p className="text-sm text-gray-600">{player.position || 'Posição não informada'}</p>
                            <p className="text-sm text-gray-600">{player.category}</p>
                            <p className="text-xs text-gray-500">
                              {player.birthplace || 'Local não informado'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditPlayer(player)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'employees' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Funcionários ({filteredEmployees.length})
                  </h3>
                </div>

                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum funcionário encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map(employee => (
                      <div key={employee.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {employee.photoData?.url || employee.photoUrl ? (
                              <img
                                src={employee.photoData?.url || employee.photoUrl}
                                alt={employee.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Briefcase className="text-gray-400" size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{employee.name}</h3>
                            <p className="text-sm text-gray-600">{employee.function || 'Função não informada'}</p>
                            <p className="text-sm text-gray-600">Mat: {employee.registration || 'Não informada'}</p>
                            <p className="text-xs text-gray-500">
                              {employee.birthplace || 'Local não informado'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stories' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Histórias ({filteredStories.length})
                  </h3>
                </div>

                {filteredStories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma história encontrada</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStories.map(story => {
                      const player = players.find(p => p.id === story.playerId);
                      return (
                        <div key={story.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {story.familyPhotoUrl ? (
                                <img
                                  src={story.familyPhotoUrl}
                                  alt={`Família de ${player?.name}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Heart className="text-gray-400" size={24} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {player ? player.name : 'Jogador não encontrado'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {player ? player.category : 'Categoria não informada'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {story.storyText.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditStory(story)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteStory(story)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remover"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulário de jogador */}
      {showPlayerForm && (
        <PlayerForm
          player={editingPlayer}
          onSubmit={handlePlayerFormSubmit}
          onCancel={() => {
            setShowPlayerForm(false);
            setEditingPlayer(null);
          }}
        />
      )}

      {/* Formulário de funcionário */}
      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleEmployeeFormSubmit}
          onCancel={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {/* Formulário de história */}
      {showStoryForm && (
        <PlayerStoryForm
          story={editingStory}
          onSubmit={handleStoryFormSubmit}
          onCancel={() => {
            setShowStoryForm(false);
            setEditingStory(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanelWithStories;

