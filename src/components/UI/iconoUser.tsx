import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/Auth';
import { StorageService } from '../../services/storage'; 

interface ProfileData {
  vchNomCliente: string;
  vchAPaterno: string;
  vchAMaterno: string;
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

const IconoRedondo: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const { isAuthenticated } = useAuth(); 

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = await StorageService.getItem("token");
        if (token && isAuthenticated) {
          const decoded = parseJwt(token);
          setDecodedToken(decoded);

          // Llama a la API para obtener los datos del perfil
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
                console.log("Datos del perfil cargados:", data);
              } else {
                throw new Error('Error al cargar perfil');
              }
            } catch (error) {
              console.error("Error fetching profile data:", error);
            }
          };

          // Asegúrate de que el clienteId está disponible
          if (decoded && decoded.clienteId) {
            await fetchProfileData(decoded.clienteId);
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, [isAuthenticated]); // Dependencia de isAuthenticated para recargar cuando cambie el estado

  console.log("Estado de autenticación:", isAuthenticated);
  console.log("Datos del perfil:", profileData);
  console.log("URL de la foto:", profileData?.foto);

  return (
    <div className="flex items-start"> 
      <div className="bg-blue-500 rounded-full p-1 m-3"> 
        {isAuthenticated && profileData && profileData.foto ? (
          <img 
            src={profileData.foto} 
            className="rounded-full w-20 h-20 object-cover"
            onError={(e) => {
              // En caso de error al cargar la imagen, mostrar el placeholder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                    <span class="text-blue-500 text-4xl">👤</span>
                  </div>
                `;
              }
            }}
            alt="Foto de perfil"
          />
        ) : (
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
            <span className="text-blue-500 text-4xl">👤</span>
          </div>
        )}
      </div>
      <div className='flex flex-col'>
        {isAuthenticated && profileData ? ( 
          <>
            <p className="pt-4 text-white font-semibold">
              {`Hola, ${profileData.vchNomCliente} ${profileData.vchAPaterno}`}
            </p>
            <p className='pt-1 text-white text-sm opacity-90'>Bienvenido de nuevo</p>
          </>
        ) : (
          <>
            <p className="pt-4 text-white font-semibold">Ingresa a tu cuenta</p>
            <p className='pt-1 text-white text-sm opacity-90'>Podrás ver más detalles y mejorar tu experiencia</p>
          </>
        )}
      </div>
    </div>
  );
};

export default IconoRedondo;
