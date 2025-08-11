import React, { useState, useEffect, useRef } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonCard, 
  IonCardContent, 
  IonButton, 
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonImg,
  IonRouterLink,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { 
  chevronBackOutline, 
  chevronForwardOutline,
  pricetag,
  arrowForwardOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/UI/header';
import ImageSlider from '../components/ImageSlider';
import ScrollButton from '../components/ScrollButton';
import PromocionesLoading from '../components/PromocionesLoading';
import { fetchProducts } from '../services/Apis';

interface Producto {
  IdProducto: number;
  vchNombreProducto: string;
  Precio: string | number;
  PrecioOferta?: string | number;
  EnOferta?: boolean;
  vchNomImagen?: string;
}

const Home: React.FC = () => {
  const [promociones, setPromociones] = useState<Producto[]>([]);
  const [loadingPromociones, setLoadingPromociones] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const history = useHistory();

  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        setLoadingPromociones(true);
        const productos = await fetchProducts();
        
        // Filtrar productos con ofertas reales
        const productosEnOferta = productos.filter((producto: Producto) => {
          if (!producto.EnOferta || !producto.PrecioOferta) return false;
          const precioOriginal = parseFloat(producto.Precio.toString()) || 0;
          const precioOferta = parseFloat(producto.PrecioOferta.toString()) || 0;
          return precioOferta < precioOriginal;
        });
        
        setPromociones(productosEnOferta);
      } catch (error) {
        console.error("Error al cargar promociones:", error);
        setPromociones([]);
      } finally {
        setLoadingPromociones(false);
      }
    };

    cargarPromociones();
  }, []);

  const calcularDescuento = (precioOriginal: number, precioOferta: number) => {
    const descuento = ((precioOriginal - precioOferta) / precioOriginal) * 100;
    return Math.round(descuento);
  };

  // Función para formatear precios
  const formatearPrecio = (precio: number) => {
    if (precio % 1 === 0) {
      // Si no tiene decimales, mostrar sin decimales
      return precio.toFixed(0);
    } else {
      // Si tiene decimales, mantenerlos
      return precio.toFixed(2);
    }
  };

  // Función para separar enteros y decimales
  const separarPrecio = (precio: number) => {
    const parteEntera = Math.floor(precio);
    const parteDecimal = precio % 1;
    
    if (parteDecimal === 0) {
      return { entero: parteEntera.toString(), decimal: '' };
    } else {
      const decimalStr = (parteDecimal.toFixed(2)).substring(1); // .XX
      return { entero: parteEntera.toString(), decimal: decimalStr };
    }
  };

  // Configuración para móvil: mostrar 2 cards pero con overflow para ver parte de la siguiente
  const getVisibleCards = () => {
    return 2; // Navegación por 2 cards a la vez
  };

  // Funciones del carrusel
  const nextSlide = () => {
    if (promociones.length > visibleCards) {
      setCurrentSlide((prev) => {
        const maxSlide = promociones.length - visibleCards;
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }
  };

  const prevSlide = () => {
    if (promociones.length > visibleCards) {
      setCurrentSlide((prev) => {
        const maxSlide = promociones.length - visibleCards;
        return prev <= 0 ? maxSlide : prev - 1;
      });
    }
  };

  const goToProducto = (id: number) => {
    history.push(`/Productos/${id}`);
  };

  // Auto-play del carrusel
  useEffect(() => {
    if (promociones.length > visibleCards) {
      const interval = setInterval(() => {
        nextSlide();
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [promociones.length, visibleCards]);

  useEffect(() => {
    setVisibleCards(2); // 2 cards por vista
  }, []);

  const handleRefresh = (event: CustomEvent) => {
    // Recargar promociones
    const cargarPromociones = async () => {
      try {
        const productos = await fetchProducts();
        const productosEnOferta = productos.filter((producto: Producto) => {
          if (!producto.EnOferta || !producto.PrecioOferta) return false;
          const precioOriginal = parseFloat(producto.Precio.toString()) || 0;
          const precioOferta = parseFloat(producto.PrecioOferta.toString()) || 0;
          return precioOferta < precioOriginal;
        });
        setPromociones(productosEnOferta);
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      }
    };

    cargarPromociones().finally(() => {
      event.detail.complete();
    });
  };

  const getColSize = () => {
    return "6"; // 2 cards: 12/2 = 6
  };

  return (
    <IonPage id="main-content"> 
      <Header />

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent 
            pullingIcon="chevron-down-circle-outline"
            pullingText="Desliza para actualizar"
            refreshingSpinner="circles"
            refreshingText="Actualizando..."
          />
        </IonRefresher>

        <div className="">
          {/* Slider principal */}
          <ImageSlider />

          {/* Separador de promociones */}
          <div className="flex items-center justify-center">
            <div className="h-1 mt-2 bg-teal-500 flex-1"></div>
            <IonText>
              <h2 className="mx-1 text-2xl font-bold">
                PROMOCIONES
              </h2>
            </IonText>
            <div className="h-1 mt-2 bg-teal-500 flex-1"></div>
          </div>

          {/* Carrusel de promociones */}
          {loadingPromociones ? (
            <PromocionesLoading visibleCards={visibleCards} />
          ) : promociones.length > 0 ? (
            <>
              <div className="relative mb-6">
                {/* Container con overflow para mostrar 2 cards + parte de la tercera */}
                <div className="overflow-hidden px-">
                  <div 
                    className="flex transition-transform duration-300"
                    style={{ 
                      transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`,
                      width: `${(promociones.length / visibleCards) * 14}%`
                    }}
                  >
                    {promociones.map((producto, index) => {
                      const precioOriginal = parseFloat(producto.Precio.toString()) || 0;
                      const precioOferta = parseFloat(producto.PrecioOferta?.toString() || '0') || 0;
                      const descuento = calcularDescuento(precioOriginal, precioOferta);
                      
                      // Convertir HTTP a HTTPS para evitar problemas de contenido mixto
                      const imageUrl = producto.vchNomImagen 
                        ? producto.vchNomImagen.replace('http://', 'https://') 
                        : "/assets/placeholder.svg";
                      
                      console.log(`Promoción ${producto.vchNombreProducto}: ${imageUrl}`);

                      return (
                        <div key={`${producto.IdProducto}-${index}`} className="flex-shrink-0" style={{ width: `${100 / visibleCards}%` }}>
                          <IonCard 
                            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                            onClick={() => goToProducto(producto.IdProducto)}
                          >
                            <div className="relative">
                              {/* Etiqueta de descuento */}
                              <IonBadge
                                className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg"
                              >
                                -{descuento}%
                              </IonBadge>

                              <IonImg 
                                src={imageUrl}
                                alt={producto.vchNombreProducto}
                                className="h-32 object-cover"
                                onIonError={(e: CustomEvent) => {
                                  const target = e.target as HTMLIonImgElement;
                                  if (target.src !== "/assets/placeholder.svg") {
                                    target.src = "/assets/placeholder.svg";
                                    console.error(`Error cargando imagen: ${imageUrl}`);
                                  }
                                }}
                              />
                            </div>

                            <IonCardContent>
                              <IonText>
                                <h3 className="font-bold text-sm line-clamp-2 h-10">
                                  {producto.vchNombreProducto}
                                </h3>
                              </IonText>

                              {/* Precios */}
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Precio de oferta */}
                                  <IonText color="success">
                                    <span className="font-bold text-lg">
                                      ${(() => {
                                        const { entero, decimal } = separarPrecio(precioOferta);
                                        return (
                                          <>
                                            {entero}
                                            {decimal && <span className="text-sm">{decimal}</span>}
                                          </>
                                        );
                                      })()}
                                    </span>
                                  </IonText>
                                  
                                  {/* Precio original tachado (más pequeño) */}
                                  <IonText color="medium">
                                    <span className="line-through text-xs">
                                      ${formatearPrecio(precioOriginal)}
                                    </span>
                                  </IonText>
                                </div>
                                
                                <div className="bg-green-50 text-green-700 text-xs font-bold py-1 px-2 rounded text-center">
                                  Ahorras ${formatearPrecio(precioOriginal - precioOferta)}
                                </div>
                              </div>
                            </IonCardContent>
                          </IonCard>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botones de navegación */}
                {promociones.length > visibleCards && (
                  <>
                    <IonFab 
                      vertical="center" 
                      horizontal="start" 
                      style={{ position: 'absolute', left: '-6px' }}
                    >
                        <IonButton
                          fill="clear" 
                          className="absolute top-1/2 -left-2 transform -translate-y-1/2 z-30" 
                          onClick={prevSlide}>
                          <IonIcon className="text-white text-2xl bg-black/50 rounded-full p-1" icon={chevronBackOutline} 
                          />
                      </IonButton>
                    </IonFab>
                    
                    <IonFab 
                      vertical="center" 
                      horizontal="end" 
                      style={{ position: 'absolute', right: '-6px' }}
                    >
                        <IonButton
                          fill="clear"
                          className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-30" onClick={nextSlide}>
                        <IonIcon 
                          className="text-white text-2xl bg-black/50 rounded-full p-1"
                          icon={chevronForwardOutline}
                        />
                      </IonButton>
                    </IonFab>
                  </>
                )}
              </div>

              {/* Indicadores de puntos */}
              {promociones.length > visibleCards && (
                <div className="flex justify-center mb-6 space-x-2">
                  {Array.from({ length: promociones.length - visibleCards + 1 }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? 'bg-teal-500 w-6'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Botón para ver todas las promociones */}
              <div className="text-center mb-6">
                <IonButton
                  fill="clear"
                  className="bg-gradient-to-r from-teal-400 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg mx-3 hover:shadow-xl transform hover:scale-105 border-2 border-teal-500"
                  routerLink="/Productos"
                >
                  Ver todas las promociones ({promociones.length} ofertas)
                </IonButton>
              </div>
            </>
          ) : (
            <IonCard>
              <IonCardContent className="text-center py-12">
                <IonText>
                  <h3 className="text-xl font-bold text-gray-500 mb-2">
                    Sin promociones activas
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    No hay ofertas disponibles en este momento, pero tenemos muchos productos increíbles esperándote.
                  </p>
                </IonText>
                <IonButton 
                  color="primary"
                  routerLink="/Productos"
                >
                  Ver todos los productos
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}
        </div>

        {/* Scroll buttons */}
        <ScrollButton />
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
