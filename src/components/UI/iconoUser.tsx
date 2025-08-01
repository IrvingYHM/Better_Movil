import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/Auth'; 

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
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);

      // Llama a la API para obtener los datos del perfil
      const fetchProfileData = async (clienteId: string) => {
        try {
          const response = await fetch(`https://backopt-production.up.railway.app/clientes/id/${clienteId}`, {
          });
          const data = await response.json();
          setProfileData(data);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      // Asegúrate de que el clienteId está disponible
      if (decoded && decoded.clienteId) {
        fetchProfileData(decoded.clienteId);
      }
    }
  }, []);

  console.log("URL de la foto:", profileData?.foto); // Verifica la URL de la foto
  return (
    <div className="flex items-start"> 
      <div className="bg-blue-500 rounded-full p-1 m-3"> 
        {isAuthenticated && profileData && profileData.foto ? (
          <img src={profileData.foto} className="rounded-full w-20 h-20" />
        ) : (
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
            <span className="text-blue-500 text-4xl">👤</span> {/* Icono de usuario como respaldo */}
          </div>
        )}
      </div>
      <div className='flex flex-col'>
        {isAuthenticated && profileData ? ( 
          <>
            <p className="pt-4">{`Hola, ${profileData.vchNomCliente} ${profileData.vchAPaterno}`}</p>
            <p className='pt-1'>Bienvenido de nuevo</p>
          </>
        ) : (
          <>
            <p className="pt-4">Ingresa a tu cuenta</p>
            <p className='pt-1'>Podrás ver más detalles y mejorar tu experiencia</p>
          </>
        )}
      </div>
    </div>
  );
};

export default IconoRedondo;
