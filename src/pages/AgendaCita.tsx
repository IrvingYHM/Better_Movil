import { IonPage, IonHeader, IonContent, IonImg, IonMenuButton, IonSearchbar, IonToolbar } from "@ionic/react";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/UI/header";
import CerrarSesion from "./Auth/cerrarSesion";
import ProductosOfertas from "../components/Shared/productosOfertas";
import ProductsViewCart from "./productosViewCart";
import Tratamientos from "../components/tratamientos";

const AgendaCita: React.FC = () =>{
    return(
        <IonPage id="main-content">
        <Header />
        <CerrarSesion />
        <IonContent>
        
        <ProductsViewCart />
        </IonContent>

        </IonPage>

    );
}

export default AgendaCita;