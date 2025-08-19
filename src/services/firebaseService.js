import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { cloudinaryService } from './cloudinaryService';

// Coleção de jogadores
const PLAYERS_COLLECTION = 'players';

// Coleção de histórias
const STORIES_COLLECTION = 'historias';

// Coleção de funcionários
const EMPLOYEES_COLLECTION = 'funcionarios';

// Operações CRUD para jogadores
export const playersService = {
  // Buscar todos os jogadores
  async getAll() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, PLAYERS_COLLECTION), orderBy('name'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      throw error;
    }
  },

  // Buscar jogadores por categoria
  async getByCategory(category) {
    try {
      const q = query(
        collection(db, PLAYERS_COLLECTION),
        where('category', '==', category),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar jogadores por categoria:', error);
      throw error;
    }
  },

  // Adicionar novo jogador
  async add(playerData) {
    try {
      const docRef = await addDoc(collection(db, PLAYERS_COLLECTION), {
        ...playerData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      throw error;
    }
  },

  // Atualizar jogador
  async update(id, playerData) {
    try {
      const playerRef = doc(db, PLAYERS_COLLECTION, id);
      await updateDoc(playerRef, {
        ...playerData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
      throw error;
    }
  },

  // Remover jogador
  async delete(id) {
    try {
      await deleteDoc(doc(db, PLAYERS_COLLECTION, id));
    } catch (error) {
      console.error('Erro ao remover jogador:', error);
      throw error;
    }
  }
};

// Operações CRUD para funcionários
export const employeesService = {
  // Buscar todos os funcionários
  async getAll() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, EMPLOYEES_COLLECTION), orderBy('name'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw error;
    }
  },

  // Buscar funcionários por função
  async getByFunction(functionType) {
    try {
      const q = query(
        collection(db, EMPLOYEES_COLLECTION),
        where('function', '==', functionType),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar funcionários por função:', error);
      throw error;
    }
  },

  // Adicionar novo funcionário
  async add(employeeData) {
    try {
      const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), {
        ...employeeData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      throw error;
    }
  },

  // Atualizar funcionário
  async update(id, employeeData) {
    try {
      const employeeRef = doc(db, EMPLOYEES_COLLECTION, id);
      await updateDoc(employeeRef, {
        ...employeeData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      throw error;
    }
  },

  // Remover funcionário
  async delete(id) {
    try {
      await deleteDoc(doc(db, EMPLOYEES_COLLECTION, id));
    } catch (error) {
      console.error('Erro ao remover funcionário:', error);
      throw error;
    }
  }
};

// Operações CRUD para histórias
export const storiesService = {
  // Buscar história por ID do jogador
  async getByPlayerId(playerId) {
    try {
      const q = query(
        collection(db, STORIES_COLLECTION),
        where('playerId', '==', playerId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Erro ao buscar história do jogador:', error);
      throw error;
    }
  },

  // Adicionar nova história
  async add(storyData) {
    try {
      const docRef = await addDoc(collection(db, STORIES_COLLECTION), {
        ...storyData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar história:', error);
      throw error;
    }
  },

  // Atualizar história
  async update(id, storyData) {
    try {
      const storyRef = doc(db, STORIES_COLLECTION, id);
      await updateDoc(storyRef, {
        ...storyData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar história:', error);
      throw error;
    }
  },

  // Remover história
  async delete(id) {
    try {
      await deleteDoc(doc(db, STORIES_COLLECTION, id));
    } catch (error) {
      console.error('Erro ao remover história:', error);
      throw error;
    }
  },

  // Buscar todas as histórias
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, STORIES_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar histórias:', error);
      throw error;
    }
  }
};

// Operações para upload de imagens usando Cloudinary
export const storageService = {
  // Upload de foto do jogador
  async uploadPlayerPhoto(file, playerId) {
    try {
      // Validar arquivo antes do upload
      const validationErrors = cloudinaryService.validateFile(file);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Fazer upload para o Cloudinary
      const result = await cloudinaryService.uploadImage(file, 'players');
      
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

  // Deletar foto do jogador
  async deletePlayerPhoto(photoData) {
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
export const utils = {
  // Validar dados do jogador
  validatePlayerData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Nome da foto deve ter pelo menos 2 caracteres');
    }
    
    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.push('Nome completo deve ter pelo menos 2 caracteres');
    }
    
    if (!data.category) {
      errors.push('Categoria é obrigatória');
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
  }
};

