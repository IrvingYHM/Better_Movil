import React, { useEffect, useState } from "react";
import axios from "axios";
import {IonContent, IonToast,IonCard,IonCardHeader,IonCardTitle,IonCardSubtitle,IonCardContent,IonImg,IonLoading,IonButton, IonList, IonItem, IonLabel,} from "@ionic/react";
import Header from "../UI/header";

interface Producto {
  IdProducto: number;
  vchNombreProducto: string;
  vchNomImagen: string;
  vchDescripcion: string;
  Existencias: number;
  Precio: number;
  IdCategoria: number;
  IdMarca: number;
  PrecioOriginal: number;
  PrecioOferta: number;
  categoria: {
    NombreCategoria: string;
  };
  marca: {
    NombreMarca: string;
  };
}

const ProductosOfertas: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<{ [key: number]: string }>({});
  const [marcas, setMarcas] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const api = "http://localhost:3000/productos/ProductosOfertas";
        const response = await fetch(api, {});
        const data: Producto[] = await response.json();
        if (!response.ok) throw new Error('Error de carga');
        const categoriasMap: { [key: number]: string } = {};
        const marcasMap: { [key: number]: string } = {};

        data.forEach((producto) => {
          categoriasMap[producto.IdCategoria] = producto.categoria?.NombreCategoria || "Sin categoría";
          marcasMap[producto.IdMarca] = producto.marca?.NombreMarca || "Sin marca";
        });

        setCategorias(categoriasMap);
        setMarcas(marcasMap);
        setProductos(data);
      } catch (error) {
        setError('Error al cargar los productos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <>
      {loading && <IonLoading isOpen={loading} message={"Cargando productos..."} />}
      {error && <IonToast isOpen={true} message={error} duration={3000} color="danger" />}
      <IonCard id="productosOfertas" className="p">
        <IonList>
          {productos.map((producto) => (
            <IonItem key={producto.IdProducto} routerLink={`/productos/${producto.IdProducto}`}>
              <IonImg
                className="h-40 w-40 mr-6"
                src={producto.vchNomImagen}
                alt={producto.vchNombreProducto}
              />
              <IonLabel>
                <h2>{producto.vchNombreProducto}</h2>
                <p>
                  {categorias[producto.IdCategoria] || "Sin categoría"} - {marcas[producto.IdMarca] || "Sin marca"}</p>
                <p style={{ textDecoration: "line-through", color: "gray" }}>${producto.Precio}</p>
                <h3 className="font-bold">${producto.PrecioOferta}</h3>
                <p><span className="text-green-500 font-bold">Envío gratis</span> en la primera compra</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCard>
    </>
  );
};

export default ProductosOfertas;
