export interface PhotoUploadResponse {
  message: string;
  foto: string;
  cliente: {
    intClvCliente: number;
    vchNomCliente: string;
    vchAPaterno: string;
    foto: string;
  };
}

export class PhotoUploadService {
  private static readonly API_BASE_URL = 'https://backopt-production.up.railway.app';

  static async uploadProfilePhoto(clienteId: string, file: File): Promise<PhotoUploadResponse> {
    try {
      // Validar archivo antes de enviar
      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen');
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen no puede superar los 5MB');
      }

      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('foto', file);

      // Realizar la petición al backend
      const response = await fetch(`${this.API_BASE_URL}/clientes/${clienteId}/upload-photo`, {
        method: 'POST',
        body: formData,
        // No establecer Content-Type, el navegador lo hará automáticamente para FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data: PhotoUploadResponse = await response.json();
      console.log('Foto de perfil subida exitosamente:', data);
      
      return data;
    } catch (error) {
      console.error('Error al subir foto de perfil:', error);
      throw error;
    }
  }

  static async compressImage(file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar y comprimir la imagen
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Error al comprimir la imagen'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Solo se permiten archivos de imagen' };
    }

    // Validar extensiones permitidas
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return { 
        isValid: false, 
        error: 'Solo se permiten archivos con extensión: ' + allowedExtensions.join(', ')
      };
    }

    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, error: 'La imagen no puede superar los 5MB' };
    }

    return { isValid: true };
  }
}