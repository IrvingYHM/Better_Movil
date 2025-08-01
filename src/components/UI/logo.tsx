import { IonImg } from "@ionic/react";
import React from "react";
import logo from '../../assets/Logo.png'

const Logo: React.FC = () => {
    return(
        <IonImg src={logo} className='p-1 h-15 w-20'></IonImg>
    );
}

export default Logo;