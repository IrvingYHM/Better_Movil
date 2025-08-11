import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/react';
import {
  documentTextOutline,
  mailOutline,
  callOutline,
  globeOutline
} from 'ionicons/icons';
import Footer from '../../components/Footer';

const TerminosCondiciones: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Términos y Condiciones</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="p-4">
          <IonCard>
            <IonCardContent>
              <div className="text-center mb-6">
                <IonIcon 
                  icon={documentTextOutline} 
                  className="text-5xl text-blue-600 mb-2" 
                />
                <IonText>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Términos y Condiciones de Betterware
                  </h1>
                  <p className="text-sm text-gray-600 mt-2">
                    Última actualización: {new Date().toLocaleDateString()}
                  </p>
                </IonText>
              </div>

              <IonText>
                <p className="mb-4">
                  Lea atentamente estos términos y condiciones antes de utilizar 
                  nuestra aplicación móvil y servicios.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">
                  Interpretación y Definiciones
                </h2>

                <h3 className="text-lg font-semibold mb-2">Interpretación</h3>
                <p className="mb-4">
                  Las palabras cuya letra inicial está en mayúscula tienen 
                  significados definidos bajo las siguientes condiciones. Las 
                  siguientes definiciones tendrán el mismo significado 
                  independientemente de que aparezcan en singular o en plural.
                </p>

                <h3 className="text-lg font-semibold mb-2">Definiciones</h3>
                <p className="mb-4">
                  Para los efectos de estos Términos y Condiciones:
                </p>

                <div className="ml-4 mb-6">
                  <p className="mb-3">
                    <strong>Aplicación:</strong> se refiere a la aplicación móvil 
                    Betterware proporcionada por la Compañía.
                  </p>
                  <p className="mb-3">
                    <strong>País:</strong> se refiere a México.
                  </p>
                  <p className="mb-3">
                    <strong>Compañía:</strong> (denominada "la Compañía", "nosotros", 
                    "nos" o "nuestro" en este Acuerdo) se refiere a Betterware de México.
                  </p>
                  <p className="mb-3">
                    <strong>Dispositivo:</strong> significa cualquier dispositivo que 
                    pueda acceder a la Aplicación, como un teléfono inteligente, 
                    tableta digital o computadora.
                  </p>
                  <p className="mb-3">
                    <strong>Servicio:</strong> se refiere a la Aplicación.
                  </p>
                  <p className="mb-3">
                    <strong>Usted:</strong> se refiere a la persona que accede o 
                    utiliza la Aplicación.
                  </p>
                </div>

                <h2 className="text-xl font-bold mt-6 mb-4">Aceptación</h2>
                <p className="mb-4">
                  Estos son los Términos y Condiciones que rigen el uso de esta 
                  Aplicación y el acuerdo que opera entre Usted y la Compañía. 
                  Estos Términos y Condiciones establecen los derechos y 
                  obligaciones de todos los usuarios con respecto al uso de la Aplicación.
                </p>
                <p className="mb-4">
                  Su acceso y uso de la Aplicación está condicionado a su 
                  aceptación y cumplimiento de estos Términos y Condiciones. 
                  Al acceder o utilizar la Aplicación, usted acepta estar sujeto 
                  a estos Términos y Condiciones.
                </p>
                <p className="mb-4">
                  Usted declara que es mayor de 18 años. La Compañía no permite 
                  que menores de 18 años utilicen la Aplicación.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">Uso de la Aplicación</h2>
                <p className="mb-4">
                  La Aplicación le permite navegar y comprar productos Betterware, 
                  gestionar su cuenta, agendar citas y acceder a promociones exclusivas.
                </p>
                <p className="mb-4">
                  Usted se compromete a utilizar la Aplicación únicamente para 
                  fines legítimos y de acuerdo con estos Términos y Condiciones.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">Privacidad</h2>
                <p className="mb-4">
                  Su privacidad es importante para nosotros. Nuestra Política de 
                  Privacidad explica cómo recopilamos, usamos y protegemos su 
                  información cuando utiliza la Aplicación.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">Compras y Pagos</h2>
                <p className="mb-4">
                  Cuando realice compras a través de la Aplicación, se aplicarán 
                  nuestros términos de venta. Los precios están sujetos a cambios 
                  sin previo aviso.
                </p>
                <p className="mb-4">
                  Aceptamos varios métodos de pago seguros. Al proporcionar 
                  información de pago, usted declara y garantiza que tiene el 
                  derecho legal de usar dicha información.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">Limitación de Responsabilidad</h2>
                <p className="mb-4">
                  En la máxima medida permitida por la ley aplicable, en ningún 
                  caso la Compañía será responsable de ningún daño especial, 
                  incidental, indirecto o consecuente.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">Terminación</h2>
                <p className="mb-4">
                  Podemos terminar o suspender su acceso inmediatamente, sin 
                  previo aviso, por cualquier motivo, incluyendo el incumplimiento 
                  de estos Términos y Condiciones.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">
                  Cambios a estos Términos
                </h2>
                <p className="mb-4">
                  Nos reservamos el derecho de modificar estos términos en 
                  cualquier momento. Las modificaciones importantes serán 
                  notificadas con al menos 30 días de antelación.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">Ley Aplicable</h2>
                <p className="mb-6">
                  Estos Términos se regirán por las leyes de México, sin 
                  consideración a sus conflictos de principios legales.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Información de contacto */}
          <IonCard>
            <IonCardContent>
              <IonText>
                <h3 className="text-lg font-bold mb-4">Contáctanos</h3>
                <p className="mb-4">
                  Si tiene alguna pregunta sobre estos Términos y Condiciones, 
                  puede contactarnos:
                </p>
              </IonText>

              <IonItem lines="none">
                <IonIcon icon={mailOutline} slot="start" color="primary" />
                <IonLabel>
                  <p>soporte@betterware.com.mx</p>
                </IonLabel>
              </IonItem>

              <IonItem lines="none">
                <IonIcon icon={callOutline} slot="start" color="success" />
                <IonLabel>
                  <p>01-800-BETTER-1</p>
                </IonLabel>
              </IonItem>

              <IonItem lines="none">
                <IonIcon icon={globeOutline} slot="start" color="tertiary" />
                <IonLabel>
                  <p>www.betterware.com.mx</p>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default TerminosCondiciones;