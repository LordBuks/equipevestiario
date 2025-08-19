import { useState, useEffect } from 'react';
import { personnelService } from '../services/personnelService';

export const usePersonnel = () => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar todo o pessoal
  const loadPersonnel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personnelService.getAll();
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

  // Filtrar pessoal por tipo
  const getPersonnelByType = (type) => {
    return personnel.filter(person => person.type === type);
  };

  // Filtrar pessoal por atribuição
  const getPersonnelByAssignment = (assignment) => {
    return personnel.filter(person => 
      person.assignments && person.assignments.includes(assignment)
    );
  };

  // Filtrar pessoal disponível para atribuição
  const getAvailableForAssignment = (assignment) => {
    return personnel.filter(person => 
      !person.assignments || !person.assignments.includes(assignment)
    );
  };

  // Adicionar novo membro do pessoal
  const addPersonnel = async (personnelData) => {
    try {
      const id = await personnelService.add(personnelData);
      await loadPersonnel(); // Recarregar dados
      return id;
    } catch (err) {
      console.error('Erro ao adicionar pessoal:', err);
      throw err;
    }
  };

  // Atualizar membro do pessoal
  const updatePersonnel = async (id, personnelData) => {
    try {
      await personnelService.update(id, personnelData);
      await loadPersonnel(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao atualizar pessoal:', err);
      throw err;
    }
  };

  // Adicionar atribuição
  const addAssignment = async (id, assignment) => {
    try {
      await personnelService.addAssignment(id, assignment);
      await loadPersonnel(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao adicionar atribuição:', err);
      throw err;
    }
  };

  // Remover atribuição
  const removeAssignment = async (id, assignment) => {
    try {
      await personnelService.removeAssignment(id, assignment);
      await loadPersonnel(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao remover atribuição:', err);
      throw err;
    }
  };

  // Remover membro do pessoal
  const deletePersonnel = async (id) => {
    try {
      await personnelService.delete(id);
      await loadPersonnel(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao remover pessoal:', err);
      throw err;
    }
  };

  return {
    personnel,
    loading,
    error,
    loadPersonnel,
    getPersonnelByType,
    getPersonnelByAssignment,
    getAvailableForAssignment,
    addPersonnel,
    updatePersonnel,
    addAssignment,
    removeAssignment,
    deletePersonnel
  };
};

export default usePersonnel;

