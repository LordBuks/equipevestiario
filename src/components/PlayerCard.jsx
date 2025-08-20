const PlayerCard = ({ player, onClick }) => {
  const imageUrl = player.photoData?.url || player.photoUrl;
  
  return (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer player-card-hover"
      onClick={() => onClick(player)}
    >
      {/* Imagem do jogador */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Overlay com degradê vermelho no hover - ATRÁS da imagem */}
        <div className="absolute inset-0 player-overlay-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={player.name}
            className="w-full h-full object-cover player-image-zoom group-hover:scale-110 relative z-20"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center relative z-20">
            <span className="text-gray-400 text-xs">Sem foto</span>
          </div>
        )}
        
        {/* Informações sobrepostas na imagem - ACIMA de tudo - DADOS DO FORMULÁRIO */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white player-info-slide transform translate-y-full group-hover:translate-y-0 z-30">
          <h3 className="text-lg font-bold mb-1 text-shadow-strong">{player.name}</h3>
          <p className="text-xs opacity-90 text-shadow-strong">
            {player.address || 'Endereço não informado'}
          </p>
          <p className="text-xs opacity-80 text-shadow-strong">{player.category}</p>
          {player.cpf && (
            <p className="text-xs opacity-80 text-shadow-strong">CPF: {player.cpf}</p>
          )}
          {player.rg && (
            <p className="text-xs opacity-80 text-shadow-strong">RG: {player.rg}</p>
          )}
        </div>
      </div>
      
      {/* Informações sempre visíveis - DADOS DO FORMULÁRIO */}
      <div className="p-3 bg-white">
        <h3 className="text-base font-bold text-gray-900 mb-1 truncate">{player.name}</h3>
        
        {/* Nome Completo */}
        <p className="text-xs text-gray-600 mb-1 truncate">
          {player.fullName || 'Nome completo não informado'}
        </p>
        
        {/* Endereço e Categoria */}
        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
          <span className="truncate flex-1 mr-2">
            {player.address || 'Endereço não informado'}
          </span>
          <span className="category-badge text-white px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
            {player.category}
          </span>
        </div>
        
        {/* Documentação (CPF e RG) */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
          <span className="truncate">
            {player.cpf ? `CPF: ${player.cpf}` : 'CPF não informado'}
          </span>
          <span className="truncate ml-2">
            {player.rg ? `RG: ${player.rg}` : 'RG não informado'}
          </span>
        </div>
        
        {/* Matrícula e CEP */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
          <span className="truncate">
            {player.registration ? `Mat: ${player.registration}` : 'Matrícula não informada'}
          </span>
          <span className="truncate ml-2">
            {player.cep ? `CEP: ${player.cep}` : 'CEP não informado'}
          </span>
        </div>
        
        {/* Naturalidade */}
        {player.birthplace && (
          <p className="text-xs text-gray-500 mb-1 truncate">
            Natural de: {player.birthplace}
          </p>
        )}
        
        {/* Data de Nascimento */}
        {player.birthDate && (
          <p className="text-xs text-gray-500 mb-1">
            Nascimento: {new Date(player.birthDate).toLocaleDateString('pt-BR')}
          </p>
        )}
        
        {/* Tipo Sanguíneo */}
        {player.bloodType && (
          <p className="text-xs text-red-600 font-medium mb-1">
            Tipo Sanguíneo: {player.bloodType}
          </p>
        )}
        
        {/* Contato de Emergência */}
        {player.emergencyContactName && (
          <p className="text-xs text-green-600 mb-1 truncate">
            Contato: {player.emergencyContactName}
          </p>
        )}
        
        {player.emergencyContactPhone && (
          <p className="text-xs text-green-600 mb-1">
            Tel: {player.emergencyContactPhone}
          </p>
        )}
        
        {/* Observações */}
        {player.observations && (
          <p className="text-xs text-gray-500 mb-1 truncate">
            Obs: {player.observations}
          </p>
        )}
        
        {/* Observações Médicas */}
        {player.medicalObservations && (
          <p className="text-xs text-red-600 mb-1 truncate">
            Obs. Médicas: {player.medicalObservations}
          </p>
        )}
        
        {/* Atribuições/Assignments */}
        {player.assignments && player.assignments.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-700 font-medium mb-1">Atribuições:</p>
            <div className="flex flex-wrap gap-1">
              {player.assignments.slice(0, 2).map((assignment, index) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {assignment}
                </span>
              ))}
              {player.assignments.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{player.assignments.length - 2} mais
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;

