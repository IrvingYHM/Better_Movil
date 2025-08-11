import React, { useEffect, useState } from "react";
import {IonContent,IonToast,IonCard,  IonCardHeader,  IonCardTitle,  IonCardSubtitle,  IonCardContent,IonImg,  IonLoading,  IonButton,} from "@ionic/react";

interface Producto {
  IdProducto: number;
  vchNombreProducto: string;
  vchNomImagen: string;
  vchDescripcion: string;
  Existencias: number;
  Precio: number;
  IdCategoria: number;
  IdMarca: number;
  categoria: {
    NombreCategoria: string;
  };
  marca: {
    NombreMarca: string;
  };
}

const ProductosVista: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<{ [key: number]: string }>({});
  const [marcas, setMarcas] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const api = "https://backbetter-production.up.railway.app/productos_better/Productos";
        const response = await fetch(api, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
    
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          
          const data: Producto[] = await response.json();
          console.log("Data completa:", data);
          console.log("Primer producto:", data[0]);
          console.log("URL de primera imagen:", data[0]?.vchNomImagen);
    
          const categoriasMap: { [key: number]: string } = {};
          const marcasMap: { [key: number]: string } = {};
    
          data.forEach((producto, index) => {
            console.log(`Producto ${index + 1}: ${producto.vchNombreProducto}`);
            console.log(`URL imagen ${index + 1}: ${producto.vchNomImagen}`);
            
            categoriasMap[producto.IdCategoria] = producto.categoria?.NombreCategoria || "Sin categoría";
            marcasMap[producto.IdMarca] = producto.marca?.NombreMarca || "Sin marca";
          });
    
          setCategorias(categoriasMap);
          setMarcas(marcasMap);
          setProductos(data);
        } else {
          throw new Error("La respuesta no es JSON");
        }
      } catch (error) {
        setError("Error al cargar los productos");
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductos();
  }, []);

  return (
    <IonContent className="p-3">
      {loading && <IonLoading isOpen={loading} message={"Cargando productos..."} />}
      {error && <IonToast isOpen={true} message={error} duration={3000} color="danger" />}

      <h1 className="text-2xl font-bold text-center mb-3">Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1">
        {productos.map((producto) => {
          // Convertir HTTP a HTTPS para evitar problemas de contenido mixto
          const imageUrl = producto.vchNomImagen 
            ? producto.vchNomImagen.replace('http://', 'https://') 
            : "/assets/placeholder.svg";
            
          console.log(`Renderizando producto ${producto.vchNombreProducto} con imagen: ${imageUrl}`);
          
          return (
            <IonCard routerLink={`/productos/${producto.IdProducto}`} key={producto.IdProducto} className="w-auto mx-4 my-2 p-4 items-center justify-center">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <IonImg 
                  className="w-full h-full object-cover mx-auto" 
                  src={imageUrl} 
                  alt={producto.vchNombreProducto}
                  onIonError={(e: CustomEvent) => {
                    console.error(`Error cargando imagen para ${producto.vchNombreProducto}: ${imageUrl}`);
                    const target = e.target as HTMLIonImgElement;
                    target.src = "/assets/placeholder.svg";
                  }}
                />
              </div>
            <IonCardHeader className="text-center">
              <IonCardTitle className="font-bold">{producto.vchNombreProducto}</IonCardTitle>
              <IonCardSubtitle>
                {categorias[producto.IdCategoria] || "Sin categoría"} - {marcas[producto.IdMarca] || "Sin marca"}
              </IonCardSubtitle>
              <IonCardSubtitle className="text-lg font-semibold text-teal-600">
                ${typeof producto.Precio === 'number' ? formatearPrecio(producto.Precio) : producto.Precio}
              </IonCardSubtitle>
            </IonCardHeader>
            </IonCard>
          );
        })}
      </div>
    </IonContent>
  );
};

export default ProductosVista;
