import { IonContent, IonDatetime, IonInput, IonLabel, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React from "react";
import Header from "../components/UI/header";
import Label from "../components/UI/label";

const RegistroU: React.FC =()=>{
    return(
        <IonPage>
            <Header />
            <IonContent>
                <div className="">
                    <div className="" >
                        <p className="text-center m-3 font-bold p-3">Registro de Usuario</p>
                    </div>
                    <div className="m-2">
                        <form action="" method="post">
                            <div className="flex items-center justify-between">
                                <IonLabel 
                                className="block text-sm font-bold leading-6 text-gray-900">
                                    Nombre:
                                </IonLabel>
                            </div>
                            <div className="flex items-center mt-2">
                                <IonInput
                                    type={ 'text'}
                                    placeholder="Nombre"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <IonLabel 
                                className="block text-sm font-bold leading-6 text-gray-900">
                                    Apellido paterno:
                                </IonLabel>
                            </div>
                            <div className="flex items-center mt-2">
                                <IonInput
                                    type={ 'text'}
                                    placeholder="Apellido paterno"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <IonLabel 
                                className="block text-sm font-bold leading-6 text-gray-900">
                                    Apellido Materno:
                                </IonLabel>
                            </div>
                            <div className="flex items-center mt-2">
                                <IonInput
                                    type={'text'}
                                    placeholder="Apellido materno"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="flex items-center mt-2">
                                <IonSelect justify="space-between" label="Sexo" placeholder="Selecciona">
                                    <IonSelectOption>Masculino</IonSelectOption>
                                    <IonSelectOption>Femenino</IonSelectOption>
                                </IonSelect>
                            </div>
                            <div className="flex items-center justify-between">
                                <IonLabel 
                                className="block text-sm font-bold leading-6 text-gray-900">
                                    Fecha de nacimiento:
                                </IonLabel>
                            </div>
                            <div className="flex items-center mt-2">
                                <IonDatetime></IonDatetime>
                            </div>
                        </form>
                    </div>
                </div>
            </IonContent>
        </IonPage>

    );
}

export default RegistroU;