import React, { useEffect, useState } from "react";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonBadge,
  IonImg,
  IonButton,
  IonModal,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { 
  trophyOutline, 
  peopleOutline, 
  trendingUpOutline, 
  eyeOutline, 
  closeOutline,
  medalOutline,
  flagOutline
} from 'ionicons/icons';
import axios from 'axios';
import Footer from '../components/Footer';

interface EmpleadoInfo {
  vchNombre: string;
  vchAPaterno: string;
  vchAMaterno: string;
}

interface TopVentasItem {
  id?: number;
  empleado: EmpleadoInfo;
  numVentas: number;
}

interface TopReferidosItem {
  id?: number;
  empleado: EmpleadoInfo;
  numReferidos: number;
}

interface ImagenReto {
  Imagen: string;
}

interface ImagenesData {
  [key: string]: ImagenReto[];
}

const obtenerMesAnteriorYAño = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return {
    mes: meses[date.getMonth()],
    año: date.getFullYear(),
  };
};

const Retos: React.FC = () => {
  const [{ mes, año }] = useState(obtenerMesAnteriorYAño());
  const [topVentas, setTopVentas] = useState<TopVentasItem[]>([]);
  const [topReferidos, setTopReferidos] = useState<TopReferidosItem[]>([]);
  const [imagenes, setImagenes] = useState<ImagenesData>({});
  const [loading, setLoading] = useState({
    topVentas: true,
    topReferidos: true,
    imagenesVentas: true,
    imagenesAfiliados: true
  });
  const [modalGanadoresVentas, setModalGanadoresVentas] = useState(false);
  const [modalGanadoresAfiliados, setModalGanadoresAfiliados] = useState(false);

  const cargarDatos = async () => {
    // Reset loading states
    setLoading({
      topVentas: true,
      topReferidos: true,
      imagenesVentas: true,
      imagenesAfiliados: true
    });

    try {
      // Load top ventas
      const ventasResponse = await axios.get(`https://backbetter-production.up.railway.app/top-vendedor?month=${mes}&year=${año}`);
      setTopVentas(ventasResponse.data.slice(0, 10));
      setLoading(prev => ({ ...prev, topVentas: false }));
    } catch (error) {
      console.error("Error cargando top ventas", error);
      setLoading(prev => ({ ...prev, topVentas: false }));
    }

    try {
      // Load top referidos
      const referidosResponse = await axios.get(`https://backbetter-production.up.railway.app/top-referidos?month=${mes}&year=${año}`);
      setTopReferidos(referidosResponse.data.slice(0, 10));
      setLoading(prev => ({ ...prev, topReferidos: false }));
    } catch (error) {
      console.error("Error cargando top referidos", error);
      setLoading(prev => ({ ...prev, topReferidos: false }));
    }

    // Load images
    const tipos = [
      "retos-ventas",
      "ganadores-ventas", 
      "retos-afiliados",
      "ganadores-afiliados",
    ];

    let imagenesVentasLoaded = 0;
    let imagenesAfiliadosLoaded = 0;
    const ventasTypes = ["retos-ventas", "ganadores-ventas"];
    const afiliadosTypes = ["retos-afiliados", "ganadores-afiliados"];

    for (const tipo of tipos) {
      try {
        const response = await axios.get(`https://backbetter-production.up.railway.app/imagenes/filtrar/${tipo}`);
        setImagenes(prev => ({ ...prev, [tipo]: response.data }));
        
        if (ventasTypes.includes(tipo)) {
          imagenesVentasLoaded++;
          if (imagenesVentasLoaded === ventasTypes.length) {
            setLoading(prev => ({ ...prev, imagenesVentas: false }));
          }
        }
        
        if (afiliadosTypes.includes(tipo)) {
          imagenesAfiliadosLoaded++;
          if (imagenesAfiliadosLoaded === afiliadosTypes.length) {
            setLoading(prev => ({ ...prev, imagenesAfiliados: false }));
          }
        }
      } catch (error) {
        console.error(`Error cargando imágenes de tipo ${tipo}`, error);
        
        if (ventasTypes.includes(tipo)) {
          imagenesVentasLoaded++;
          if (imagenesVentasLoaded === ventasTypes.length) {
            setLoading(prev => ({ ...prev, imagenesVentas: false }));
          }
        }
        
        if (afiliadosTypes.includes(tipo)) {
          imagenesAfiliadosLoaded++;
          if (imagenesAfiliadosLoaded === afiliadosTypes.length) {
            setLoading(prev => ({ ...prev, imagenesAfiliados: false }));
          }
        }
      }
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [mes, año]);

  const handleRefresh = (event: CustomEvent) => {
    cargarDatos().finally(() => {
      event.detail.complete();
    });
  };

  const renderTopList = (
    lista: TopVentasItem[] | TopReferidosItem[], 
    tipo: "Ventas" | "Afiliados", 
    isLoading: boolean
  ) => {
    if (isLoading) {
      return (
        <IonCard>
          <IonCardContent>
            <div className="flex justify-center py-8">
              <IonSpinner name="crescent" color="primary" />
            </div>
          </IonCardContent>
        </IonCard>
      );
    }

    const isVentas = tipo === "Ventas";

    return (
      <IonCard>
        <IonCardContent>
          <div className="flex items-center mb-4">
            <IonIcon 
              icon={isVentas ? trendingUpOutline : peopleOutline} 
              className="mr-2 text-orange-600" 
              size="large"
            />
            <div>
              <h3 className="text-lg font-bold">Top {tipo}</h3>
              <p className="text-sm text-gray-600">{mes} {año}</p>
            </div>
          </div>
          
          {lista.length === 0 ? (
            <div className="text-center py-8">
              <IonIcon 
                icon={isVentas ? trendingUpOutline : peopleOutline}
                className="text-4xl text-gray-400 mb-2" 
              />
              <p className="text-gray-500">No hay datos disponibles para {mes} {año}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lista.map((item, index) => {
                const isTop3 = index < 3;
                const badgeColor = index === 0 ? 'warning' : index === 1 ? 'medium' : index === 2 ? 'tertiary' : 'light';
                
                return (
                  <IonItem key={item.id || index} className={isTop3 ? 'bg-orange-50' : ''}>
                    <IonBadge color={badgeColor} slot="start" className="mr-3">
                      {index === 0 ? <IonIcon icon={medalOutline} /> : `#${index + 1}`}
                    </IonBadge>
                    <IonLabel>
                      <h4 className="font-semibold">
                        {item.empleado?.vchNombre} {item.empleado?.vchAPaterno} {item.empleado?.vchAMaterno}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isVentas 
                          ? `${(item as TopVentasItem).numVentas} ventas`
                          : `${(item as TopReferidosItem).numReferidos} referidos`
                        }
                      </p>
                    </IonLabel>
                  </IonItem>
                );
              })}
            </div>
          )}
        </IonCardContent>
      </IonCard>
    );
  };

  const renderImagenReto = (
    tipoReto: string,
    tipoGanador: string,
    titulo: string,
    isLoading: boolean,
    onVerGanadores: () => void
  ) => {
    if (isLoading) {
      return (
        <IonCard>
          <IonCardContent>
            <div className="flex justify-center py-8">
              <IonSpinner name="crescent" color="primary" />
            </div>
          </IonCardContent>
        </IonCard>
      );
    }

    const imagenReto = imagenes[tipoReto]?.[0]?.Imagen;
    const imagenGanador = imagenes[tipoGanador]?.[0]?.Imagen;

    return (
      <IonCard>
        <IonCardContent>
          <div className="flex items-center mb-4">
            <IonIcon icon={flagOutline} className="mr-2 text-orange-600" size="large" />
            <h3 className="text-lg font-bold">{titulo}</h3>
          </div>

          {imagenReto ? (
            <div className="mb-4">
              <IonImg 
                src={imagenReto}
                alt="Imagen del reto"
                className="rounded-lg shadow-md"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <IonIcon icon={flagOutline} className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500">No hay imagen de reto</p>
              </div>
            </div>
          )}

          {imagenGanador && (
            <IonButton 
              expand="block" 
              color="warning"
              onClick={onVerGanadores}
            >
              <IonIcon icon={eyeOutline} slot="start" />
              Ver Ganadores
            </IonButton>
          )}
        </IonCardContent>
      </IonCard>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Retos y Desafíos</IonTitle>
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

        <div className="p-4">
          {/* Sección de Ventas */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <IonIcon icon={trophyOutline} className="mr-2 text-green-600" size="large" />
              <h2 className="text-xl font-bold">Retos de Ventas</h2>
            </div>
            
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-lg="6">
                  {renderTopList(topVentas, "Ventas", loading.topVentas)}
                </IonCol>
                <IonCol size="12" size-lg="6">
                  {renderImagenReto(
                    "retos-ventas",
                    "ganadores-ventas", 
                    "Reto - Ventas",
                    loading.imagenesVentas,
                    () => setModalGanadoresVentas(true)
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>

          {/* Sección de Afiliaciones */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <IonIcon icon={peopleOutline} className="mr-2 text-blue-600" size="large" />
              <h2 className="text-xl font-bold">Retos de Afiliaciones</h2>
            </div>
            
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-lg="6">
                  {renderTopList(topReferidos, "Afiliados", loading.topReferidos)}
                </IonCol>
                <IonCol size="12" size-lg="6">
                  {renderImagenReto(
                    "retos-afiliados",
                    "ganadores-afiliados",
                    "Reto - Afiliaciones", 
                    loading.imagenesAfiliados,
                    () => setModalGanadoresAfiliados(true)
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>

        <Footer />

        {/* Modal Ganadores Ventas */}
        <IonModal isOpen={modalGanadoresVentas} onDidDismiss={() => setModalGanadoresVentas(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                <IonIcon icon={medalOutline} className="mr-2" />
                Ganadores - Ventas
              </IonTitle>
              <IonButton 
                fill="clear" 
                slot="end" 
                onClick={() => setModalGanadoresVentas(false)}
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="p-4">
              {imagenes["ganadores-ventas"]?.[0]?.Imagen ? (
                <IonImg 
                  src={imagenes["ganadores-ventas"][0].Imagen}
                  alt="Ganadores de ventas"
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="text-center py-8">
                  <p>No hay imagen de ganadores disponible</p>
                </div>
              )}
            </div>
          </IonContent>
        </IonModal>

        {/* Modal Ganadores Afiliados */}
        <IonModal isOpen={modalGanadoresAfiliados} onDidDismiss={() => setModalGanadoresAfiliados(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                <IonIcon icon={medalOutline} className="mr-2" />
                Ganadores - Afiliados
              </IonTitle>
              <IonButton 
                fill="clear" 
                slot="end" 
                onClick={() => setModalGanadoresAfiliados(false)}
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="p-4">
              {imagenes["ganadores-afiliados"]?.[0]?.Imagen ? (
                <IonImg 
                  src={imagenes["ganadores-afiliados"][0].Imagen}
                  alt="Ganadores de afiliados"
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="text-center py-8">
                  <p>No hay imagen de ganadores disponible</p>
                </div>
              )}
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Retos;