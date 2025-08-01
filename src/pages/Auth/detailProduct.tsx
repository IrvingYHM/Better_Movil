import React, { useEffect, useState } from 'react';
import { useParams,useHistory } from 'react-router-dom';
import {
  IonContent, IonHeader, IonPage, IonToolbar, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonLoading,
  IonButton, IonBackButton, IonButtons,
  IonInput
} from '@ionic/react';
import Header from '../../components/UI/header';
import { addProductToCart } from '../../services/Apis';
import Tratamientos from '../../components/tratamientos';
import GraduationsView from '../../components/graduaciones';
import {toast} from 'react-toastify';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QF7CwP4u0AspHWqVkcLHlGObKirereYBP7bQJOetZ3Bgv1HQDXfCaEQBWM8cv3kvJ69rNvjdOwsMw4nzqgSxGhN00ik1ViWMd');


const carritoApiBaseUrl = "http://localhost:3000/Carrito/";
const detallesCarritoApiBaseUrl = "http://localhost:3000/DetalleCarrito/";

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

const DetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
  const [selectedGraduation, setSelectedGraduation] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false); // Estado para controlar la visibilidad de las características
 
  const [selectedLens, setSelectedLens] = useState("");
  const [usuarioLogueado, setusuarioLogueado] = useState(false);
  const [userType, setUserType] = useState(null);
  const [clienteId, setClienteId] = useState<number | null>(null);

  const [cantidadAAgregar, setCantidadAAgregar] = useState<number>(1); // Cantidad predeterminada es 1


  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`https://backopt-production.up.railway.app/productos/Productos/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener el producto");
        }
        const data = await response.json();
        setProducto(data);
        setTotalPrice(Number(data.Precio)); // Precio base del producto
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  useEffect(() => {
    const basePrice = Number(producto?.Precio) || 0;
    const treatmentPrice = selectedTreatment ? Number(selectedTreatment.Precio) : 0;
    const graduationPrice = selectedGraduation ? Number(selectedGraduation.Precio) : 0;
    setTotalPrice(basePrice + treatmentPrice + graduationPrice);
  }, [producto, selectedTreatment, selectedGraduation]);

  const handleTreatmentChange = (treatment: any) => {
    setSelectedTreatment(treatment);
  };

  const handleGraduationChange = (graduation: any) => {
    setSelectedGraduation(graduation);
  };

  //funcion para agregar  el carrito, primero buscar si tiene carrito 
  //si no tiene crea el carrito y luego ya agrega el producto al carrito
  //posteriromente podra verse en el detalle del
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      setUserType(decodedToken.userType);
      /*       setNombreUsuario(decodedToken.nombre); */
      setClienteId(decodedToken.clienteId);

      setusuarioLogueado(true);
      console.log(clienteId);
      /*  console.log(nombreUsuario) */
    }
  }, [/* nombreUsuario */ clienteId]);

  const handleAddToCart = async () => {
    if (!usuarioLogueado) {
      toast.error("Aún no has iniciado sesión.");
      return;
    }

    if (!selectedTreatment) {
      toast.error("Por favor, selecciona un tratamiento.");
      return;
    }

    if (cantidadAAgregar <= 0 || cantidadAAgregar > producto.Existencias) {
      toast.error("No hay suficientes productos en existencia.");
    }
      
    try {
      const carritoResponse = await fetch(`${carritoApiBaseUrl}/crearCarrito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdProducto: producto.IdProducto,
          cantidad: cantidadAAgregar,
          IdCliente: clienteId,
        }),
      });
  
      if (!carritoResponse.ok) {
        throw new Error("Error al agregar producto al carrito.");
      }
  
      const carritoData = await carritoResponse.json();
      const IdCarrito = carritoData.IdCarrito;
  
      const detallesCarritoResponse = await fetch(`${detallesCarritoApiBaseUrl}crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdProducto: producto.IdProducto,
          IdGraduacion: selectedGraduation?.IdGraduacion,
          IdTratamiento: selectedTreatment?.IdTratamiento,
          Precio: totalPrice,
          Descripcion: producto.vchDescripcion,
          SubTotal: totalPrice * cantidadAAgregar,
          Cantidad: cantidadAAgregar,
          IdCarrito: IdCarrito,
        }),
      });
  
      if (detallesCarritoResponse.ok) {
        toast.success("Producto(s) agregado(s) al carrito.");
        setTimeout(() => {
          history.push("/carrito");
        }, 3000);
      } else {
        throw new Error("Error al agregar producto al carrito.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar producto al carrito.");
    }
  };

  const handlePayment = async () => {
    const stripe = await stripePromise;

    // Crea el PaymentIntent en tu servidor
    const response = await fetch('http://localhost:3000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalPrice * 100, // Stripe usa centavos
        currency: 'MxM', // Cambia la moneda según tu necesidad
      }),
    });

    const paymentData = await response.json();

    if (paymentData.error) {
      toast.error('Error al procesar el pago');
      return;
    }

    // Redirigir al usuario para que complete el pago
    const result = await stripe?.redirectToCheckout({
      sessionId: paymentData.clientSecret,
    });

    if (result && result.error) {
      toast.error(result.error.message);
      } else if (!result) {
          // Manejar el caso donde result es undefined
          toast.error('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      }
  };



  const toggleDetails = () => {
    setShowDetails((prev) => !prev); 
  };

  if (loading) {
    return <IonLoading isOpen={loading} message={"Cargando producto..."} />;
  }

  if (!producto) {
    return <div>Error: Producto no encontrado.</div>;
  }

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
        <IonCard>
          <IonCardTitle className='text-center text-bold '>{producto.vchNombreProducto} - {producto.vchDescripcion}</IonCardTitle>
          <IonImg src={producto.vchNomImagen} alt={producto.vchNombreProducto} />
          <IonCardHeader>
            <span>Selecciona el tratamiento: {selectedTreatment ? selectedTreatment.Nombre : "Ninguno seleccionado"} </span>
            <Tratamientos onSelectTreatment={handleTreatmentChange} />
            <span>Selecciona la graduación: {selectedGraduation ? selectedGraduation.ValorGraduacion : "Ninguna seleccionada"}</span>
            <GraduationsView onSelectGraduation={handleGraduationChange} />
            <div className="flex justify-between mt-4">
              <span className="font-semibold">Cantidad:</span>
              <IonInput
                type="number"
                value={cantidadAAgregar}
                min={1}
                max={producto.Existencias} // Limita la cantidad al stock disponible
                onIonChange={(e: { detail: { value: string; }; }) => {
                  const newValue = parseInt(e.detail.value!, 10);
                  if (newValue <= producto.Existencias) {
                    setCantidadAAgregar(newValue);
                  } else {
                    toast.error("No hay suficientes productos en existencia.");
                  }
                }}
                className="w-16"
              />
            </div>
            <span className='text-black text-xl font-bold' >Total: ${totalPrice}</span>
          </IonCardHeader>
          <IonCardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-xl text-black">Nombre del lente:</span>
                <span>{producto.vchNombreProducto}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Descripción:</span>
                <span>{producto.vchDescripcion}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Precio:</span>
                <span>${producto.Precio}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Existencias:</span>
                <span>{producto.Existencias}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Marca:</span>
                <span>{producto.marca.NombreMarca}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Categoria:</span>
                <span>{producto.categoria.NombreCategoria}</span>
              </div>
            </div>
        
            <IonButton onClick={toggleDetails} className="mt-4" fill="outline">
              {showDetails ? "Ocultar características" : "Mostrar características"}
            </IonButton>
         
            {showDetails && (
              <div className="mt-4">
                <h3 className="font-semibold">Características:</h3>
                <ul className="list-disc list-inside">
                  <li>Características adicionales 1</li>
                  <li>Características adicionales 2</li>
                  <li>Características adicionales 3</li>
                </ul>
              </div>
            )}
            </IonCardContent>
            <div className="flex flex-col space-y-4 mt-4">
              <IonButton onClick={() => handleAddToCart()} className="bg-transparent" fill="outline">
                Agregar al carrito
              </IonButton>
              <IonButton  onClick={handlePayment} className="bg-transparent border-transparent">
                Comprar
              </IonButton>
            </div>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DetalleProducto;
