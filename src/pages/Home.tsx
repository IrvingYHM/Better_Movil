import React from 'react';
import { IonContent, IonHeader,IonPage, IonTitle, IonToolbar, IonSplitPane, IonMenuButton, IonSearchbar, IonImg, IonCard, IonLabel, IonButton, IonRouterLink, IonList, IonItem, IonIcon, IonAvatar, IonButtons } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import Footer from '../components/Footer';
import Header from '../components/UI/header';
import ImageCarousel from '../components/UI/carrucel';
import ProductosOfertas from '../components/Shared/productosOfertas';
import ventas from '../assets/Venta.png';
import { personCircle, search } from 'ionicons/icons';
import CategoriasCarrucel from '../components/UI/CategoriasCarrucel';
import ProductosViewCart from './productosViewCart';

const Home: React.FC = () => {
  return (
      <IonPage id="main-content"> 

       <Header />

        <IonContent>
         
          <ImageCarousel />
          <IonCard >
            <IonLabel>
              <h2 className="font-bold text-center text-black text-2xl">¡Crea una cuenta y mejora tu experiencia!</h2>
              <IonButton className='items-center justify-center flex p-4' routerLink='/Crearcuenta'>Crear cuenta</IonButton>
                <IonRouterLink routerLink="/IniciaSesion">
                  <h2 className="text-blue-500 text-center p-2 ">Ingresar a mi cuenta</h2>
                </IonRouterLink>
            </IonLabel>
          </IonCard>
          

          <CategoriasCarrucel />
          
          <ProductosOfertas />
          
          <IonCard >
            <IonLabel>
              <h2 >¿Necesitas ayuda?</h2>
            </IonLabel>
            <IonList>
              <IonItem>
                <IonRouterLink>
                <IonLabel className=''>Terminos y condiciones</IonLabel>
                </IonRouterLink>
              </IonItem>
              <IonItem>
                <IonLabel>Conocer más</IonLabel>
              </IonItem>
            </IonList>
          </IonCard>
        </IonContent>
        

      </IonPage>
  );
};

export default Home;
