import { IonPage, IonHeader, IonContent, IonLabel, IonMenuButton, IonSearchbar, IonToolbar, IonCard } from "@ionic/react";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/UI/header";
import ProductosVista from "../components/Shared/productos";
const Productos: React.FC = () =>{
    return(
        <IonPage id="main-content">
        <Header />
        <IonContent>

          <ProductosVista />

        </IonContent>

        </IonPage>

    );
}

export default Productos;