import { useState, useEffect } from 'react';
import { X, Upload, User, Trash2 } from 'lucide-react';
import { personnelUtils, personnelStorageService } from '../services/personnelService';

const PersonnelForm = ({ person, onSubmit, onCancel, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    birthDate: '',
    type: '',
    registration: '',
    admissionDate: '',
    education: '',
    yearField: '',
    birthplace: '',
    bloodType: '',
    medicalObservations: '',
    healthPlan: '',
    healthPlanOther: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    assignments: []
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  const types = personnelUtils.getAvailableTypes();
  const assignments = personnelUtils.getAvailableAssignments();
  const educationLevels = [
    'Ensino Fundamental',
    'Ensino Médio',
    'Curso Técnico',
    'Superior Incompleto',
    'Superior Completo',
    'MBA',
    'Mestrado',
    'Doutorado'
  ];
  const bloodTypes = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];
  const healthPlans = ['Unimed', 'Outros'];

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || '',
        fullName: person.fullName || '',
        birthDate: person.birthDate || '',
        type: person.type || '',
        registration: person.registration || '',
        admissionDate: person.admissionDate || '',
        education: person.education || '',
        yearField: person.yearField || '',
        birthplace: person.birthplace || '',
        bloodType: person.bloodType || '',
        medicalObservations: person.medicalObservations || '',
        healthPlan: person.healthPlan || '',
        healthPlanOther: person.healthPlanOther || '',
        emergencyContactName: person.emergencyContactName || '',
        emergencyContactPhone: person.emergencyContactPhone || '',
        assignments: person.assignments || []
      });
      
      if (person.photoData?.url || person.photoUrl) {
        setPhotoPreview(person.photoData?.url || person.photoUrl);
      }
    }
  }, [person]);

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
      // Validar arquivo
      const validationErrors = personnelUtils.validateImageFile(file);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setPhotoFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setErrors([]);
    }
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Tem certeza que deseja remover a foto?')) {
      // Marcar foto atual para deleção se existir
      if (person && person.photoData) {
        setPhotoToDelete(person.photoData);
      }
      
      // Limpar preview e arquivo
      setPhotoPreview('');
      setPhotoFile(null);
      
      // Limpar input de arquivo
      const fileInput = document.getElementById('photo-upload');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Validar dados básicos
      const validationErrors = personnelUtils.validatePersonnelData(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      let personnelData = { ...formData };

      // Deletar foto antiga se marcada para deleção
      if (photoToDelete) {
        try {
          await personnelStorageService.deletePhoto(photoToDelete);
        } catch (photoError) {
          console.error('Erro ao deletar foto antiga:', photoError);
          // Continuar mesmo se a deleção falhar
        }
      }

      // Upload da nova foto se houver
      if (photoFile) {
        try {
          const photoData = await personnelStorageService.uploadPhoto(photoFile, personnelUtils.generateUploadId());
          personnelData.photoData = photoData;
        } catch (photoError) {
          console.error('Erro no upload da foto:', photoError);
          setErrors(['Erro ao fazer upload da foto. Tente novamente.']);
          setLoading(false);
          return;
        }
      } else if (!photoToDelete && person && person.photoData) {
        // Manter foto existente se não houver nova foto e não foi marcada para deleção
        personnelData.photoData = person.photoData;
      } else {
        // Remover dados da foto se foi marcada para deleção
        personnelData.photoData = null;
      }

      await onSubmit(personnelData);
    } catch (error) {
      console.error('Erro ao salvar pessoal:', error);
      setErrors(['Erro ao salvar dados. Tente novamente.']);
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    if (mode === 'edit' && person) {
      return `Editar ${person.type || 'Pessoa'}`;
    }
    return 'Adicionar Pessoa';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {getFormTitle()}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium mb-2">Erros encontrados:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Seção Foto */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Foto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Foto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  placeholder="Nome que aparecerá na foto"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Foto
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    <Upload size={16} />
                    <span>Escolher Arquivo</span>
                  </label>
                  
                  {photoPreview && (
                    <div className="relative">
                      <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remover foto"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Seção Tipo e Atribuições */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tipo e Atribuições</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atribuições (Postos/Setores)
                </label>
                <div className="space-y-2">
                  {assignments.map(assignment => (
                    <label key={assignment} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.assignments.includes(assignment)}
                        onChange={() => handleAssignmentChange(assignment)}
                        className="mr-2"
                      />
                      <span className="text-sm">{assignment}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção Dados Pessoais */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local de Nascimento
                </label>
                <input
                  type="text"
                  name="birthplace"
                  value={formData.birthplace}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  placeholder="Cidade, Estado"
                />
              </div>
            </div>
          </div>

          {/* Seção Dados Profissionais */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Profissionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matrícula
                </label>
                <input
                  type="text"
                  name="registration"
                  value={formData.registration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  placeholder="Número da matrícula"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Admissão
                </label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Seção Dados Acadêmicos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Acadêmicos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escolaridade
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                >
                  <option value="">Selecione a escolaridade</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campo Adicional (A definir)
                </label>
                <input
                  type="text"
                  name="yearField"
                  value={formData.yearField}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  placeholder="A ser definido"
                />
              </div>
            </div>
          </div>

          {/* Seção Dados Hospitalares */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Hospitalares</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Possui Plano Hospitalar
                </label>
                <select
                  name="healthPlan"
                  value={formData.healthPlan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                >
                  <option value="">Selecione o plano</option>
                  {healthPlans.map(plan => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>

              {formData.healthPlan === 'Outros' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especificar Plano
                  </label>
                  <input
                    type="text"
                    name="healthPlanOther"
                    value={formData.healthPlanOther}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                    placeholder="Nome do plano de saúde"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fator RH e Tipo Sanguíneo
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                >
                  <option value="">Selecione o tipo sanguíneo</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção Observações Médicas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Observações Médicas</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                name="medicalObservations"
                value={formData.medicalObservations}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                placeholder="Observações médicas relevantes..."
              />
            </div>
          </div>

          {/* Seção Contato de Emergência */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contato de Emergência</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Contato
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone do Contato
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#E5050F] text-white rounded-lg hover:bg-[#C5040E] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (mode === 'edit' ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonnelForm;

