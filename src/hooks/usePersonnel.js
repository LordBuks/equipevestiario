import { useState, useEffect } from 'react';
import { playersService } from '../services/firebaseService'; // Importar playersService

export const usePersonnel = () => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar todo o pessoal
  const loadPersonnel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playersService.getAll(); // Usar playersService.getAll()
      setPersonnel(data);
    } catch (err) {
      console.error('Erro ao carregar pessoal:', err);
      setError('Erro ao carregar dados do pessoal');
    } finally {
      setLoading(false);
    }
  };

  // Carregar pessoal na inicialização
  useEffect(() => {
    loadPersonnel();
  }, []);

  // Filtrar pessoal por categoria (Agente/Especial)
  const getPersonnelByType = (type) => {
    return personnel.filter(person => person.category === type);
  };

  // Filtrar pessoal por atribuição
  const getPersonnelByAssignment = (assignment) => {
    return personnel.filter(person => 
      person.assignments && person.assignments.includes(assignment)
    );
  };

  // As funções de add, update e delete serão tratadas diretamente nos componentes que usam o PlayerForm
  // ou AdminPanel, chamando playersService diretamente.
  // Este hook foca mais na leitura e filtragem dos dados.

  return {
    personnel,
    loading,
    error,
    loadPersonnel,
    getPersonnelByType,
    getPersonnelByAssignment,
  };
};

export default usePersonnel;


