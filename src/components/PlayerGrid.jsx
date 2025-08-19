import PlayerCard from './PlayerCard';

const PlayerGrid = ({ players, onPlayerClick }) => {
  if (players.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-base">Nenhum jogador encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-4">
      {players.map((player) => (
        <PlayerCard 
          key={player.id} 
          player={player} 
          onClick={onPlayerClick}
        />
      ))}
    </div>
  );
};

export default PlayerGrid;

