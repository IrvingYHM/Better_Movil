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
  IonSpinner, 
  IonIcon,
  IonImg,
  IonAlert
} from '@ionic/react';
import { downloadOutline, documentsOutline } from 'ionicons/icons';
import { API_ENDPOINTS } from '../services/Apis';
import Footer from '../components/Footer';

interface Catalogo {
  IdCatalogo: number;
  vchNombreCatalogo: string;
  vchCatalogo: string;
  imagenPortada?: string;
}

const Catalogos: React.FC = () => {
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.catalogos.getAll);
        if (!response.ok) {
          throw new Error('Error al cargar los catálogos');
        }
        const data = await response.json();
        setCatalogos(data);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    cargarCatalogos();
  }, []);

  const handleDownload = (catalogoUrl: string, catalogoNombre: string) => {
    const link = document.createElement('a');
    link.href = catalogoUrl;
    link.download = `${catalogoNombre}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Catálogos</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <IonSpinner name="crescent" color="primary" />
            </div>
          ) : catalogos.length === 0 ? (
            <div className="text-center py-16">
              <IonIcon 
                icon={documentsOutline} 
                className="text-6xl text-gray-400 mb-4" 
              />
              <h3 className="text-xl font-semibold mb-3 text-gray-600">
                No hay catálogos disponibles
              </h3>
              <p className="text-gray-500">
                Los catálogos estarán disponibles próximamente
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogos.map((catalogo) => (
                <IonCard key={catalogo.IdCatalogo} className="h-full">
                  <IonCardContent>
                    {/* Título */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-orange-600 line-clamp-2">
                        {catalogo.vchNombreCatalogo}
                      </h3>
                    </div>

                    {/* Imagen de portada */}
                    <div className="mb-4 flex justify-center">
                      {catalogo.imagenPortada ? (
                        <IonImg 
                          src={catalogo.imagenPortada}
                          alt={`Portada de ${catalogo.vchNombreCatalogo}`}
                          className="max-h-48 w-auto rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <IonIcon 
                            icon={documentsOutline} 
                            className="text-4xl text-gray-400" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Botón de descarga */}
                    <div className="text-center">
                      <IonButton
                        expand="block"
                        color="warning"
                        onClick={() => handleDownload(catalogo.vchCatalogo, catalogo.vchNombreCatalogo)}
                      >
                        <IonIcon icon={downloadOutline} slot="start" />
                        Descargar PDF
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>

        <Footer />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Error'}
          message={error || 'Ha ocurrido un error'}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Catalogos;