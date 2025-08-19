// Serviço para integração com Cloudinary
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryService = {
  // Upload de imagem para o Cloudinary
  async uploadImage(file, folder = 'players') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folder);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Erro no upload: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format
      };
    } catch (error) {
      console.error('Erro ao fazer upload para Cloudinary:', error);
      throw new Error('Falha no upload da imagem. Tente novamente.');
    }
  },

  // Deletar imagem do Cloudinary
  async deleteImage(publicId) {
    try {
      // Para deletar imagens no Cloudinary, você precisa de uma API key e secret
      // Como estamos usando unsigned upload, a deleção deve ser feita pelo backend
      // ou configurada no dashboard do Cloudinary
      console.log('Para deletar imagens, configure a deleção no dashboard do Cloudinary ou implemente no backend');
      return true;
    } catch (error) {
      console.error('Erro ao deletar imagem do Cloudinary:', error);
      return false;
    }
  },

  // Gerar URL otimizada para diferentes tamanhos
  generateOptimizedUrl(publicId, options = {}) {
    const {
      width = 'auto',
      height = 'auto',
      crop = 'fill',
      quality = 'auto',
      format = 'auto'
    } = options;

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
  },

  // Validar arquivo antes do upload
  validateFile(file) {
    const errors = [];
    
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      errors.push('Por favor, selecione apenas arquivos de imagem');
    }
    
    // Verificar tamanho (10MB para Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      errors.push('A imagem deve ter no máximo 10MB');
    }
    
    // Verificar formatos suportados
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedFormats.includes(file.type)) {
      errors.push('Formato não suportado. Use JPG, PNG, WEBP ou GIF');
    }
    
    return errors;
  }
};

export default cloudinaryService;

