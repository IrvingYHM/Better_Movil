import React from "react";
import { IonHeader, IonMenuButton, IonToolbar } from "@ionic/react";
import Buscar from "./busqueda";

const Header: React.FC  = () => {
    return (
        <IonHeader>
        <IonToolbar>
          <div className="flex items-center p-5 pb-1 bg-teal-700/95 ">
            <IonMenuButton className="pr-0"  slot="start"/>
            <Buscar />
          </div>
        </IonToolbar>
      </IonHeader>
    );
}

export default Header;