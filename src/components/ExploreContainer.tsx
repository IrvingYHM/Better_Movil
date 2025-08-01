import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import lente from '../assets/Venta.png';

function ExploreContainer() {
  return (
    <div className='grid grid-cols-2'>
    <IonCard className='w-44'>
      <img alt="imagen del lente" src={lente} className='' />
      <IonCardHeader>
        <IonCardTitle>Nombre del lente</IonCardTitle>
        <IonCardSubtitle>marca o modelo </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>Descripcion del lente</IonCardContent>
    </IonCard>
    
    </div>
    

      
    
  );
}
export default ExploreContainer;