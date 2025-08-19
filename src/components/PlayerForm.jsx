import { useState, useEffect } from 'react';
import { X, Upload, User } from 'lucide-react';
import { utils, storageService } from '../services/firebaseService';

const PlayerForm = ({ player, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    birthDate: '',
    position: '',
    admissionDate: '',
    school: '',
    year: '',
    birthplace: '',
    room: '',
    medicalObservations: '',
    category: 'Sub20',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const categories = ['Sub20', 'Sub17', 'Sub16', 'Sub15', 'Sub14'];
  const positions = [
    'Goleiro',
    'Lateral-direito',
    'Lateral-esquerdo',
    'Zagueiro',
    'Volante',
    'Meio-campo',
    'Meia-atacante',
    'Ponta-direita',
    'Ponta-esquerda',
    'Atacante',
    'Centroavante'
  ];

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        fullName: player.fullName || '',
        birthDate: player.birthDate || '',
        position: player.position || '',
        admissionDate: player.admissionDate || '',
        school: player.school || '',
        year: player.year || '',
        birthplace: player.birthplace || '',
        room: player.room || '',
        medicalObservations: player.medicalObservations || '',
        category: player.category || 'Sub20',
        emergencyContactName: player.emergencyContactName || '',
        emergencyContactPhone: player.emergencyContactPhone || ''
      });
      setPhotoPreview(player.photoUrl || '');
    }
  }, [player]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors(['Por favor, selecione apenas arquivos de imagem']);
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(['A imagem deve ter no máximo 5MB']);
        return;
      }

      setPhotoFile(file);
      console.log("File selected in PlayerForm:", file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      // Validar dados
      const validationErrors = utils.validatePlayerData(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      let playerPhotoData = null;
      if (photoFile) {
        try {
          playerPhotoData = await storageService.uploadPlayerPhoto(photoFile, utils.generateUploadId());
        } catch (photoError) {
          console.error('Erro no upload da foto:', photoError);
          setErrors(['Erro ao fazer upload da foto. Tente novamente.']);
          setLoading(false);
          return;
        }
      } else if (player && player.photoData) {
        playerPhotoData = player.photoData;
      }

      const finalPlayerData = {
        ...formData,
        photoData: playerPhotoData,
        photoUrl: playerPhotoData ? playerPhotoData.url : null
      };

      await onSubmit(finalPlayerData);
    } catch (error) {
      setErrors(['Erro ao salvar jogador']);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {player ? 'Editar Jogador' : 'Adicionar Jogador'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Upload de foto */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto do Jogador
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload size={20} />
                  <span>Selecionar Foto</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG ou WEBP. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome da Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Foto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nome que aparecerá na foto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                required
              />
            </div>

            {/* Nome Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nome completo do atleta"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                required
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
              />
            </div>

            {/* Posição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posição
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
              >
                <option value="">Selecione uma posição</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            {/* Admissão no Alojamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admissão no Alojamento
              </label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
              />
            </div>

            {/* Escola */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escola
              </label>
              <select
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
              >
                <option value="">Selecione uma escola</option>
                <option value="Escola São Francisco Turno - Manhã">Escola São Francisco Turno - Manhã</option>
                <option value="Escola Estadual Padre Léo - Turno Manhã">Escola Estadual Padre Léo - Turno Manhã</option>
                <option value="E.E.E.B Gentil Viegas Cardoso - Turno Noite">E.E.E.B Gentil Viegas Cardoso - Turno Noite</option>
                <option value="E.E.E.B Júlio Cesar - Turno Noite">E.E.E.B Júlio Cesar - Turno Noite</option>
                <option value="E.M.E.F Professor Juliano Nascimento - Turno Noite">E.M.E.F Professor Juliano Nascimento - Turno Noite</option>
              </select>
            </div>

            {/* Ano que Estuda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano que Estuda
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
              >
                <option value="">Selecione o ano</option>
                <option value="6º Ano EF">6º Ano EF</option>
                <option value="7º Ano EF">7º Ano EF</option>
                <option value="8º Ano EF">8º Ano EF</option>
                <option value="9º Ano EF">9º Ano EF</option>
                <option value="1º Ano EM">1º Ano EM</option>
                <option value="2º Ano EM">2º Ano EM</option>
                <option value="3º Ano EM">3º Ano EM</option>
              </select>
            </div>

            {/* Naturalidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naturalidade
              </label>
              <input
                type="text"
                name="birthplace"
                value={formData.birthplace}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
              />
            </div>

            {/* Quarto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quarto
              </label>
              <select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
              >
                <option value="">Selecione o quarto</option>
                {Array.from({ length: 20 }, (_, i) => {
                  const roomNumber = String(i + 1).padStart(2, '0');
                  return (
                    <option key={roomNumber} value={roomNumber}>
                      {roomNumber}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Contato dos Responsáveis para Emergência */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato dos Responsáveis para Emergência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome do Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Nome completo do responsável"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                />
              </div>

              {/* Telefone do Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone do Responsável
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  placeholder="(xx) 9xxxx-xxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Observações Médicas */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações Médicas (Alergias, medicamentos, etc.)
            </label>
            <textarea
              name="medicalObservations"
              value={formData.medicalObservations}
              onChange={handleInputChange}
              rows={3}
              placeholder="Descreva alergias a medicamentos, condições médicas especiais ou outras observações relevantes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent resize-vertical"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
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
              className="px-6 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C20C18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : (player ? 'Atualizar' : 'Adicionar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerForm;

