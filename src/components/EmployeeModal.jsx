import React, { useState, useEffect } from 'react';
import { storiesService } from '../services/firebaseService';
import PlayerStoryView from './PlayerStoryView';

const EmployeeModal = ({ employee, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [employeeStory, setEmployeeStory] = useState(null);
  const [loadingStory, setLoadingStory] = useState(false);

  useEffect(() => {
    if (isOpen && employee && activeTab === 'story') {
      loadEmployeeStory();
    }
  }, [isOpen, employee, activeTab]);

  const loadEmployeeStory = async () => {
    if (!employee?.id) return;
    
    setLoadingStory(true);
    try {
      // Usar o mesmo serviço de histórias, mas buscar por employeeId
      const story = await storiesService.getByPlayerId(employee.id);
      setEmployeeStory(story);
    } catch (error) {
      console.error('Erro ao carregar história do funcionário:', error);
      setEmployeeStory(null);
    } finally {
      setLoadingStory(false);
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-50"
        >
          ×
        </button>

        {/* Sistema de Abas */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 pt-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detalhes do Funcionário
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'story'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Minha História
            </button>
          </nav>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'details' && (
          <div className="p-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 p-6 pb-0">Detalhes do Funcionário</h2>
            
            {/* Seção de destaque com foto e nome estilizado - Responsiva */}
            <div className="relative h-auto md:h-96 overflow-hidden chelsea-hero-section">
              {/* Degradê branco suave para vermelho */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-[#E5050F] to-[#E5050F]"></div>
              
              {/* Sobrenomes BEM GRANDES com transparência no fundo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pl-40">
                {employee.name.split(" ").slice(1).map((namePart, index) => (
                  <h1
                    key={index}
                    className="text-white font-black select-none pointer-events-none leading-none tracking-tight"
                    style={{
                      fontSize: 'clamp(3rem, 9vw, 7rem)',
                      marginTop: index > 0 ? '-0.15em' : '0',
                      opacity: 0.4,
                      color: 'rgba(255, 255, 255, 0.5)',
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {namePart.toUpperCase()}
                  </h1>
                ))}
              </div>
              
              {/* Container para foto e primeiro nome (responsivo) */}
              <div className="relative flex flex-col md:flex-row items-start justify-start h-full">
                {/* Foto do funcionário - Colada na borda esquerda da div, no início do degradê */}
                <div className="w-auto md:w-80 flex justify-start items-end pt-8 md:pt-0 z-20 -ml-6 md:-ml-8"
                     style={{ height: '100%' }}>
                  {employee.photoData?.url || employee.photoUrl ? (
                    <img
                      src={employee.photoData?.url || employee.photoUrl}
                      alt={employee.name}
                      className="w-48 md:w-full h-auto object-contain"
                      style={{
                        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
                        backgroundColor: 'transparent',
                        mixBlendMode: 'normal',
                        maxHeight: '95%',
                        alignSelf: 'flex-end',
                        objectPosition: 'bottom'
                      }}
                    />
                  ) : (
                    <div className="w-48 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">Sem foto</span>
                    </div>
                  )}
                </div>
                
                {/* Primeiro nome - Posicionado sobre o segundo nome, seguindo o padrão dos atletas */}
                <div className="absolute z-10" style={{ top: 'calc(50% - 80px)', left: 'calc(50% - 160px)' }}>
                  <p className="text-white text-4xl md:text-5xl font-bold tracking-wider"
                     style={{
                       opacity: 0.9,
                       textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
                       letterSpacing: '0.05em'
                     }}>
                    {employee.name.split(' ')[0].toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações detalhadas */}
            <div className="p-6 space-y-6">
              {/* Dados Pessoais */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nome Completo:</span>
                    <p className="text-gray-600">{employee.fullName || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Data de Nascimento:</span>
                    <p className="text-gray-600">
                      {employee.birthDate ? new Date(employee.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Local de Nascimento:</span>
                    <p className="text-gray-600">{employee.birthplace || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Dados Profissionais */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dados Profissionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Função:</span>
                    <p className="text-gray-600">{employee.function || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Matrícula:</span>
                    <p className="text-gray-600">{employee.registration || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Dados Acadêmicos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dados Acadêmicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Escolaridade:</span>
                    <p className="text-gray-600">{employee.education || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Campo Adicional:</span>
                    <p className="text-gray-600">{employee.yearField || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Dados Hospitalares */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dados Hospitalares</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Plano de Saúde:</span>
                    <p className="text-gray-600">
                      {employee.healthPlan === 'Outros' && employee.healthPlanOther 
                        ? employee.healthPlanOther 
                        : employee.healthPlan || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo Sanguíneo:</span>
                    <p className="text-gray-600">{employee.bloodType || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Observações Médicas */}
              {employee.medicalObservations && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Observações Médicas</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{employee.medicalObservations}</p>
                </div>
              )}

              {/* Contato de Emergência */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contato de Emergência</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nome:</span>
                    <p className="text-gray-600">{employee.emergencyContactName || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Telefone:</span>
                    <p className="text-gray-600">{employee.emergencyContactPhone || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba Minha História */}
        {activeTab === 'story' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Minha História</h2>
            
            {loadingStory ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E5050F]"></div>
                <span className="ml-2 text-gray-600">Carregando história...</span>
              </div>
            ) : employeeStory ? (
              <PlayerStoryView story={employeeStory} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma história cadastrada para este funcionário.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeModal;

