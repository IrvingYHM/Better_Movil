import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {IonContent,IonPage,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonInput,IonButton,IonLoading, IonBackButton,IonButtons,IonIcon,} from "@ionic/react";
import Header from "../../components/UI/header";
import { person } from "ionicons/icons";

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
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchProfileData = async (clienteId: string) => {
      try {
        const response = await fetch(`https://backopt-production.up.railway.app/clientes/id/${clienteId}`,{ });
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      fetchProfileData(decoded.clienteId);
    }
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
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prevData) => ({
          ...prevData,
          foto: reader.result as string, 
        }));
      };
      reader.readAsDataURL(file);
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
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              {editedData.foto ? (
                <img
                  src={editedData.foto}
                  alt="Perfil"
                  className="w-32 h-32 rounded-full"
                  />
                  ) : (
                  <IonIcon className="w-24 h-24 text-gray-600" icon={person}></IonIcon>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="mb-4">
                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                />
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
        <div className="flex justify-center mt-4">
          {isEditing ? (
            <IonButton color="success" onClick={handleSave}>
              Guardar
            </IonButton>
          ) : (
            <IonButton color="primary" onClick={handleEdit}>
              Editar
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileCard;
