import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Upload } from 'lucide-react';
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

  const categories = ['Especiais', 'Agentes'];

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
      
      // Deletar jogador
      await playersService.delete(player.id);
      
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

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
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
                <button
                  onClick={handleAddPlayer}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C20C18] transition-colors"
                >
                  <Plus size={20} />
                  <span>Adicionar Especiais</span>
                </button>
                <button
                  onClick={onBackToPublic}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Voltar ao Site
                </button>
              </div>
            </div>
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
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Lista de jogadores */}
          <div className="p-6">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm || selectedCategory ? 'Nenhum jogador encontrado com os filtros aplicados.' : 'Nenhum jogador cadastrado.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlayers.map((player) => (
                  <div key={player.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {player.photoUrl || player.photoData?.url ? (
                          <img 
                            src={player.photoData?.url || player.photoUrl} 
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Upload size={20} />
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
        </div>
      </div>

      {/* Formulário de jogador */}
      {showForm && (
        <PlayerForm
          player={editingPlayer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPlayer(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;

