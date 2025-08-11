import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonImg,
  IonText,
  IonButton,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonRefresher,
  IonRefresherContent,
  IonIcon
} from '@ionic/react';
import {
  chevronBackOutline,
  chevronForwardOutline,
  bagOutline,
  pricetagOutline,
  pieChartOutline
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';

import Footer from '../../components/Footer';
import Header from '../../components/UI/header';
import { obtenerProductos } from './Api';
import { ProductSkeletonGrid } from './ProductSkeleton';

interface Producto {
  IdProducto: number;
  vchNombreProducto: string;
  Precio: string | number;
  PrecioOferta?: string | number;
  EnOferta?: boolean;
  vchNomImagen?: string;
  IdCategoria: number;
  Existencias: number;
}

interface Categoria {
  IdCategoria: number;
  NombreCategoria: string;
}

const Productos: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [resultadosCategoria, setResultadosCategoria] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtroActivo, setFiltroActivo] = useState<string>("todos");
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 20; // Menos productos por página para móvil

  // Función para formatear precios
  const formatearPrecio = (precio: number) => {
    if (precio % 1 === 0) {
      return precio.toFixed(0);
    } else {
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

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      
      try {
        // Cargar productos y categorías en paralelo
        const [productosData, categoriasResponse] = await Promise.all([
          obtenerProductos(),
          fetch("https://backbetter-production.up.railway.app/categoria/")
        ]);

        const categoriasData = await categoriasResponse.json();
        
        setProductos(productosData);
        setResultadosCategoria(productosData);
        setCategorias(categoriasData);
        
        // Verificar si hay parámetros de filtro en la URL
        const urlParams = new URLSearchParams(location.search);
        const filtroParam = urlParams.get('filter');
        if (filtroParam === 'promociones') {
          setFiltroActivo('promociones');
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [location.search]);

  // Aplicar filtros cuando cambie el filtro activo
  useEffect(() => {
    aplicarFiltro(filtroActivo);
  }, [filtroActivo, productos]);

  // Función para aplicar filtros
  const aplicarFiltro = (filtro: string) => {
    let productosFiltrados: Producto[] = [];

    if (filtro === "todos") {
      productosFiltrados = productos;
    } else if (filtro === "promociones") {
      productosFiltrados = productos.filter(producto => {
        if (!producto.EnOferta || !producto.PrecioOferta) return false;
        const precioOriginal = parseFloat(producto.Precio.toString()) || 0;
        const precioOferta = parseFloat(producto.PrecioOferta.toString()) || 0;
        return precioOferta < precioOriginal;
      });
    } else {
      // Filtrar por categoría específica
      productosFiltrados = productos.filter(producto => 
        producto.IdCategoria.toString() === filtro.toString()
      );
    }

    setResultadosCategoria(productosFiltrados);
    setCurrentPage(1); // Reset página al filtrar
  };

  // Función para cambiar filtro
  const cambiarFiltro = (nuevoFiltro: string) => {
    setFiltroActivo(nuevoFiltro);
  };

  // Contar productos por categoría y promociones
  const contarProductosPorFiltro = (filtro: string) => {
    if (filtro === "todos") return productos.length;
    if (filtro === "promociones") {
      return productos.filter(producto => {
        if (!producto.EnOferta || !producto.PrecioOferta) return false;
        const precioOriginal = parseFloat(producto.Precio.toString()) || 0;
        const precioOferta = parseFloat(producto.PrecioOferta.toString()) || 0;
        return precioOferta < precioOriginal;
      }).length;
    }
    return productos.filter(producto => 
      producto.IdCategoria.toString() === filtro.toString()
    ).length;
  };

  // Lógica de paginación
  const totalProducts = resultadosCategoria.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = resultadosCategoria.slice(startIndex, endIndex);

  // Funciones de navegación de páginas
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToProducto = (id: number) => {
    history.push(`/Productos/${id}`);
  };

  const handleRefresh = (event: CustomEvent) => {
    const cargarDatos = async () => {
      try {
        const [productosData, categoriasResponse] = await Promise.all([
          obtenerProductos(),
          fetch("https://backbetter-production.up.railway.app/categoria/")
        ]);

        const categoriasData = await categoriasResponse.json();
        
        setProductos(productosData);
        setResultadosCategoria(productosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos().finally(() => {
      event.detail.complete();
    });
  };

  return (
    <IonPage id="main-content">
      <Header />   
         
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent 
            pullingIcon="chevron-down-circle-outline"
            pullingText="Desliza para actualizar"
            refreshingSpinner="circles"
            refreshingText="Actualizando..."
          />
        </IonRefresher>

        <div className="mt-2">
          {/* Barra de filtros minimalista para móvil */}
          <div className="px-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <IonIcon icon={bagOutline} className="text-teal-500 text-lg" />
                <IonText className="font-bold">{totalProducts} productos</IonText>
              </div>
            </div>

            {/* Filtros principales y selector de categorías */}
            <div className="space-y-3">
              {/* Filtros principales */}
              <div className="flex gap-2">
                <IonButton
                  fill={"clear"}
                  className={`${filtroActivo === "todos"
                      ? "bg-teal-500 text-white py-1 rounded-full font-semibold shadow-md transform scale-105"
                      : "hover:text-teal-700 hover:bg-teal-100 py-1 rounded-full"
                    } transition-all duration-200 ease-in-out text-xs`}
                  onClick={() => cambiarFiltro("todos")}
                >
                  ✨ Todos
                </IonButton>

                <IonButton
                  fill={"clear"}
                  className={`${filtroActivo === "promociones"
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white py-1 rounded-full font-semibold shadow-md transform scale-105"
                      : "hover:text-red-600 hover:bg-red-50 py-1 rounded-full"
                    } transition-all duration-200 ease-in-out text-xs`}
                  onClick={() => cambiarFiltro("promociones")}
                >
                  🔥 Promociones ({contarProductosPorFiltro("promociones")})
                  </IonButton>

                {/* Selector de categorías visible */}
                <div className="relative">
                  <IonSelect
                    value={filtroActivo}
                    placeholder="📂 Categorías..."
                    onIonChange={(e: CustomEvent) => cambiarFiltro(e.detail.value)}
                    interface="popover"
                    className={`text-xs bg-white border border-gray-300 rounded-full px-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${categorias.some(
                      (c) => c.IdCategoria.toString() === filtroActivo
                    )
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md py-1"
                      : "hover:border-blue-400 hover:shadow-sm py-1"
                      }`}
                  >
                    {categorias.map((categoria) => (
                      <IonSelectOption
                        key={categoria.IdCategoria}
                        value={categoria.IdCategoria.toString()}
                      >
                        {categoria.NombreCategoria} ({contarProductosPorFiltro(categoria.IdCategoria.toString())})
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <ProductSkeletonGrid count={8} />
          ) : totalProducts === 0 ? (
            <div className="px-2">
              <IonCard>
                <IonCardContent className="text-center py-12">
                  <IonIcon 
                    icon={filtroActivo === "promociones" ? pieChartOutline : pricetagOutline} 
                    className="text-6xl text-gray-400 mb-4" 
                  />
                  <IonText>
                    <h3 className="text-xl font-bold mb-2">
                      {filtroActivo === "promociones" 
                        ? "No hay promociones disponibles"
                        : "No hay productos en esta categoría"
                      }
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {filtroActivo === "promociones"
                        ? "Actualmente no tenemos productos en oferta. Te invitamos a explorar nuestro catálogo completo."
                        : "No encontramos productos en la categoría seleccionada. Prueba con otra categoría."
                      }
                    </p>
                  </IonText>
                  <IonButton 
                    color="primary"
                    onClick={() => cambiarFiltro("todos")}
                  >
                    Ver todos los productos
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </div>
          ) : (
            <>
              {/* Grid de productos optimizado para móvil */}
              <div className="px-2">
                <div className="grid grid-cols-2 gap-0">
                  {paginatedProducts.map((producto) => {
                    const precioOriginal = parseFloat(producto.Precio.toString()) || 0;
                    const precioOferta = parseFloat(producto.PrecioOferta?.toString() || '0') || 0;
                    const tieneOferta = producto.EnOferta && producto.PrecioOferta && precioOferta < precioOriginal;
                    const descuento = tieneOferta ? Math.round(((precioOriginal - precioOferta) / precioOriginal) * 100) : 0;
                    
                    // Convertir HTTP a HTTPS para evitar problemas de contenido mixto
                    const imageUrl = producto.vchNomImagen 
                      ? producto.vchNomImagen.replace('http://', 'https://') 
                      : "/assets/placeholder.svg";

                    return (
                      <IonCard 
                        key={producto.IdProducto}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 relative"
                        onClick={() => goToProducto(producto.IdProducto)}
                      >
                        {/* Badge de oferta */}
                        {tieneOferta && (
                          <>
                            <IonBadge 
                              color="danger" 
                              className="absolute rounded-full p-1 top-2 left-2 z-10 text-xs"
                            >
                              OFERTA
                            </IonBadge>
                            <IonBadge 
                              color="success" 
                              className="absolute rounded-full p-1 top-2 right-2 z-10 text-xs"
                            >
                              -{descuento}%
                            </IonBadge>
                          </>
                        )}

                        <div className="relative h-40">
                          <IonImg
                            src={imageUrl}
                            alt={producto.vchNombreProducto}
                            className="h-full w-full object-cover"
                            onIonError={(e: CustomEvent) => {
                              const target = e.target as HTMLIonImgElement;
                              if (target.src !== "/assets/placeholder.svg") {
                                target.src = "/assets/placeholder.svg";
                                console.error(`Error cargando imagen: ${imageUrl}`);
                              }
                            }}
                          />
                        </div>

                        <IonCardContent className="p-3 text-black">
                          <IonText>
                            <h3 className="text-sm font-semibold line-clamp-2 mb-2">
                              {producto.vchNombreProducto}
                            </h3>
                          </IonText>

                          {/* Precios */}
                          <div className="space-y-1">
                            {tieneOferta ? (
                              <>
                                <div className='flex flex-col'>
                                  <IonText>
                                    <span className="text-xs line-through">
                                      ${formatearPrecio(precioOriginal)}
                                    </span>
                                  </IonText>
                                  <IonText color="danger">
                                    <span className="text-lg font-bold">
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
                                </div>
                                <IonText color="success">
                                  <small className="block">
                                    Ahorras ${formatearPrecio(precioOriginal - precioOferta)}
                                  </small>
                                </IonText>
                              </>
                            ) : (
                              <IonText>
                                <span className="text-lg font-bold">
                                  ${(() => {
                                    const { entero, decimal } = separarPrecio(precioOriginal);
                                    return (
                                      <>
                                        {entero}
                                        {decimal && <span className="text-sm">{decimal}</span>}
                                      </>
                                    );
                                  })()}
                                </span>
                              </IonText>
                            )}
                          </div>
                        </IonCardContent>
                      </IonCard>
                    );
                  })}
                </div>
              </div>

              {/* Paginación minimalista para móvil */}
              {totalPages > 1 && (
                <div className="mt-6 mb-4">
                  {/* Información simple */}
                  <div className="text-center mb-3">
                    <IonText className="text-sm text-gray-600">
                      Página {currentPage} de {totalPages} • {totalProducts} productos
                    </IonText>
                  </div>

                  {/* Controles de navegación compactos */}
                  <div className="flex items-center justify-center gap-4">
                    <IonButton
                      fill="clear"
                      disabled={currentPage === 1}
                      onClick={goToPrevPage}
                      size="small"
                      className="w-12 h-12 rounded-full"
                    >
                      <IonIcon icon={chevronBackOutline} className="text-lg" />
                    </IonButton>

                    {/* Solo mostrar 3 números de página en móvil */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 3) {
                          pageNum = i + 1;
                        } else {
                          if (currentPage === 1) {
                            pageNum = i + 1;
                          } else if (currentPage === totalPages) {
                            pageNum = totalPages - 2 + i;
                          } else {
                            pageNum = currentPage - 1 + i;
                          }
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                          <IonButton
                            key={pageNum}
                            fill={pageNum === currentPage ? "solid" : "clear"}
                            color="primary"
                            size="small"
                            onClick={() => goToPage(pageNum)}
                            className="w-10 h-10 rounded-full"
                          >
                            {pageNum}
                          </IonButton>
                        );
                      })}
                    </div>

                    <IonButton
                      fill="clear"
                      disabled={currentPage === totalPages}
                      onClick={goToNextPage}
                      size="small"
                      className="w-12 h-12 rounded-full"
                    >
                      <IonIcon icon={chevronForwardOutline} className="text-lg" />
                    </IonButton>
                  </div>

                  {/* Salto rápido de página solo si hay muchas páginas */}
                  {totalPages > 10 && (
                    <div className="mt-3 flex justify-center">
                      <IonSelect
                        value={currentPage}
                        placeholder="Ir a página..."
                        onIonChange={(e: CustomEvent) => goToPage(parseInt(e.detail.value))}
                        interface="popover"
                        className="text-xs"
                      >
                        {Array.from({ length: totalPages }, (_, i) => (
                          <IonSelectOption key={i + 1} value={i + 1}>
                            Página {i + 1}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Productos;