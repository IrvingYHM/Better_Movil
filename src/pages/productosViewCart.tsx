// App.tsx
import React from 'react';
import { IonApp } from '@ionic/react';
import ProductsView from '../components/productos';
import GraduationsView from '../components/graduaciones';
import Tratamientos from '../components/tratamientos';

const ProductsViewCart: React.FC = () => (
  <IonApp>
    <ProductsView />
  </IonApp>
);

export default ProductsViewCart;
