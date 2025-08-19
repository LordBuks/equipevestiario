import { useState, useEffect } from 'react';
import { X, Upload, User, Heart } from 'lucide-react';
import { playersService, storiesService, storageService } from '../services/firebaseService';

const PlayerStoryForm = ({ story, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    playerId: '',
    storyText: '',
    familyPhotoUrl: '',
    photoPhrase: ''
  });
  const [familyPhotoFile, setFamilyPhotoFile] = useState(null);
  const [familyPhotoPreview, setFamilyPhotoPreview] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    loadPlayers();
  }, []);

  // useEffect separado para lidar com mudanças na story
  useEffect(() => {
    if (story) {
      console.log('Story recebida:', story);
      const newFormData = {
        playerId: story.playerId || '',
        storyText: story.storyText || '',
        familyPhotoUrl: story.familyPhotoUrl || '',
        photoPhrase: story.photoPhrase || ''
      };
      console.log('FormData definido:', newFormData);
      setFormData(newFormData);
      setFamilyPhotoPreview(story.familyPhotoUrl || '');
      
      if (story.playerId && players.length > 0) {
        const player = players.find(p => p.id === story.playerId);
        setSelectedPlayer(player);
      }
    } else {
      // Reset form quando não há story (modo de criação)
      setFormData({
        playerId: '',
        storyText: '',
        familyPhotoUrl: '',
        photoPhrase: ''
      });
      setFamilyPhotoPreview('');
      setSelectedPlayer(null);
    }
  }, [story, players]);

  const loadPlayers = async () => {
    try {
      const playersData = await playersService.getAll();
      setPlayers(playersData);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
      setErrors(['Erro ao carregar lista de jogadores']);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo ${name} alterado para:`, value);
    
    setFormData(prevFormData => {
      const newFormData = {
        ...prevFormData,
        [name]: value
      };
      console.log('Novo formData:', newFormData);
      return newFormData;
    });

    if (name === 'playerId') {
      const player = players.find(p => p.id === value);
      setSelectedPlayer(player);
    }
  };

  const handleFamilyPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar arquivo
      const validationErrors = storageService.validateImageFile ? 
        storageService.validateImageFile(file) : [];
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setFamilyPhotoFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFamilyPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (!formData.playerId) {
      newErrors.push('Selecione um jogador');
    }
    
    if (!formData.storyText || formData.storyText.trim().length < 10) {
      newErrors.push('A história deve ter pelo menos 10 caracteres');
    }
    
    if (!familyPhotoFile && !formData.familyPhotoUrl) {
      newErrors.push('Adicione uma foto da família');
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors([]);
    
    try {
      let familyPhotoUrl = formData.familyPhotoUrl;
      
      // Upload da foto da família se houver um novo arquivo
      if (familyPhotoFile) {
        const photoResult = await storageService.uploadPlayerPhoto(familyPhotoFile, formData.playerId);
        familyPhotoUrl = photoResult.url;
      }
      
      const storyData = {
        ...formData,
        familyPhotoUrl
      };
      
      console.log('Dados sendo enviados:', storyData);
      await onSubmit(storyData);
    } catch (error) {
      console.error('Erro ao salvar história:', error);
      setErrors(['Erro ao salvar história. Tente novamente.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="text-red-500" />
            {story ? 'Editar História' : 'Adicionar História'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <ul className="text-red-700 text-sm">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seleção do Jogador */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jogador *
              </label>
              <select
                name="playerId"
                value={formData.playerId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Selecione um jogador</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} - {player.category}
                  </option>
                ))}
              </select>
              {selectedPlayer && (
                <p className="mt-1 text-sm text-gray-600">
                  Jogador selecionado: {selectedPlayer.fullName || selectedPlayer.name}
                </p>
              )}
            </div>

            {/* Upload da Foto da Família */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto da Família *
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFamilyPhotoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Formatos aceitos: JPG, PNG, WebP (máx. 5MB)
                  </p>
                </div>
                {familyPhotoPreview && (
                  <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={familyPhotoPreview}
                      alt="Preview da foto da família"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* História */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                História do Atleta *
              </label>
              <textarea
                name="storyText"
                value={formData.storyText}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Conte a história do atleta, sua trajetória, sonhos, desafios superados..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Mínimo de 10 caracteres. Conte uma história inspiradora sobre o atleta.
              </p>
            </div>

            {/* Frase da Foto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frase da Foto
              </label>
              <input
                type="text"
                name="photoPhrase"
                value={formData.photoPhrase}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Digite uma frase que defina o atleta (aparecerá na foto da família)..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Esta frase aparecerá como citação na foto da família do atleta.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C20C18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Heart size={16} />
                  {story ? 'Atualizar História' : 'Salvar História'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerStoryForm;

