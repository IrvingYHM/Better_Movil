import React from "react";
import { IonHeader, IonMenuButton, IonToolbar } from "@ionic/react";
import Buscar from "./busqueda";
import Logo from "./logo";

const Header: React.FC  = () => {
    return (
        <IonHeader>
        <IonToolbar>
          <div className="flex items-center p-5 pb-6 bg-blue-400 ">
            <IonMenuButton className="pr-0"  slot="start"/>
            <Buscar />
            <Logo />
          </div>
        </IonToolbar>
      </IonHeader>
    );
}

export default Header;