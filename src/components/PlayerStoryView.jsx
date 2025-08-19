import React from 'react';

const PlayerStoryView = ({ player, story }) => {
  if (!player || !story) return null;

  return (
    <div className="p-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 p-6 pb-0">Minha História</h2>
      
      {/* Seção de destaque com foto da família e nome estilizado - Responsiva */}
      <div className="relative h-auto md:h-96 overflow-hidden chelsea-hero-section">
        {/* Degradê suave de branco para vermelho */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-red-50 via-red-100 to-[#E5050F]"></div>
        
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
        
        {/* Container para foto da família e primeiro nome (responsivo) */}
        <div className="relative flex flex-col md:flex-row items-start justify-start h-full">
          {/* Foto da família - Colada na borda esquerda do container */}
          <div className="w-auto md:w-80 flex justify-start items-end pt-8 md:pt-0 z-20"
               style={{ height: '100%' }}>
            {story.familyPhotoUrl ? (
              <img
                src={story.familyPhotoUrl}
                alt={`Família de ${player.name}`}
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
                <span className="text-gray-500">Sem foto da família</span>
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
          
          {/* Frase personalizada do atleta - Posicionada do meio para a direita */}
          {story.photoPhrase && (
            <div className="absolute z-10 right-4 md:right-8" style={{ top: 'calc(50% + 80px)', maxWidth: '40%' }}>
              <blockquote className="athlete-quote text-white text-right">
                <p className="text-lg md:text-xl font-medium italic leading-relaxed"
                   style={{
                     textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
                     opacity: 0.95
                   }}>
                  "{story.photoPhrase}"
                </p>
                <footer className="text-sm md:text-base font-semibold mt-2"
                        style={{
                          textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
                          opacity: 0.9
                        }}>
                  — {player.name.split(' ')[0]}
                </footer>
              </blockquote>
            </div>
          )}
          
          {/* Espaço vazio para equilibrar layout em desktop */}
          <div className="hidden md:block w-80"></div>
        </div>
      </div>

      {/* História do Atleta */}
      <div className="p-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-red-500">❤️</span>
            A História de {player.name.split(' ')[0]}
          </h3>
          
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {story.storyText}
            </div>
          </div>
          
          {/* Informações adicionais do atleta */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Categoria:</span> {player.category}
              </div>
              <div>
                <span className="font-medium">Posição:</span> {player.position || 'Não informada'}
              </div>
              <div>
                <span className="font-medium">Naturalidade:</span> {player.birthplace || 'Não informada'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mensagem inspiracional */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-center italic">
            "Cada história é única, cada sonho é especial. Continue lutando pelos seus objetivos!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStoryView;

