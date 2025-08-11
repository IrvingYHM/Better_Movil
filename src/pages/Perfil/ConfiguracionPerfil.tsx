import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAlert,
  IonSpinner,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import {
  locationOutline,
  lockClosedOutline,
  personOutline,
  settingsOutline,
  eyeOutline,
  pencilOutline,
  logOutOutline,
  homeOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/Auth';
import { StorageService } from '../../services/storage';

interface UserData {
  vchNombre: string;
  vchAPaterno: string;
  vchAMaterno: string;
  vchCorreo: string;
  vchTelefono?: string;
  direccion?: {
    calle: string;
    colonia: string;
    ciudad: string;
    codigoPostal: string;
  };
}

const ConfiguracionPerfil: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const history = useHistory();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated) {
        history.push('/IniciaSesion');
        return;
      }

      const token = await StorageService.getItem('token');
      
      if (!token) {
        history.push('/IniciaSesion');
        return;
      }

      // Obtener clienteId del token JWT
      const parseJwt = (token: string) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window.atob(base64).split('').map((c) => 
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join('')
        );
        return JSON.parse(jsonPayload);
      };

      const decodedToken = parseJwt(token);
      const clienteId = decodedToken.clienteId;

      // Usar el mismo endpoint que funciona en perfilUser
      const response = await fetch(`https://backopt-production.up.railway.app/clientes/id/${clienteId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          vchNombre: data.vchNomCliente,
          vchAPaterno: data.vchAPaterno,
          vchAMaterno: data.vchAMaterno,
          vchCorreo: data.vchCorreo,
          vchTelefono: data.vchTelefono
        });
      } else {
        throw new Error('Error al cargar datos del usuario');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = (event: CustomEvent) => {
    cargarDatosUsuario().finally(() => {
      event.detail.complete();
    });
  };

  const handleLogout = async () => {
    await logout();
    history.push('/Home');
  };

  const navigateTo = (path: string) => {
    history.push(path);
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Configuración</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="crescent" color="primary" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent 
            pullingIcon="chevron-down-circle-outline"
            pullingText="Desliza para actualizar"
            refreshingSpinner="circles"
            refreshingText="Actualizando..."
          />
        </IonRefresher>

        <div className="p-4">
          {/* Información del Usuario */}
          {userData && (
            <IonCard className="mb-4">
              <IonCardHeader>
                <IonCardTitle className="flex items-center">
                  <IonIcon icon={personOutline} className="mr-2 text-blue-600" />
                  Información Personal
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {userData.vchNombre} {userData.vchAPaterno} {userData.vchAMaterno}</p>
                  <p><strong>Correo:</strong> {userData.vchCorreo}</p>
                  {userData.vchTelefono && (
                    <p><strong>Teléfono:</strong> {userData.vchTelefono}</p>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Opciones de Configuración */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className="flex items-center">
                <IonIcon icon={settingsOutline} className="mr-2 text-orange-600" />
                Configuraciones
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-0">
              <IonList>
                {/* Información de Dirección */}
                <IonItem button onClick={() => navigateTo('/direccion')}>
                  <IonIcon icon={locationOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h3>Información de Dirección</h3>
                    <p>Ver y editar tu dirección de entrega</p>
                  </IonLabel>
                  <IonIcon icon={eyeOutline} slot="end" color="medium" />
                </IonItem>

                {/* Cambiar Contraseña */}
                <IonItem button onClick={() => navigateTo('/cambiar-password')}>
                  <IonIcon icon={lockClosedOutline} slot="start" color="warning" />
                  <IonLabel>
                    <h3>Cambiar Contraseña</h3>
                    <p>Actualiza tu contraseña de acceso</p>
                  </IonLabel>
                  <IonIcon icon={pencilOutline} slot="end" color="medium" />
                </IonItem>

                {/* Ver Citas */}
                <IonItem button onClick={() => navigateTo('/AgendaCita')}>
                  <IonIcon icon={homeOutline} slot="start" color="success" />
                  <IonLabel>
                    <h3>Mis Citas</h3>
                    <p>Ver y gestionar tus citas programadas</p>
                  </IonLabel>
                  <IonIcon icon={eyeOutline} slot="end" color="medium" />
                </IonItem>

                {/* Ver Pedidos */}
                <IonItem button onClick={() => navigateTo('/pedidos')}>
                  <IonIcon icon={homeOutline} slot="start" color="tertiary" />
                  <IonLabel>
                    <h3>Mis Pedidos</h3>
                    <p>Historial de compras y pedidos</p>
                  </IonLabel>
                  <IonIcon icon={eyeOutline} slot="end" color="medium" />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Cerrar Sesión */}
          <IonCard className="mt-4">
            <IonCardContent>
              <IonButton 
                expand="block" 
                color="danger" 
                fill="outline"
                onClick={() => setShowLogoutAlert(true)}
              >
                <IonIcon icon={logOutOutline} slot="start" />
                Cerrar Sesión
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <Footer />

        {/* Alert de confirmación para cerrar sesión */}
        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header={'Cerrar Sesión'}
          message={'¿Estás seguro de que deseas cerrar sesión?'}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Sí, cerrar sesión',
              handler: handleLogout
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ConfiguracionPerfil;