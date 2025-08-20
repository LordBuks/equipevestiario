import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Upload, Users, Filter, Grid, List, Menu, X } from 'lucide-react';
import { playersService, storageService, utils } from '../services/firebaseService';
import PlayerForm from './PlayerForm';

const AdminPanel = ({ onBackToPublic }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid ou list
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = ['Especial', 'Agente']; // Padronizando para 'Especial' e 'Agente'

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const playersData = await playersService.getAll();
      setPlayers(playersData);
    } catch (error) {
      setError('Erro ao carregar jogadores');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setShowForm(true);
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleDeletePlayer = async (player) => {
    if (!window.confirm(`Tem certeza que deseja remover ${player.name}?`)) {
      return;
    }

    try {
      // Deletar foto se existir
      if (player.photoData) {
        await storageService.deletePlayerPhoto(player.photoData);
      }
      
      // Deletar jogador, passando a categoria para saber de qual coleção remover
      await playersService.delete(player.id, player.category);
      
      // Recarregar lista
      await loadPlayers();
    } catch (error) {
      setError('Erro ao remover jogador');
      console.error(error);
    }
  };

  const handleFormSubmit = async (playerData) => {
    try {
      const playerWithPhoto = { ...playerData };

      if (editingPlayer) {
        // Atualizar jogador existente
        await playersService.update(editingPlayer.id, playerWithPhoto);
      } else {
        // Adicionar novo jogador
        await playersService.add(playerWithPhoto);
      }

      // Recarregar lista e fechar formulário
      await loadPlayers();
      setShowForm(false);
      setEditingPlayer(null);
    } catch (error) {
      setError('Erro ao salvar jogador');
      console.error(error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || player.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#E5050F] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-red-200 border-t-transparent rounded-full animate-spin absolute top-2 left-2"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium text-sm sm:text-base">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header com gradiente - Responsivo */}
        <div className="bg-gradient-to-r from-[#E5050F] to-[#C20C18] rounded-xl sm:rounded-2xl shadow-2xl mb-6 sm:mb-8">
          <div className="px-4 sm:px-8 py-4 sm:py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">Painel Administrativo</h1>
                <p className="text-red-100 mt-1 sm:mt-2 text-sm sm:text-base hidden sm:block">
                  Gerencie pessoas, visualize dados e controle o sistema
                </p>
                <div className="flex items-center mt-2 sm:mt-4 space-x-3 sm:space-x-6">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{filteredPlayers.length} pessoas</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Sistema ativo</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 ml-2">
                {/* Botão Adicionar - Mobile e Desktop */}
                <button
                  onClick={handleAddPlayer}
                  className="flex items-center space-x-1 sm:space-x-3 px-3 sm:px-6 py-2 sm:py-3 bg-white text-[#E5050F] rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium shadow-lg transform hover:scale-105 text-sm sm:text-base"
                >
                  <Plus size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Adicionar Pessoa</span>
                  <span className="sm:hidden">Adicionar</span>
                </button>
                {/* Botão Voltar - Desktop */}
                <button
                  onClick={onBackToPublic}
                  className="hidden sm:flex px-4 sm:px-6 py-2 sm:py-3 bg-white bg-opacity-20 text-[#E5050F] rounded-lg sm:rounded-xl hover:bg-opacity-30 transition-all duration-200 font-medium backdrop-blur-sm text-sm sm:text-base"
                >
                  Voltar ao Site
                </button>
                {/* Menu Mobile */}
                <button
                  onClick={onBackToPublic}
                  className="sm:hidden p-2 bg-white bg-opacity-20 text-red rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
                >
                  <Menu size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controles e filtros - Responsivo */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-6 sm:mb-8 border border-gray-100">
          <div className="p-4 sm:p-6">
            {/* Barra de pesquisa sempre visível */}
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {/* Controles Mobile/Desktop */}
              <div className="flex items-center justify-between">
                {/* Filtros Desktop */}
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Todas as categorias</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botão Filtros Mobile */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="sm:hidden flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                >
                  <Filter size={16} />
                  <span className="text-sm">Filtros</span>
                </button>
                
                {/* Controle de visualização */}
                <div className="flex items-center bg-gray-100 rounded-lg sm:rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-[#E5050F] shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid size={16} className="sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-[#E5050F] shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List size={16} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Filtros Mobile Expandidos */}
              {showMobileFilters && (
                <div className="sm:hidden border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Todas as categorias</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mensagem de erro - Responsivo */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl mx-3 sm:mx-0">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              <span className="text-red-700 font-medium text-sm sm:text-base">{error}</span>
            </div>
          </div>
        )}

        {/* Lista de pessoas - Responsivo */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
          <div className="p-3 sm:p-6">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || selectedCategory ? 'Nenhuma pessoa encontrada' : 'Nenhuma pessoa cadastrada'}
                </h3>
                <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                  {searchTerm || selectedCategory 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece adicionando a primeira pessoa ao sistema.'
                  }
                </p>
                {!searchTerm && !selectedCategory && (
                  <button
                    onClick={handleAddPlayer}
                    className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#E5050F] text-white rounded-lg sm:rounded-xl hover:bg-[#C5040E] transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    <Plus size={18} className="sm:w-5 sm:h-5" />
                    <span>Adicionar Primeira Pessoa</span>
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6" 
                : "space-y-3 sm:space-y-4"
              }>
                {filteredPlayers.map((player) => (
                  <div 
                    key={player.id} 
                    className={`bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${
                      viewMode === 'list' ? 'flex items-center p-3 sm:p-4' : 'p-4 sm:p-6'
                    }`}
                  >
                    <div className={`flex ${viewMode === 'list' ? 'items-center space-x-3 sm:space-x-4 flex-1' : 'items-start space-x-3 sm:space-x-4'}`}>
                      <div className={`bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 ${
                        viewMode === 'list' ? 'w-12 h-16 sm:w-16 sm:h-20' : 'w-16 h-20 sm:w-20 sm:h-24'
                      }`}>
                        {player.photoUrl || player.photoData?.url ? (
                          <img 
                            src={player.photoData?.url || player.photoUrl} 
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Users size={viewMode === 'list' ? 16 : 20} className="sm:w-6 sm:h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-sm sm:text-lg">{player.name}</h3>
                        <div className="space-y-1 mt-1 sm:mt-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              player.category === 'Especial' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {player.category}
                            </span>
                          </div>
                          {player.position && (
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{player.position}</p>
                          )}
                          {player.birthplace && (
                            <p className="text-xs text-gray-500 truncate">{player.birthplace}</p>
                          )}
                          {player.assignments && player.assignments.length > 0 && (
                            <p className="text-xs text-gray-500 truncate">
                              {player.assignments.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditPlayer(player)}
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Formulário de Adição/Edição */}
        {showForm && (
          <PlayerForm
            player={editingPlayer}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

