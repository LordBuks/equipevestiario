import React, { useState, useEffect } from 'react';
import { storiesService } from '../services/firebaseService';
import PlayerStoryView from './PlayerStoryView';

const PlayerModalWithTabs = ({ player, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [playerStory, setPlayerStory] = useState(null);
  const [loadingStory, setLoadingStory] = useState(false);

  useEffect(() => {
    if (isOpen && player && activeTab === 'story') {
      loadPlayerStory();
    }
  }, [isOpen, player, activeTab]);

  const loadPlayerStory = async () => {
    if (!player?.id) return;
    
    setLoadingStory(true);
    try {
      const story = await storiesService.getByPlayerId(player.id);
      setPlayerStory(story);
    } catch (error) {
      console.error('Erro ao carregar história do jogador:', error);
      setPlayerStory(null);
    } finally {
      setLoadingStory(false);
    }
  };

  if (!isOpen || !player) return null;

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
              Detalhes do Jogador
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 p-6 pb-0">Detalhes do Jogador</h2>
            
            {/* Seção de destaque com foto e nome estilizado - Responsiva */}
            <div className="relative h-auto md:h-96 overflow-hidden chelsea-hero-section">
              {/* Degradê branco suave para vermelho */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-[#E5050F] to-[#E5050F]"></div>
              
              {/* Sobrenomes BEM GRANDES com transparência no fundo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pl-40">
                {player.name.split(" ").slice(1).map((namePart, index) => (
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
                {/* Foto do jogador - Colada na borda esquerda do container */}
                <div className="w-auto md:w-80 flex justify-start items-end pt-8 md:pt-0 z-20"
                     style={{ height: '100%' }}>
                  {player.photoData?.url || player.photoUrl ? (
                    <img
                      src={player.photoData?.url || player.photoUrl}
                      alt={player.name}
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
                      <span className="text-gray-500">Sem foto</span>
                    </div>
                  )}
                </div>
                
                {/* Primeiro nome - Posicionado sobre o segundo nome, alinhado à esquerda e um pouco mais para baixo */}
                <div className="absolute z-10" style={{ top: 'calc(50% - 80px)', left: 'calc(50% - 160px)' }}>
                  <p className="text-white text-4xl md:text-5xl font-bold tracking-wider"
                     style={{
                       opacity: 0.9,
                       textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
                       letterSpacing: '0.05em'
                     }}>
                    {player.name.split(' ')[0].toUpperCase()}
                  </p>
                </div>
                
                {/* Espaço vazio para equilibrar layout em desktop */}
                <div className="hidden md:block w-80"></div>
              </div>
            </div>

            {/* Informações do jogador */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dados Pessoais */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <p className="text-gray-900 font-medium">{player.fullName || player.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                      </label>
                      <p className="text-gray-900">
                        {player.birthDate ? new Date(player.birthDate).toLocaleDateString('pt-BR') : 'Não informada'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Naturalidade
                      </label>
                      <p className="text-gray-900">{player.birthplace || 'Não informada'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Esportivos */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Esportivos</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posição
                      </label>
                      <p className="text-gray-900">{player.position || 'Não informada'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria
                      </label>
                      <p className="text-gray-900">{player.category || 'Não informada'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Acadêmicos */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Acadêmicos</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Escola
                      </label>
                      <p className="text-gray-900">{player.school || 'Não informada'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano que Estuda
                      </label>
                      <p className="text-gray-900">{player.year || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados do Alojamento */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Alojamento</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admissão no Alojamento
                      </label>
                      <p className="text-gray-900">
                        {player.admissionDate ? new Date(player.admissionDate).toLocaleDateString('pt-BR') : 'Não informada'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quarto
                      </label>
                      <p className="text-gray-900">{player.room || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Observações Médicas e Contato de Emergência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-6 pb-6">
              {/* Observações Médicas */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="text-lg font-semibold text-red-800 mb-3">Observações Médicas</h4>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Alergias e Observações
                  </label>
                  <p className="text-red-900">
                    {player.medicalObservations || 'Nenhuma informada pela mãe.'}
                  </p>
                </div>
              </div>

              {/* Contato para Emergência */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-lg font-semibold text-green-800 mb-3">
                  Contato dos Responsáveis para Emergência
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Nome do Responsável
                    </label>
                    <p className="text-green-900">
                      {player.emergencyContactName || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Telefone
                    </label>
                    <p className="text-green-900">
                      {player.emergencyContactPhone || 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de fechar */}
            <div className="flex justify-end p-6 pt-0">
              <button
                onClick={onClose}
                className="bg-[#E5050F] text-white px-6 py-2 rounded-lg hover:bg-[#C20C18] transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {activeTab === 'story' && (
          <div>
            {loadingStory ? (
              <div className="p-6 text-center">
                <div className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Carregando história...</p>
              </div>
            ) : playerStory ? (
              <PlayerStoryView player={player} story={playerStory} />
            ) : (
              <div className="p-6 text-center">
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    História não encontrada
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Este atleta ainda não tem uma história cadastrada.
                  </p>
                  <p className="text-sm text-gray-500">
                    Entre em contato com a administração para adicionar a história deste atleta.
                  </p>
                </div>
              </div>
            )}
            
            {/* Botão de fechar */}
            <div className="flex justify-end p-6 pt-0">
              <button
                onClick={onClose}
                className="bg-[#E5050F] text-white px-6 py-2 rounded-lg hover:bg-[#C20C18] transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerModalWithTabs;

