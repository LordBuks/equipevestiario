import { useState, useEffect } from 'react';
import { playersService } from '../services/firebaseService';
import { mockPlayers } from '../data/mockPlayers';
import { useAuth } from '../contexts/AuthContext';

export const usePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadPlayers();
    }
  }, [currentUser]);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar do Firebase
      try {
        const firebasePlayers = await playersService.getAll();
        setPlayers(firebasePlayers);
      } catch (firebaseError) {
        console.error("Erro ao carregar do Firebase:", firebaseError);
        setError("Erro ao carregar jogadores do Firebase. Verifique suas permissões.");
        setPlayers([]); // Garante que nenhum dado mock seja exibido
      }
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
      setError('Erro ao carregar jogadores');
      // Fallback para dados mock em caso de erro
      setPlayers(mockPlayers);
    } finally {
      setLoading(false);
    }
  };

  const getPlayersByCategory = (category) => {
    return players.filter(player => player.category === category);
  };

  const refreshPlayers = () => {
    loadPlayers();
  };

  return {
    players,
    loading,
    error,
    getPlayersByCategory,
    refreshPlayers
  };
};

