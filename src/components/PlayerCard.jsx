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
        
        {/* Informações sobrepostas na imagem - ACIMA de tudo */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white player-info-slide transform translate-y-full group-hover:translate-y-0 z-30">
          <h3 className="text-lg font-bold mb-1 text-shadow-strong">{player.name}</h3>
          <p className="text-xs opacity-90 text-shadow-strong">{player.position || 'Posição não informada'}</p>
          <p className="text-xs opacity-80 text-shadow-strong">{player.category}</p>
        </div>
      </div>
      
      {/* Informações sempre visíveis (estilo Internacional) */}
      <div className="p-3 bg-white">
        <h3 className="text-base font-bold text-gray-900 mb-1 truncate">{player.name}</h3>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>{player.position || 'Posição não informada'}</span>
          <span className="category-badge text-white px-2 py-1 rounded-full text-xs font-medium">
            {player.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

