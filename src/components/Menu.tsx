import React from 'react';
import { IonMenu, IonHeader, IonContent, IonList, IonItem, IonLabel, IonMenuToggle, IonIcon } from '@ionic/react';
import { 
  home, 
  cart, 
  bag, 
  calendar, 
  person, 
  people, 
  call, 
  libraryOutline,
  trophyOutline,
  handRightOutline,
  keyOutline,
  settingsOutline,
  documentTextOutline,
  informationCircleOutline,
  logOutOutline
} from "ionicons/icons";
import IconoRedondo from './UI/iconoUser';
import Boton from './UI/button';
import { useAuth } from './../contexts/Auth'; 

const Menu: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redireccionar a la página de inicio después del logout
    window.location.href = '/Home';
  };

  return (
    <IonMenu side="start" contentId="main-content"> 
      <IonHeader>
        <div className="bg-teal-500">
          <IonMenuToggle>
            <IconoRedondo />
            <Boton />
          </IonMenuToggle>
       </div>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonMenuToggle>
            <IonItem button routerLink="/Home">
              <IonIcon icon={home} slot="start" />
              <IonLabel>Inicio</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem button routerLink="/Productos">
              <IonIcon icon={bag} slot="start" />
              <IonLabel>Productos</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem button routerLink="/Catalogos">
              <IonIcon icon={libraryOutline} slot="start" />
              <IonLabel>Catálogos</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem button routerLink="/Retos">
              <IonIcon icon={trophyOutline} slot="start" />
              <IonLabel>Retos</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem button routerLink="/UneteEquipo">
              <IonIcon icon={handRightOutline} slot="start" />
              <IonLabel>Únete al Equipo</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem button routerLink="/Carrito">
              <IonIcon icon={cart} slot="start" />
              <IonLabel>Mi carrito</IonLabel>
            </IonItem>
          </IonMenuToggle>
          {!isAuthenticated ? ( 
            <>
              <IonMenuToggle>
                <IonItem button routerLink="/IniciaSesion">
                  <IonIcon icon={person} slot="start" />
                  <IonLabel>Iniciar Sesión</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle>
                <IonItem button routerLink="/RecuperacionPassword">
                  <IonIcon icon={keyOutline} slot="start" />
                  <IonLabel>Recuperar Contraseña</IonLabel>
                </IonItem>
              </IonMenuToggle>
            </>
          ) : ( 
            <>
              <IonMenuToggle>
                <IonItem button routerLink="/Perfil">
                  <IonIcon icon={person} slot="start" />
                  <IonLabel>Perfil</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle>
                <IonItem button routerLink="/ConfiguracionPerfil">
                  <IonIcon icon={settingsOutline} slot="start" />
                  <IonLabel>Configuración</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle>
                <IonItem button onClick={handleLogout}>
                  <IonIcon icon={logOutOutline} slot="start" />
                  <IonLabel>Cerrar Sesión</IonLabel>
                </IonItem>
              </IonMenuToggle>
            </>
          )}
          <IonMenuToggle>
            <IonItem button routerLink="/AcercaDe">
              <IonIcon icon={informationCircleOutline} slot="start" />
              <IonLabel>Acerca de Betterware</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem button routerLink="/TerminosCondiciones">
              <IonIcon icon={documentTextOutline} slot="start" />
              <IonLabel>Términos y Condiciones</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem>
              <IonIcon icon={call} slot="start" />
              <IonLabel>Contacto : +52 77#######</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
