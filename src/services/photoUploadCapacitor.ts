import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

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

export interface PhotoValidation {
  isValid: boolean;
  error?: string;
}

export class PhotoUploadCapacitorService {
  private static readonly API_BASE_URL = 'https://backopt-production.up.railway.app';
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_FORMATS = ['jpeg', 'jpg', 'png', 'webp'];

  /**
   * Abre la cámara o galería para seleccionar una foto
   */
  static async selectPhoto(fromCamera: boolean = false): Promise<Photo | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: fromCamera ? CameraSource.Camera : CameraSource.Photos,
        width: 800,
        height: 800,
      });

      return photo;
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      throw new Error('Error al acceder a la cámara o galería');
    }
  }

  /**
   * Convierte una foto de Capacitor a File object
   */
  static async photoToFile(photo: Photo, fileName: string = 'profile-photo'): Promise<File> {
    try {
      if (!photo.webPath) {
        throw new Error('No se pudo obtener la ruta de la foto');
      }

      // En dispositivos nativos, necesitamos leer el archivo
      if (Capacitor.isNativePlatform()) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        const fileExtension = photo.format || 'jpeg';
        const mimeType = `image/${fileExtension}`;
        
        return new File([blob], `${fileName}.${fileExtension}`, {
          type: mimeType,
          lastModified: Date.now()
        });
      } else {
        // En web, podemos usar fetch directamente
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        const fileExtension = blob.type.split('/')[1] || 'jpeg';
        
        return new File([blob], `${fileName}.${fileExtension}`, {
          type: blob.type,
          lastModified: Date.now()
        });
      }
    } catch (error) {
      console.error('Error al convertir foto a archivo:', error);
      throw new Error('Error al procesar la imagen seleccionada');
    }
  }

  /**
   * Valida un archivo de imagen
   */
  static validateImageFile(file: File): PhotoValidation {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Solo se permiten archivos de imagen' };
    }

    // Validar extensiones permitidas
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !this.ALLOWED_FORMATS.includes(fileExtension)) {
      return { 
        isValid: false, 
        error: `Solo se permiten archivos: ${this.ALLOWED_FORMATS.join(', ')}`
      };
    }

    // Validar tamaño
    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: `La imagen no puede superar los ${Math.round(this.MAX_FILE_SIZE / (1024 * 1024))}MB` 
      };
    }

    return { isValid: true };
  }

  /**
   * Comprime una imagen manteniendo la calidad
   */
  static async compressImage(
    file: File, 
    maxWidth: number = 800, 
    maxHeight: number = 800, 
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
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

        // Dibujar imagen redimensionada
        if (ctx) {
          // Mejorar calidad de renderizado
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }
        
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

      img.onerror = () => reject(new Error('Error al cargar la imagen para compresión'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Sube la foto de perfil al servidor
   */
  static async uploadProfilePhoto(clienteId: string, file: File): Promise<PhotoUploadResponse> {
    try {
      // Validar archivo
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Crear FormData
      const formData = new FormData();
      formData.append('foto', file);

      console.log('Subiendo foto:', {
        name: file.name,
        size: file.size,
        type: file.type,
        clienteId
      });

      // Realizar petición al servidor
      const response = await fetch(`${this.API_BASE_URL}/clientes/${clienteId}/upload-photo`, {
        method: 'POST',
        body: formData,
        // No establecer Content-Type - el navegador lo maneja automáticamente
      });

      // Verificar respuesta
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si no se puede parsear la respuesta como JSON, usar mensaje de status
        }
        
        throw new Error(errorMessage);
      }

      const data: PhotoUploadResponse = await response.json();
      console.log('Foto subida exitosamente:', data);
      
      return data;
    } catch (error) {
      console.error('Error al subir foto de perfil:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error desconocido al subir la foto');
      }
    }
  }

  /**
   * Flujo completo: seleccionar, comprimir y subir foto
   */
  static async selectCompressAndUpload(
    clienteId: string,
    fromCamera: boolean = false
  ): Promise<PhotoUploadResponse> {
    try {
      // 1. Seleccionar foto
      const photo = await this.selectPhoto(fromCamera);
      if (!photo) {
        throw new Error('No se seleccionó ninguna foto');
      }

      // 2. Convertir a File
      const file = await this.photoToFile(photo);

      // 3. Comprimir si es necesario
      let finalFile = file;
      if (file.size > 1024 * 1024) { // Si es mayor a 1MB, comprimir
        finalFile = await this.compressImage(file);
      }

      // 4. Subir al servidor
      return await this.uploadProfilePhoto(clienteId, finalFile);
    } catch (error) {
      console.error('Error en flujo completo de foto:', error);
      throw error;
    }
  }
}