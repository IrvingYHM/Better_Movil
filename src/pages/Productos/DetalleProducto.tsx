import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonContent, IonHeader, IonPage, IonToolbar, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonLoading,
  IonButton, IonBackButton, IonButtons, IonIcon, IonSpinner, IonText
} from '@ionic/react';
import { addOutline, removeOutline } from 'ionicons/icons';
import Header from '../../components/UI/header';
import Footer from '../../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import { API_ENDPOINTS } from '../../services/Apis';

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

interface Producto {
  IdProducto: number;
  vchNombreProducto: string;
  vchNomImagen: string;
  vchDescripcion: string;
  Precio: string | number;
  PrecioOferta?: string | number;
  EnOferta?: boolean;
  Existencias: number;
  IdCategoria: number;
  IdMarca: number;
  categoria?: {
    NombreCategoria: string;
  };
  marca?: {
    NombreMarca: string;
  };
}

const DetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [existencias, setExistencias] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState<boolean>(false);
  const [userType, setUserType] = useState<any>(null);
  const [clienteId, setClienteId] = useState<string>("");


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
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          API_ENDPOINTS.productos.getById,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ IdProducto: id }),
          }
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setProducto(data);
        setExistencias(1);
        setLoading(false);
      } catch (error: any) {
        console.error('Error al cargar el producto:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const incrementarExistencias = () => {
    if (producto && existencias < producto.Existencias) {
      setExistencias(existencias + 1);
    } else {
      toast.error("No hay suficientes productos en existencia.");
    }
  };

  const decrementarExistencias = () => {
    if (existencias > 1) {
      setExistencias(existencias - 1);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      setUserType(decodedToken.userType);
      setClienteId(decodedToken.clienteId);
      setUsuarioLogueado(true);
    }
  }, [clienteId]);

  const agregarAlCarrito = async () => {
    console.log('Datos del carrito:', {
      usuarioLogueado,
      clienteId,
      existencias,
      producto: producto?.IdProducto,
      productoExistencias: producto?.Existencias
    });

    // Validaciones iniciales
    if (!usuarioLogueado) {
      toast.error("Aún no has iniciado sesión.");
      return;
    }

    if (!clienteId) {
      toast.error("Error: ID de cliente no encontrado.");
      return;
    }

    if (existencias <= 0) {
      toast.error("No hay suficientes productos en existencia.");
      return;
    }

    if (addingToCart || !producto) {
      return; // Evitar múltiples clicks
    }

    const cantidadAAgregar = Math.min(existencias, producto.Existencias);
    
    setAddingToCart(true);
    
    try {
      // Crear carrito y detalles en una sola operación optimizada
      const carritoPayload = {
        IdProducto: producto.IdProducto,
        IdCliente: clienteId,
      };

      const carritoResponse = await fetch(API_ENDPOINTS.carrito.crear, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carritoPayload),
      });

      if (!carritoResponse.ok) {
        const errorData = await carritoResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${carritoResponse.status}: ${carritoResponse.statusText}`);
      }

      const carritoData = await carritoResponse.json();
      console.log('Carrito data recibida:', carritoData);

      // Crear detalles del carrito
      const precio = parseFloat(producto.Precio.toString()) || 0;
      const detallesPayload = {
        IdProducto: parseInt(producto.IdProducto.toString()),
        Precio: parseFloat(precio.toString()),
        Descripcion: (producto.vchDescripcion || producto.vchNombreProducto || 'Sin descripción').substring(0, 255),
        SubTotal: parseFloat((precio * cantidadAAgregar).toString()),
        Cantidad: parseInt(cantidadAAgregar.toString()),
        IdCarrito: parseInt(carritoData.IdCarrito.toString()),
      };

      const detallesResponse = await fetch(API_ENDPOINTS.carrito.detalles, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detallesPayload),
      });

      if (!detallesResponse.ok) {
        const errorData = await detallesResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${detallesResponse.status}: ${detallesResponse.statusText}`);
      }

      // Actualizar existencias localmente
      setExistencias(existencias - cantidadAAgregar);
      
      toast.success(`${cantidadAAgregar} producto(s) agregado(s) al carrito.`);
      
      // Navegar después de un breve delay
      setTimeout(() => {
        history.push("/Carrito");
      }, 3000);

    } catch (error: any) {
      console.error('Error al agregar al carrito:', error);
      toast.error(error.message || "Error al agregar producto al carrito.");
    } finally {
      setAddingToCart(false);
    }
  };


  // Mostrar estado de loading
  if (loading) {
    return (
      <IonPage>
        <Header />
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="container mx-auto px-6 my-20 mt-36 flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando producto...</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Mostrar estado de error
  if (error) {
    return (
      <IonPage>
        <Header />
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="container mx-auto px-6 my-20 mt-36">
            <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar el producto</h3>
              <p className="text-red-600">{error}</p>
              <IonButton 
                onClick={() => window.location.reload()} 
                className="mt-4"
                color="danger"
              >
                Recargar página
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const precioOriginal = parseFloat(producto?.Precio?.toString() || '0');
  const precioOferta = parseFloat(producto?.PrecioOferta?.toString() || '0') || 0;
  const tieneOferta = producto?.EnOferta && producto?.PrecioOferta && precioOferta < precioOriginal;
  const descuento = tieneOferta ? Math.round(((precioOriginal - precioOferta) / precioOriginal) * 100) : 0;

  return (
    <IonPage>
      <Header />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Hero Section - Imagen del producto */}
        <div className="relative">
          <div className="bg-gradient-to-b from-gray-50 to-white">
            <div className="relative h-80 flex items-center justify-center overflow-hidden">
              {/* Badges de oferta */}
              {tieneOferta && (
                <>
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      🔥 OFERTA
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      -{descuento}% OFF
                    </div>
                  </div>
                </>
              )}
              
              <IonImg
                className="w-full h-full object-cover max-w-sm mx-auto"
                src={producto?.vchNomImagen ? producto.vchNomImagen.replace('http://', 'https://') : "/assets/placeholder.svg"}
                alt={producto?.vchNombreProducto}
                onIonError={(e: CustomEvent) => {
                  const target = e.target as HTMLIonImgElement;
                  if (target.src !== "/assets/placeholder.svg") {
                    target.src = "/assets/placeholder.svg";
                    console.error(`Error cargando imagen del producto: ${producto?.vchNomImagen}`);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Información del producto */}
        <div className="px-4 py-6 bg-white">
          {/* Título y precio principal */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 leading-tight mb-3">
              {producto?.vchNombreProducto}
            </h1>
            
            {/* Sección de precios */}
            <div className="mb-4">
              {tieneOferta ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-red-600">
                      ${(() => {
                        const { entero, decimal } = separarPrecio(precioOferta);
                        return (
                          <>
                            {entero}
                            {decimal && <span className="text-lg">{decimal}</span>}
                          </>
                        );
                      })()}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${formatearPrecio(precioOriginal)}
                    </span>
                  </div>
                  <div className="bg-green-50 text-green-700 text-sm font-semibold py-2 px-3 rounded-lg inline-flex items-center gap-2">
                    💰 Ahorras ${formatearPrecio(precioOriginal - precioOferta)}
                  </div>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  ${(() => {
                    const { entero, decimal } = separarPrecio(precioOriginal);
                    return (
                      <>
                        {entero}
                        {decimal && <span className="text-lg">{decimal}</span>}
                      </>
                    );
                  })()}
                </span>
              )}
            </div>

            {/* Stock disponible */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${
                (producto?.Existencias || 0) > 10 ? 'bg-green-500' :
                (producto?.Existencias || 0) > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              {(producto?.Existencias || 0) > 10 ? (
                <span className="text-green-600 font-medium">En stock ({producto?.Existencias} disponibles)</span>
              ) : (producto?.Existencias || 0) > 0 ? (
                <span className="text-yellow-600 font-medium">¡Últimas {producto?.Existencias} unidades!</span>
              ) : (
                <span className="text-red-600 font-medium">Sin existencias</span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{producto?.vchDescripcion}</p>
          </div>

          {/* Selector de cantidad */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cantidad</h3>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <IonButton
                fill="clear"
                color="medium"
                className="w-12 h-12 rounded-full bg-white shadow-sm"
                onClick={decrementarExistencias}
                disabled={existencias <= 1}
              >
                <IonIcon icon={removeOutline} className="text-xl" />
              </IonButton>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{existencias}</div>
                <div className="text-xs text-gray-500">unidades</div>
              </div>
              
              <IonButton
                fill="clear"
                color="medium"
                className="w-12 h-12 rounded-full bg-white shadow-sm"
                onClick={incrementarExistencias}
                disabled={existencias >= (producto?.Existencias || 0)}
              >
                <IonIcon icon={addOutline} className="text-xl" />
              </IonButton>
            </div>
          </div>
        </div>

        {/* Botón de agregar al carrito - Fixed al bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-600">Total ({existencias} {existencias === 1 ? 'unidad' : 'unidades'})</div>
              <div className="text-xl font-bold text-gray-900">
                ${formatearPrecio((tieneOferta ? precioOferta : precioOriginal) * existencias)}
              </div>
            </div>
          </div>
          
          <IonButton
            expand="block"
            size="large"
            onClick={agregarAlCarrito}
            disabled={addingToCart || (producto?.Existencias || 0) <= 0}
            className="font-semibold text-lg"
            color={addingToCart || (producto?.Existencias || 0) <= 0 ? "medium" : "warning"}
          >
            {addingToCart && (
              <IonSpinner name="crescent" className="mr-3" />
            )}
            {addingToCart ? 'Agregando...' : 
             (producto?.Existencias || 0) <= 0 ? '❌ Sin existencias' : 
             '🛒 Agregar al carrito'}
          </IonButton>
        </div>
        
        {/* Espaciado para el botón fixed */}
        <div className="h-32"></div>
        
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}
          className="toast-container"
        />
      </IonContent>
    </IonPage>
  );
};

export default DetalleProducto;
