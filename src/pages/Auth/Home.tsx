import React from "react";
import { IonContent, IonPage } from '@ionic/react'
import Header from '../../components/UI/header';
import CerrarSesion from "./cerrarSesion";
import ProductosOfertas from "../../components/Shared/productosOfertas";
import ImageCarousel from "../../components/UI/carrucel";
import CategoriasCarrucel from "../../components/UI/CategoriasCarrucel";
const HomeAuth: React.FC = ()=> {
    return(
        <IonPage>
        <Header />
        <IonContent>
            <ImageCarousel />
            <CategoriasCarrucel />
            <ProductosOfertas />
        </IonContent>
        </IonPage>
    );
}

export default HomeAuth;