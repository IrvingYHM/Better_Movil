import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonButton } from "@ionic/react";
import React, { useState, useEffect } from "react";
import Header from "../components/UI/header";
import CerrarSesion from "./Auth/cerrarSesion";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

const stripePromise = loadStripe('pk_test_51QF7CwP4u0AspHWqVkcLHlGObKirereYBP7bQJOetZ3Bgv1HQDXfCaEQBWM8cv3kvJ69rNvjdOwsMw4nzqgSxGhN00ik1ViWMd');

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

const Carrito: React.FC = () => {    
  const [detalleCarrito, setDetalleCarrito] = useState<any[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [clienteId, setClienteId] = useState<string>("");
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
          const decodedToken = parseJwt(token);
          setUserType(decodedToken.userType);
          setClienteId(decodedToken.clienteId);
          console.log("Cliente ID:", decodedToken.clienteId);
      }
  }, []);

  useEffect(() => {
      const fetchDetalleCarrito = async () => {
          if (clienteId) {
              try {
                  const response = await fetch(`http://localhost:3000/Carrito/uno?userId=${clienteId}`);
                  if (!response.ok) throw new Error("Error al obtener el detalle del carrito");
                  const data = await response.json();
                  console.log("Detalle del carrito:", data);
                  setDetalleCarrito(data);
              } catch (error) {
                  console.error(error);
              }
          }
      };

      fetchDetalleCarrito();
  }, [clienteId]);

  useEffect(() => {
      const subtotal = detalleCarrito.reduce((total, detalle) => total + detalle.SubTotal, 0);
      setTotal(subtotal);
  }, [detalleCarrito]);

  const handlePayment = async () => {
    const stripe = await stripePromise;

    // Crear la sesión de pago con los detalles del carrito
    const response = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            line_items: detalleCarrito.map((detalle) => ({
                price_data: {
                    currency: 'MXN', // Cambia la moneda según tu necesidad
                    product_data: {
                        name: detalle.producto.vchNombreProducto, // Nombre del producto
                    },
                    unit_amount: detalle.Precio * 100, // El precio en centavos
                },
                quantity: detalle.Cantidad, // Cantidad del producto
            })),
        }),
    });

    const paymentData = await response.json();

    if (paymentData.error) {
        toast.error('Error al procesar el pago');
        return;
    }

    // Redirigir al usuario para que complete el pago
    const result = await stripe?.redirectToCheckout({
        sessionId: paymentData.id,
    });

    if (result && result.error) {
        toast.error(result.error.message);
    } else if (!result) {
        toast.error('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    }
};

  return (
    <IonPage id="main-content">
        <Header />  
        <IonContent className="bg-gray-100">
            <div className="min-h-screen pt-20">
                <h1 className="mb-10 text-center text-2xl font-bold">Carrito de compras</h1>
                <div className="mx-auto max-w-7xl px-6 md:flex md:space-x-6 xl:px-0">
                    <div className="w-full md:w-2/3">
                        {detalleCarrito.length === 0 ? (
                            <p className="text-center">No hay productos en el carrito.</p>
                        ) : (
                            detalleCarrito.map((detalle) => (
                                <IonCard key={detalle.IdDetalle_Carrito} className="mb-6">
                                    <IonCardHeader>
                                        <IonCardTitle>{detalle.producto.vchNombreProducto}</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="flex items-center justify-between mb-4">
                                            <img
                                                src={detalle.producto.vchNomImagen}
                                                alt={detalle.producto.vchNombreProducto}
                                                className="w-20 md:w-40 rounded-lg"
                                            />
                                            <div className="mx-7">
                                                <IonLabel className="text-xs text-gray-700">{detalle.Descripcion}</IonLabel>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <IonInput
                                                type="number"
                                                value={detalle.Cantidad}
                                                min="1"
                                                readonly
                                                className="h-8 w-8 border bg-white text-center text-xs"
                                            />
                                            <IonLabel className="text-sm">${detalle.Precio}</IonLabel>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            ))
                        )}
                    </div>
                    <div className="w-full md:w-1/3 mb-8">
                        <IonCard className="rounded-lg border bg-white p-6 shadow-md">
                            <IonCardHeader>
                                <IonCardTitle>Detalle de tu compra</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <h3 className="text-gray-700 font-semibold mb-2">Productos SubTotal</h3>
                                {detalleCarrito.map((detalle) => (
                                    <div key={detalle.IdDetalle_Carrito} className="flex justify-between mb-2">
                                        <IonLabel>{detalle.producto.vchNombreProducto}</IonLabel>
                                        <IonLabel>${detalle.SubTotal}</IonLabel>
                                    </div>
                                ))}
                                <hr className="my-4" />
                                <div className="flex justify-between">
                                    <IonLabel className="text-lg font-bold">Total</IonLabel>
                                    <IonLabel className="mb-1 text-lg font-bold">${total}</IonLabel>
                                    <IonButton onClick={handlePayment} expand="full" className="mt-6 mb-8 bg-blue-500">
                                    Pagar
                                    </IonButton>
                                </div>
                                
                            </IonCardContent>
                        </IonCard>
                    </div>
                </div>
            </div>
        </IonContent>
    </IonPage>
);
};

export default Carrito;
