import React, { useState, useEffect } from "react";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonImg,
  IonText,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { checkmarkCircleOutline, peopleOutline, heartOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

interface UneteData {
  Titulo: string;
  Subtitulo: string;
  TextoBoton: string;
  Imagen: string;
  ColorTitulo: string;
  ColorSubtitulo: string;
  Beneficios: string;
}

const UneteEquipo: React.FC = () => {
  const [currentData, setCurrentData] = useState<UneteData | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const getBeneficios = (): string[] => {
    if (currentData && currentData.Beneficios) {
      try {
        const parsed = JSON.parse(currentData.Beneficios || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const fetchUneteData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://backbetter-production.up.railway.app/unete-equipo/"
      );
      if (response.data && response.data.length > 0) {
        setCurrentData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching unete data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUneteData();
  }, []);

  const handleRefresh = (event: CustomEvent) => {
    fetchUneteData().finally(() => {
      event.detail.complete();
    });
  };

  const handleAfiliarme = () => {
    // Redirigir a registro de empleado/asociado
    // Como es una app móvil, podríamos redirigir a la página de registro
    history.push('/RegistroU');
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Únete al Equipo</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="crescent" color="primary" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const currentTitle = currentData?.Titulo || "Únete al Equipo Betterware";
  const currentSubtitle = currentData?.Subtitulo || "Forma parte de nuestra familia y alcanza el éxito";
  const currentButtonText = currentData?.TextoBoton || "Afiliarme Ahora";
  const currentImage = currentData?.Imagen || "";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Únete al Equipo</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent 
            pullingIcon="chevron-down-circle-outline"
            pullingText="Desliza para actualizar"
            refreshingSpinner="circles"
            refreshingText="Actualizando..."
          />
        </IonRefresher>

        <div className="p-0">
          {/* Hero Section */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            {currentImage && (
              <IonImg 
                src={currentImage}
                alt="Equipo Betterware"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center px-4">
                <h1 
                  className="text-2xl md:text-4xl font-bold mb-4"
                  style={{ color: currentData?.ColorTitulo || '#ffffff' }}
                >
                  {currentTitle}
                </h1>
                <p 
                  className="text-lg md:text-xl mb-6"
                  style={{ color: currentData?.ColorSubtitulo || '#ffffff' }}
                >
                  {currentSubtitle}
                </p>
                <IonButton 
                  color="warning"
                  size="large"
                  onClick={handleAfiliarme}
                >
                  {currentButtonText}
                </IonButton>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="p-4">
            <IonCard>
              <IonCardContent>
                <div className="text-center mb-6">
                  <IonIcon 
                    icon={peopleOutline} 
                    className="text-5xl text-teal-600 mb-2" 
                  />
                  <IonText>
                    <h2 className="text-2xl font-bold text-teal-700 mb-2">
                      Afíliate como Asociado
                    </h2>
                    <p className="text-lg font-semibold text-gray-700">
                      Y gana increíbles beneficios
                    </p>
                  </IonText>
                </div>

                {/* Benefits List */}
                <div className="mb-6">
                  <IonText>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <IonIcon icon={heartOutline} className="mr-2 text-red-500" />
                      Beneficios de ser Asociado:
                    </h3>
                  </IonText>
                  
                  <IonList>
                    {getBeneficios().map((beneficio, index) => (
                      <IonItem key={index} lines="none">
                        <IonIcon 
                          icon={checkmarkCircleOutline} 
                          color="success" 
                          slot="start" 
                        />
                        <IonLabel className="ion-text-wrap">
                          <p className="text-base">{beneficio}</p>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <IonButton 
                    expand="block"
                    color="warning"
                    size="large"
                    onClick={handleAfiliarme}
                  >
                    <IonIcon icon={peopleOutline} slot="start" />
                    Afiliarme Ahora
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default UneteEquipo;