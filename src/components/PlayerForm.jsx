import { useState, useEffect } from 'react';
import { X, Upload, User, Check, AlertCircle } from 'lucide-react';
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
    category: '', // Mantendo category para o tipo (Especial/Agente)
    emergencyContactName: '',
    emergencyContactPhone: '',
    assignments: [] // Adicionando campo de atribuições
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const categories = ['Especial', 'Agente']; // Padronizando para 'Especial' e 'Agente'
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
  const assignments = [
    'Escolta Visitante',
    'Escolta Futebol',
    'Escolta Familiares',
    'Escolta Direção',
    'Escolta Túnel'
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
        category: player.category || '', // Usar category para o tipo
        emergencyContactName: player.emergencyContactName || '',
        emergencyContactPhone: player.emergencyContactPhone || '',
        assignments: player.assignments || [] // Carregar atribuições existentes
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

  const handleAssignmentChange = (assignment) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.includes(assignment)
        ? prev.assignments.filter(a => a !== assignment)
        : [...prev.assignments, assignment]
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(['Por favor, selecione apenas arquivos de imagem']);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(['A imagem deve ter no máximo 5MB']);
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setErrors([]); // Limpar erros após seleção de foto válida
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[98vh] sm:max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header com gradiente - Responsivo */}
        <div className="bg-gradient-to-r from-[#E5050F] to-[#C20C18] text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl sticky top-0 z-10">
          <div className="flex justify-between items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold truncate">
                {player ? `Editar ${player.category}` : 'Adicionar Pessoa'}
              </h2>
              <p className="text-red-100 mt-1 text-sm sm:text-base hidden sm:block">
                Preencha os dados da pessoa para cadastro no sistema
              </p>
            </div>
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 transform hover:scale-110 ml-2 flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Mensagens de erro com melhor design - Responsivo */}
        {errors.length > 0 && (
          <div className="mx-3 sm:mx-6 mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Corrija os seguintes erros:
                </h3>
                <ul className="mt-2 text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-6 sm:space-y-8">
          {/* Upload de foto com design melhorado - Responsivo */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
            <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Foto da Pessoa
            </label>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <div className="w-24 h-32 sm:w-32 sm:h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  )}
                </div>
                {photoPreview && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#E5050F] hover:bg-red-50 transition-all duration-200 group"
                >
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-[#E5050F] transition-colors" />
                  <div className="text-center">
                    <span className="text-sm sm:text-base text-gray-600 group-hover:text-[#E5050F] font-medium">
                      Clique para selecionar uma foto
                    </span>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      JPG, PNG ou WEBP. Máximo 5MB.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Informações básicas - Responsivo */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <div className="w-2 h-4 sm:h-6 bg-[#E5050F] rounded-full mr-2 sm:mr-3"></div>
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Nome da Foto */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome da Foto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome que aparecerá na foto"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Nome Completo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nome completo da pessoa"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Categoria (Tipo) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Posição (Agora sempre visível) */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Posição
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                >
                  <option value="">Selecione uma posição</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              {/* Naturalidade */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Naturalidade
                </label>
                <input
                  type="text"
                  name="birthplace"
                  value={formData.birthplace}
                  onChange={handleInputChange}
                  placeholder="Cidade de nascimento"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Atribuições (Postos/Setores) - Responsivo */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <div className="w-2 h-4 sm:h-6 bg-[#E5050F] rounded-full mr-2 sm:mr-3"></div>
              Atribuições (Postos/Setores)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {assignments.map(assignment => (
                <label key={assignment} className="flex items-center p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={formData.assignments.includes(assignment)}
                    onChange={() => handleAssignmentChange(assignment)}
                    className="mr-2 sm:mr-3 w-3 h-3 sm:w-4 sm:h-4 text-[#E5050F] border-gray-300 rounded focus:ring-[#E5050F] focus:ring-2"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{assignment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Informações do Alojamento - Responsivo */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <div className="w-2 h-4 sm:h-6 bg-[#E5050F] rounded-full mr-2 sm:mr-3"></div>
              Informações do Alojamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Admissão no Alojamento */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Admissão no Alojamento
                </label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Quarto */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quarto
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  placeholder="Número do quarto"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Escola */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Escola
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="Nome da escola"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Ano Escolar */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ano Escolar
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Ano escolar"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Contato de Emergência - Responsivo */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <div className="w-2 h-4 sm:h-6 bg-[#E5050F] rounded-full mr-2 sm:mr-3"></div>
              Contato de Emergência
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Nome do Contato */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Contato *
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Nome do contato de emergência"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Telefone do Contato */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Telefone do Contato *
                </label>
                <input
                  type="text"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  placeholder="Telefone do contato de emergência"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Observações Médicas - Responsivo */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <div className="w-2 h-4 sm:h-6 bg-[#E5050F] rounded-full mr-2 sm:mr-3"></div>
              Observações Médicas
            </h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                name="medicalObservations"
                value={formData.medicalObservations}
                onChange={handleInputChange}
                placeholder="Informações médicas relevantes"
                rows="3"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
              ></textarea>
            </div>
          </div>

          {/* Botões de Ação - Responsivo */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 p-3 sm:p-6 pt-0">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#E5050F] text-white rounded-lg hover:bg-[#C20C18] transition-colors duration-200 font-medium text-sm sm:text-base"
              disabled={loading}
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


