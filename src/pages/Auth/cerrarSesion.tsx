import { IonButton } from '@ionic/react';
import React, { useContext } from 'react'
import { useAuth } from '../../contexts/Auth'; 

const CerrarSesion: React.FC = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href ='/Home'
    }
    return(
        <IonButton onClick={handleLogout}>Cerrar Sesión</IonButton>
    );
}

export default CerrarSesion;