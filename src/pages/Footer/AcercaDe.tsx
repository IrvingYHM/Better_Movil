import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonText,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import {
  eyeOutline,
  rocketOutline,
  heartOutline,
  starOutline,
  peopleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import Footer from '../../components/Footer';

const AcercaDe: React.FC = () => {
  const valores = [
    {
      titulo: "Calidad",
      descripcion: "Comprometidos con ofrecer productos de la más alta calidad que mejoren la vida de nuestros clientes."
    },
    {
      titulo: "Innovación",
      descripcion: "Constantemente buscamos nuevas formas de mejorar nuestros productos y servicios a través de la tecnología."
    },
    {
      titulo: "Integridad",
      descripcion: "Actuamos con honestidad, transparencia y ética en todas nuestras operaciones comerciales."
    },
    {
      titulo: "Servicio al Cliente",
      descripcion: "Nuestros clientes son nuestra prioridad. Nos esforzamos por brindar un servicio excepcional."
    },
    {
      titulo: "Responsabilidad Social",
      descripcion: "Comprometidos con prácticas sostenibles y contribuir positivamente a nuestras comunidades."
    },
    {
      titulo: "Trabajo en Equipo",
      descripcion: "Fomentamos la colaboración y el trabajo conjunto para alcanzar nuestros objetivos comunes."
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Acerca de Betterware</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="p-4">
          {/* Encabezado de la empresa */}
          <IonCard className="text-center mb-6">
            <IonCardContent>
              <IonIcon 
                icon={starOutline} 
                className="text-6xl text-orange-600 mb-4" 
              />
              <IonText>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Betterware de México
                </h1>
                <p className="text-lg text-gray-600">
                  Mejorando la vida de las familias mexicanas desde hace más de 30 años
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Misión */}
          <IonCard className="mb-6">
            <IonCardHeader>
              <IonCardTitle className="flex items-center">
                <IonIcon icon={rocketOutline} className="mr-2 text-blue-600" />
                Misión
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p className="text-base leading-relaxed">
                  En Betterware, nuestra misión es mejorar la calidad de vida de las 
                  familias mexicanas a través de productos innovadores, funcionales y 
                  de alta calidad para el hogar. Nos comprometemos a ofrecer 
                  soluciones prácticas que simplifiquen las tareas cotidianas, 
                  mientras brindamos oportunidades de crecimiento económico y 
                  personal a nuestros asociados y distribuidores.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Visión */}
          <IonCard className="mb-6">
            <IonCardHeader>
              <IonCardTitle className="flex items-center">
                <IonIcon icon={eyeOutline} className="mr-2 text-green-600" />
                Visión
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p className="text-base leading-relaxed">
                  Ser la empresa líder en México en la comercialización directa de 
                  productos para el hogar, reconocida por la excelencia de nuestros 
                  productos, la satisfacción de nuestros clientes y el desarrollo 
                  integral de nuestra fuerza de ventas. Aspiramos a expandir nuestra 
                  presencia a nivel internacional, manteniendo siempre nuestros 
                  valores fundamentales de calidad, innovación e integridad.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Valores */}
          <IonCard className="mb-6">
            <IonCardHeader>
              <IonCardTitle className="flex items-center">
                <IonIcon icon={heartOutline} className="mr-2 text-red-600" />
                Nuestros Valores
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-0">
              <IonList>
                {valores.map((valor, index) => (
                  <IonItem key={index} lines={index === valores.length - 1 ? "none" : "inset"}>
                    <IonIcon 
                      icon={checkmarkCircleOutline} 
                      color="success" 
                      slot="start" 
                    />
                    <IonLabel className="ion-text-wrap">
                      <h3 className="font-semibold text-base">{valor.titulo}</h3>
                      <p className="text-sm text-gray-600 mt-1">{valor.descripcion}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Nuestra Historia */}
          <IonCard className="mb-6">
            <IonCardHeader>
              <IonCardTitle className="flex items-center">
                <IonIcon icon={peopleOutline} className="mr-2 text-purple-600" />
                Nuestra Historia
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p className="text-base leading-relaxed mb-4">
                  Betterware de México inició operaciones en 1995 como una empresa 
                  dedicada a la venta directa de productos para el hogar. Desde 
                  entonces, hemos crecido hasta convertirnos en una de las empresas 
                  de venta directa más importantes del país.
                </p>
                <p className="text-base leading-relaxed mb-4">
                  Con más de 30 años de experiencia, hemos logrado posicionarnos 
                  como líderes en el mercado mexicano, ofreciendo productos 
                  innovadores que facilitan las tareas del hogar y mejoran la 
                  calidad de vida de nuestros clientes.
                </p>
                <p className="text-base leading-relaxed">
                  Hoy contamos con una amplia red de distribuidores y asociados 
                  en todo México, quienes comparten nuestra pasión por brindar 
                  productos de calidad y oportunidades de crecimiento a las 
                  familias mexicanas.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Compromiso */}
          <IonCard className="mb-6">
            <IonCardHeader>
              <IonCardTitle className="flex items-center">
                <IonIcon icon={heartOutline} className="mr-2 text-orange-600" />
                Nuestro Compromiso
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p className="text-base leading-relaxed">
                  En Betterware, estamos comprometidos con el desarrollo sostenible, 
                  la responsabilidad social y el bienestar de nuestros colaboradores, 
                  clientes y comunidades. Trabajamos constantemente para mantener 
                  los más altos estándares de calidad en nuestros productos y 
                  servicios, mientras contribuimos al crecimiento económico y 
                  social de México.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default AcercaDe;