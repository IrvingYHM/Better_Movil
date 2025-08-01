import { IonFooter, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";

const Footer: React.FC =()=>{
    return (
        <IonFooter>
         <IonToolbar  color="primary">
            <IonTitle>Footer</IonTitle>
         </IonToolbar>
        </IonFooter>
    );
}

export  default Footer;