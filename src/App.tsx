import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
//import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/** importaciones de componenetes */
import Menu from './components/Menu';
import Footer from './components/Footer';
import IniciaSesion from './pages/IniciaSesión';
import AgendaCita from './pages/AgendaCita';
import detalleCarrito from './pages/Carrito';
import Productos from './pages/Productos';
import RegistroU from './pages/RegistroU';
import ProductsViewCart from './pages/productosViewCart';
import RutaProtegida from './pages/RutaProtegida';
import HomeAuth from './pages/Auth/Home'
import DetalleProducto from './pages/Auth/detailProduct';
import ProfileCard from './pages/Auth/perfilUser';
import React from 'react';
import tratamientos from './components/tratamientos';
import Carrito from './pages/Carrito';



setupIonicReact();

const App: React.FC = () => (
  <>
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId='main-content'>
          <Menu />
        <IonRouterOutlet id='main-content'>
          <Redirect exact from='/' to="/Home" />
          <Route path="/Home" component={Home} exact />
          <Route path="/IniciaSesion" component={IniciaSesion} exact />
          <Route path="/Productos" component={Productos} exact />
          <Route path="/RegistroU" component={RegistroU} exact /> 
          <Route path="/ProductsViewCart"  component={ProductsViewCart} />
          
          <Route path="/Tratamiento"  component={tratamientos} />
          <Route path="/Productos/:id" component={DetalleProducto} /> 
          

        {/**Rutas Protegidas */}
          <Route path="/AgendaCita" render={() => <RutaProtegida element={<AgendaCita />} />} />
        {/**<Route path="/Carrito" render={() => <RutaProtegida element={<Carrito />} />} /> */} 
          <Route path="/HomeAuth" render={() => <RutaProtegida element={<HomeAuth />} />} />
          <Route path="/Perfil" render={() => <RutaProtegida element={<ProfileCard />} />} />
          <Route path="/Carrito" render={() => <RutaProtegida element={<Carrito />} />} />
        </IonRouterOutlet>
      
        </IonSplitPane>
        
      </IonReactRouter>
      
    </IonApp>
    <ToastContainer />
  </>
);

export default App;
