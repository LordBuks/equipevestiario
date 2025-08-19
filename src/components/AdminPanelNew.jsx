import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Upload, Heart, User, Briefcase } from 'lucide-react';
import { storiesService } from '../services/firebaseService';
import PersonnelForm from './PersonnelForm';
import PlayerStoryForm from './PlayerStoryForm';
import { usePersonnel } from '../hooks/usePersonnel';

const AdminPanelNew = ({ onBackToPublic }) => {
  const [activeTab, setActiveTab] = useState('personnel');
  const { 
    personnel, 
    loading: personnelLoading, 
    error: personnelError,
    getPersonnelByType,
    addPersonnel,
    updatePersonnel,
    deletePersonnel
  } = usePersonnel();
  
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showPersonnelForm, setShowPersonnelForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [error, setError] = useState('');

  const types = ['Especiais', 'Agentes', 'Monitores'];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
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

  // Filtrar pessoal baseado na busca e tipo
  const getFilteredPersonnel = () => {
    let filtered = personnel;
    
    if (selectedType) {
      filtered = getPersonnelByType(selectedType);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.registration && person.registration.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  // Filtrar histórias baseado na busca
  const getFilteredStories = () => {
    if (!searchTerm) return stories;
    
    return stories.filter(story =>
      story.playerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleAddPersonnel = () => {
    setEditingPersonnel(null);
    setShowPersonnelForm(true);
  };

  const handleEditPersonnel = (person) => {
    setEditingPersonnel(person);
    setShowPersonnelForm(true);
  };

  const handleDeletePersonnel = async (person) => {
    if (window.confirm(`Tem certeza que deseja excluir ${person.name}?`)) {
      try {
        await deletePersonnel(person.id);
      } catch (error) {
        setError('Erro ao excluir pessoa');
        console.error(error);
      }
    }
  };

  const handlePersonnelSubmit = async (personnelData) => {
    try {
      if (editingPersonnel) {
        await updatePersonnel(editingPersonnel.id, personnelData);
      } else {
        await addPersonnel(personnelData);
      }
      setShowPersonnelForm(false);
      setEditingPersonnel(null);
    } catch (error) {
      setError('Erro ao salvar pessoa');
      console.error(error);
    }
  };

  const handleAddStory = () => {
    setEditingStory(null);
    setShowStoryForm(true);
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
    setShowStoryForm(true);
  };

  const handleDeleteStory = async (story) => {
    if (window.confirm('Tem certeza que deseja excluir esta história?')) {
      try {
        await storiesService.delete(story.id);
        await loadData();
      } catch (error) {
        setError('Erro ao excluir história');
        console.error(error);
      }
    }
  };

  const handleStorySubmit = async (storyData) => {
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
      setError('Erro ao salvar história');
      console.error(error);
    }
  };

  if (personnelLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E5050F] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie pessoal e histórias</p>
            </div>
            <button
              onClick={onBackToPublic}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voltar ao Site
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('personnel')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'personnel'
                  ? 'border-[#E5050F] text-[#E5050F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>Pessoal</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stories'
                  ? 'border-[#E5050F] text-[#E5050F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart size={16} />
                <span>Histórias</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Personnel Tab */}
        {activeTab === 'personnel' && (
          <div>
            {/* Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Pesquisar pessoal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                >
                  <option value="">Todos os tipos</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddPersonnel}
                className="flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C5040E] transition-colors"
              >
                <Plus size={20} />
                <span>Adicionar Pessoa</span>
              </button>
            </div>

            {/* Personnel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredPersonnel().map((person) => (
                <div key={person.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                    {person.photoData?.url || person.photoUrl ? (
                      <img
                        src={person.photoData?.url || person.photoUrl}
                        alt={person.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <User className="text-gray-400" size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{person.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {person.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 truncate">{person.fullName}</p>
                    {person.assignments && person.assignments.length > 0 && (
                      <p className="text-xs text-blue-600 mb-3">
                        {person.assignments.join(', ')}
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPersonnel(person)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Edit size={14} />
                        <span className="text-sm">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeletePersonnel(person)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span className="text-sm">Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredPersonnel().length === 0 && (
              <div className="text-center py-12">
                <User className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pessoa encontrada</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedType ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando uma nova pessoa.'}
                </p>
                <button
                  onClick={handleAddPersonnel}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C5040E] transition-colors"
                >
                  <Plus size={20} />
                  <span>Adicionar Primeira Pessoa</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div>
            {/* Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar histórias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAddStory}
                className="flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C5040E] transition-colors"
              >
                <Plus size={20} />
                <span>Adicionar História</span>
              </button>
            </div>

            {/* Stories List */}
            <div className="space-y-4">
              {getFilteredStories().map((story) => (
                <div key={story.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {story.playerName || 'História sem nome'}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {story.content || 'Sem conteúdo'}
                      </p>
                      <div className="text-sm text-gray-500">
                        Criado em: {story.createdAt ? new Date(story.createdAt.toDate()).toLocaleDateString('pt-BR') : 'Data não disponível'}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditStory(story)}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Edit size={14} />
                        <span className="text-sm">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span className="text-sm">Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredStories().length === 0 && (
              <div className="text-center py-12">
                <Heart className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma história encontrada</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Tente ajustar o termo de busca.' : 'Comece adicionando uma nova história.'}
                </p>
                <button
                  onClick={handleAddStory}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C5040E] transition-colors"
                >
                  <Plus size={20} />
                  <span>Adicionar Primeira História</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showPersonnelForm && (
        <PersonnelForm
          person={editingPersonnel}
          onSubmit={handlePersonnelSubmit}
          onCancel={() => {
            setShowPersonnelForm(false);
            setEditingPersonnel(null);
          }}
          mode={editingPersonnel ? 'edit' : 'add'}
        />
      )}

      {showStoryForm && (
        <PlayerStoryForm
          story={editingStory}
          onSubmit={handleStorySubmit}
          onCancel={() => {
            setShowStoryForm(false);
            setEditingStory(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanelNew;

