import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase';
import { cloudinaryService } from './cloudinaryService';

// Coleções existentes no Firebase
const PERSONNEL_COLLECTION = 'personnel';

// Operações CRUD para pessoal
export const personnelService = {
  // Buscar todo o pessoal
  async getAll() {
    try {
      const querySnapshot = await getDocs(query(collection(db, PERSONNEL_COLLECTION), orderBy("name")));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao buscar pessoal:", error);
      throw error;
    }
  },

  // Buscar pessoal por ID
  async getById(id) {
    try {
      const docRef = doc(db, PERSONNEL_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar pessoal por ID:', error);
      throw error;
    }
  },

  // Buscar pessoal por tipo (Especial, Agente)
  async getByType(type) {
    try {
      const q = query(
        collection(db, PERSONNEL_COLLECTION),
        where('type', '==', type),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar pessoal por tipo:', error);
      throw error;
    }
  },

  // Buscar pessoal por atribuição (posto/setor)
  async getByAssignment(assignment) {
    try {
      const q = query(
        collection(db, PERSONNEL_COLLECTION),
        where('assignments', 'array-contains', assignment),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar pessoal por atribuição:', error);
      throw error;
    }
  },

  // Buscar pessoal disponível para atribuição (sem a atribuição específica)
  async getAvailableForAssignment(assignment) {
    try {
      // Buscar todos os documentos e filtrar no cliente
      // (Firebase não suporta consultas "array-not-contains" diretamente)
      const querySnapshot = await getDocs(
        query(collection(db, PERSONNEL_COLLECTION), orderBy('name'))
      );
      
      return querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(person => {
          const assignments = person.assignments || [];
          return !assignments.includes(assignment);
        });
    } catch (error) {
      console.error('Erro ao buscar pessoal disponível:', error);
      throw error;
    }
  },

  // Adicionar novo membro do pessoal
  async add(personnelData) {
    try {
      const docRef = await addDoc(collection(db, PERSONNEL_COLLECTION), {
        ...personnelData,
        assignments: personnelData.assignments || [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar pessoal:', error);
      throw error;
    }
  },

  // Atualizar membro do pessoal
  async update(id, personnelData) {
    try {
      const personnelRef = doc(db, PERSONNEL_COLLECTION, id);
      await updateDoc(personnelRef, {
        ...personnelData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar pessoal:', error);
      throw error;
    }
  },

  // Adicionar atribuição a um membro do pessoal
  async addAssignment(id, assignment) {
    try {
      const personnelRef = doc(db, PERSONNEL_COLLECTION, id);
      await updateDoc(personnelRef, {
        assignments: arrayUnion(assignment),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao adicionar atribuição:', error);
      throw error;
    }
  },

  // Remover atribuição de um membro do pessoal
  async removeAssignment(id, assignment) {
    try {
      const personnelRef = doc(db, PERSONNEL_COLLECTION, id);
      await updateDoc(personnelRef, {
        assignments: arrayRemove(assignment),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao remover atribuição:', error);
      throw error;
    }
  },

  // Remover membro do pessoal
  async delete(id) {
    try {
      await deleteDoc(doc(db, PERSONNEL_COLLECTION, id));
    } catch (error) {
      console.error('Erro ao remover pessoal:', error);
      throw error;
    }
  }
};

// Operações para upload de imagens usando Cloudinary
export const personnelStorageService = {
  // Upload de foto do pessoal
  async uploadPhoto(file, personnelId) {
    try {
      // Validar arquivo antes do upload
      const validationErrors = cloudinaryService.validateFile(file);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Fazer upload para o Cloudinary
      const result = await cloudinaryService.uploadImage(file, 'personnel');
      
      return {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      throw error;
    }
  },

  // Deletar foto do pessoal
  async deletePhoto(photoData) {
    try {
      if (photoData && photoData.publicId) {
        await cloudinaryService.deleteImage(photoData.publicId);
      }
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      // Não propagar o erro, pois a foto pode já ter sido deletada
    }
  },

  // Gerar URL otimizada para thumbnail
  generateThumbnailUrl(publicId, width = 150, height = 200) {
    return cloudinaryService.generateOptimizedUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
  }
};

// Utilitários
export const personnelUtils = {
  // Validar dados do pessoal
  validatePersonnelData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Nome da foto deve ter pelo menos 2 caracteres');
    }
    
    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.push('Nome completo deve ter pelo menos 2 caracteres');
    }
    
    if (!data.type) {
      errors.push('Tipo é obrigatório');
    }
    
    if (data.birthDate && new Date(data.birthDate) > new Date()) {
      errors.push('Data de nascimento não pode ser no futuro');
    }
    
    return errors;
  },

  // Validar arquivo de imagem
  validateImageFile(file) {
    return cloudinaryService.validateFile(file);
  },

  // Formatar data para exibição
  formatDate(dateString) {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  },

  // Gerar ID único para upload
  generateUploadId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  },

  // Gerar URL otimizada para exibição
  getOptimizedImageUrl(photoData, options = {}) {
    if (!photoData || !photoData.publicId) {
      return null;
    }
    return cloudinaryService.generateOptimizedUrl(photoData.publicId, options);
  },

  // Verificar se uma pessoa tem uma atribuição específica
  hasAssignment(person, assignment) {
    return person.assignments && person.assignments.includes(assignment);
  },

  // Obter lista de atribuições disponíveis
  getAvailableAssignments() {
    return ['Visitantes', 'Imprensa', 'Presidência', 'Rampa'];
  },

  // Obter lista de tipos disponíveis
  getAvailableTypes() {
    return ["Especial", "Agente"];
  }
};

export default personnelService;


