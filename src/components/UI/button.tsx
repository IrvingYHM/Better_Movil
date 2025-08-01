import React from 'react';
import { IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import { useAuth } from '../../contexts/Auth'; 

const Boton: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const history = useHistory();

  const handleClick = () => {
    if (isAuthenticated) {
      console.log('El usuario ya está autenticado');
    } else {
      history.push('/IniciaSesion'); 
    }
  };

  return (
    <div className='justify-center text-center items-center'>
      {!isAuthenticated && (
        <IonButton
          onClick={handleClick}
          className='w-4/5'
        >
          Ingresar
        </IonButton>
      )}
    </div>
  );
};

export default Boton;
