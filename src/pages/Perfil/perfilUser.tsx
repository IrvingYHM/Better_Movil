import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {IonContent,IonPage,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonInput,IonButton,IonLoading, IonBackButton,IonButtons,IonIcon,IonPopover,IonList,IonItem,IonLabel,} from "@ionic/react";
import Header from "../../components/UI/header";
import { person, logOutOutline, cameraOutline, checkmarkCircleOutline, imagesOutline, addCircleOutline } from "ionicons/icons";
import { useAuth } from "../../contexts/Auth";
import { StorageService } from "../../services/storage";
import { PhotoUploadCapacitorService } from "../../services/photoUploadCapacitor";
import { toast } from 'react-toastify';

interface ProfileData {
  vchNomCliente: string;
  vchAPaterno: string;
  vchAMaterno: string;
  vchCorreo: string;
  vchTelefono: string;
  foto?: string;
}

function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const ProfileCard: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<ProfileData>({
    vchNomCliente: '',
    vchAPaterno: '',
    vchAMaterno: '',
    vchCorreo: '',
    vchTelefono: '',
    foto: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null); 
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/Home';
  };

  useEffect(() => {
    const fetchProfileData = async (clienteId: string) => {
      try {
        const response = await fetch(`https://backopt-production.up.railway.app/clientes/id/${clienteId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          
          // Inicializar editedData con los datos actuales del perfil
          setEditedData({
            vchNomCliente: data.vchNomCliente,
            vchAPaterno: data.vchAPaterno,
            vchAMaterno: data.vchAMaterno,
            vchCorreo: data.vchCorreo,
            vchTelefono: data.vchTelefono,
            foto: data.foto || '',
          });
        } else {
          throw new Error('Error al obtener datos del perfil');
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const loadUserData = async () => {
      try {
        const token = await StorageService.getItem("token");
        if (token) {
          const decoded = parseJwt(token);
          setDecodedToken(decoded);
          await fetchProfileData(decoded.clienteId);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const handleEdit = () => {
    if (profileData) {
      setIsEditing(true);
      setEditedData({ ...profileData });
    }
  };

  const handleSave = async () => {
    console.log("Datos editados:", editedData);
    if (!editedData.vchNomCliente.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    try {
      await fetch(`https://backopt-production.up.railway.app/clientes/ids/${decodedToken.clienteId}`, {
        method: "PUT",
        body: JSON.stringify({
          vchNomCliente: editedData.vchNomCliente,
          vchAPaterno: editedData.vchAPaterno,
          vchAMaterno: editedData.vchAMaterno,
          vchCorreo: editedData.vchCorreo,
          vchTelefono: editedData.vchTelefono,
          foto: editedData.foto,
        }),
      });

      if (profileData) {
        setProfileData((prevData) => ({
          ...prevData,
          ...editedData,
        }));
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      // Validar el archivo
      const validation = PhotoUploadCapacitorService.validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error || 'Archivo inválido');
        return;
      }

      setSelectedImage(file);
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedImage || !decodedToken?.clienteId) {
      toast.error('No hay imagen seleccionada');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // Comprimir la imagen antes de subirla
      const compressedImage = await PhotoUploadCapacitorService.compressImage(selectedImage);
      
      // Subir la imagen al servidor
      const response = await PhotoUploadCapacitorService.uploadProfilePhoto(
        decodedToken.clienteId,
        compressedImage
      );

      // Actualizar los datos del perfil con la nueva foto
      setProfileData(prevData => prevData ? {
        ...prevData,
        foto: response.foto
      } : null);

      setEditedData(prevData => ({
        ...prevData,
        foto: response.foto
      }));

      // Limpiar preview y archivo seleccionado
      setPhotoPreview(null);
      setSelectedImage(null);

      toast.success('Foto de perfil actualizada correctamente');
    } catch (error: any) {
      console.error('Error al subir foto:', error);
      toast.error(error.message || 'Error al subir la foto de perfil');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const cancelPhotoUpload = () => {
    setSelectedImage(null);
    setPhotoPreview(null);
  };

  // Función para usar la cámara nativa de Capacitor
  const handleTakePhoto = async () => {
    if (!decodedToken?.clienteId) {
      toast.error('Error: No se pudo identificar el usuario');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // Usar el flujo completo del servicio de Capacitor
      const response = await PhotoUploadCapacitorService.selectCompressAndUpload(
        decodedToken.clienteId,
        true // fromCamera = true para usar la cámara
      );

      // Actualizar los datos del perfil con la nueva foto
      setProfileData(prevData => prevData ? {
        ...prevData,
        foto: response.foto
      } : null);

      setEditedData(prevData => ({
        ...prevData,
        foto: response.foto
      }));

      toast.success('Foto de perfil actualizada correctamente');
    } catch (error: any) {
      console.error('Error al tomar foto:', error);
      toast.error(error.message || 'Error al tomar la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Función para seleccionar desde galería usando Capacitor
  const handleSelectFromGallery = async () => {
    if (!decodedToken?.clienteId) {
      toast.error('Error: No se pudo identificar el usuario');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // Usar el flujo completo del servicio de Capacitor
      const response = await PhotoUploadCapacitorService.selectCompressAndUpload(
        decodedToken.clienteId,
        false // fromCamera = false para usar la galería
      );

      // Actualizar los datos del perfil con la nueva foto
      setProfileData(prevData => prevData ? {
        ...prevData,
        foto: response.foto
      } : null);

      setEditedData(prevData => ({
        ...prevData,
        foto: response.foto
      }));

      toast.success('Foto de perfil actualizada correctamente');
    } catch (error: any) {
      console.error('Error al seleccionar foto:', error);
      toast.error(error.message || 'Error al seleccionar la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (!profileData || !decodedToken) {
    return <IonLoading isOpen={true} message={"Cargando..."} />;
  }

  return (
    <IonPage>
      <Header />
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonContent>
          <IonCard className="flex flex-col items-center justify-center p-4">
          <IonCardHeader>
            <IonCardTitle className="text-center font-bold text-2xl">Información del Paciente</IonCardTitle> 
          </IonCardHeader>
          <IonCardContent>
          <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (editedData.foto || profileData.foto) ? (
                    <img
                      src={editedData.foto || profileData.foto}
                      alt="Perfil"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<ion-icon class="w-24 h-24 text-gray-600" name="person"></ion-icon>';
                        }
                      }}
                    />
                  ) : (
                    <IonIcon className="w-24 h-24 text-gray-600" icon={person}></IonIcon>
                  )}
                </div>
                
                {/* Botón flotante de opciones */}
                <div className="absolute bottom-0 right-0">
                  <IonButton
                    id="photo-options-trigger"
                    fill="solid" 
                    color="primary" 
                    size="small"
                    className="rounded-full"
                    disabled={uploadingPhoto}
                    onClick={() => setShowPhotoOptions(true)}
                  >
                    <IonIcon icon={addCircleOutline} />
                  </IonButton>
                </div>
              </div>
            </div>

            {/* Popover con opciones de foto */}
            <IonPopover
              isOpen={showPhotoOptions}
              trigger="photo-options-trigger"
              onDidDismiss={() => setShowPhotoOptions(false)}
              showBackdrop={true}
            >
              <IonContent>
                <IonList>
                  <IonItem button onClick={() => { handleTakePhoto(); setShowPhotoOptions(false); }} disabled={uploadingPhoto}>
                    <IonIcon icon={cameraOutline} slot="start" />
                    <IonLabel>Tomar foto</IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => { handleSelectFromGallery(); setShowPhotoOptions(false); }} disabled={uploadingPhoto}>
                    <IonIcon icon={imagesOutline} slot="start" />
                    <IonLabel>Seleccionar de galería</IonLabel>
                  </IonItem>
                  <IonItem>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { handleImageChange(e); setShowPhotoOptions(false); }}
                      className="hidden"
                      id="file-input-fallback"
                      disabled={uploadingPhoto}
                    />
                    <label htmlFor="file-input-fallback" className="w-full flex items-center cursor-pointer">
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      <IonLabel>Seleccionar archivo</IonLabel>
                    </label>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>

            {/* Controles para subir foto */}
            {selectedImage && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center mb-3">
                  <p className="text-sm text-gray-700 mb-2">
                    Nueva foto seleccionada: {selectedImage.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Tamaño: {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <IonButton
                    size="small"
                    color="success"
                    onClick={handleUploadPhoto}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Subiendo...
                      </div>
                    ) : (
                      <>
                        <IonIcon icon={checkmarkCircleOutline} slot="start" />
                        Subir Foto
                      </>
                    )}
                  </IonButton>
                  
                  <IonButton
                    size="small"
                    fill="outline"
                    color="medium"
                    onClick={cancelPhotoUpload}
                    disabled={uploadingPhoto}
                  >
                    Cancelar
                  </IonButton>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 text-center items-center justify-center">
              {/* Nombre */}
              <div>
                <p className="text-black" style={{ fontSize: "1.25rem" }}>Nombre</p> 
                {isEditing ? (
                  <IonInput
                    type="text"
                    className="text-2xl"
                    value={editedData.vchNomCliente}
                    onIonChange={(e: { detail: { value: string; }; }) =>
                      setEditedData({
                        ...editedData,
                        vchNomCliente: e.detail.value!,
                      })
                    }
                  />
                ) : (
                  <p className="text-black" style={{ fontSize: "1.25rem" }}>{profileData.vchNomCliente}</p>
                )}
              </div>
              {/* Apellidos */}
              <div>
                <p className="text-black" style={{ fontSize: "1.25rem" }}>Apellidos</p> 
                {isEditing ? (
                  <IonInput
                    type="text"
                    className="text-2xl "
                    value={`${editedData.vchAPaterno} ${editedData.vchAMaterno}`}
                    onIonChange={(e: { detail: { value: any; }; }) => {
                      const [apellidoPaterno, apellidoMaterno] = e.detail.value!.split(" ");
                      setEditedData({
                        ...editedData,
                        vchAPaterno: apellidoPaterno,
                        vchAMaterno: apellidoMaterno,
                      });
                    }}
                  />
                ) : (
                  <p className="text-black" style={{ fontSize: "1.25rem" }}>{`${profileData.vchAPaterno} ${profileData.vchAMaterno}`}</p> 
                )}
              </div>
              {/* Correo electrónico */}
              <div>
                <p className="text-black" style={{ fontSize: "1.25rem" }}>Correo electrónico</p>
                {isEditing ? (
                  <IonInput
                    type="email"
                    className="text-2xl "
                    value={editedData.vchCorreo}
                    onIonChange={(e: { detail: { value: string; }; }) =>
                      setEditedData({ ...editedData, vchCorreo: e.detail.value! })
                    }
                  />
                ) : (
                  <p className="text-black" style={{ fontSize: "1.25rem" }}>{profileData.vchCorreo}</p>
                )}
              </div>
              {/* Número de teléfono */}
              <div>
                <p className="text-black" style={{ fontSize: "1.25rem" }}>Número de teléfono</p>
                {isEditing ? (
                  <IonInput
                    type="tel"
                    className="text-2xl"
                    value={editedData.vchTelefono}
                    onIonChange={(e: { detail: { value: string; }; }) =>
                      setEditedData({ ...editedData, vchTelefono: e.detail.value! })
                    }
                  />
                ) : (
                  <p className="text-black" style={{ fontSize: "1.25rem" }}>{profileData.vchTelefono}</p>
                )}
              </div>
            </div>
          </IonCardContent>
        </IonCard>
        <div className="flex justify-center gap-4 mt-4">
          {isEditing ? (
            <IonButton color="success" onClick={handleSave}>
              Guardar
            </IonButton>
          ) : (
            <IonButton color="primary" onClick={handleEdit}>
              Editar
            </IonButton>
          )}
          
          <IonButton color="danger" fill="outline" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Cerrar Sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileCard;
