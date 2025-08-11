import axios from 'axios';

// Configuración centralizada de la API para Betterware
export const API_BASE_URL = "https://backbetter-production.up.railway.app";
export const API_URL = API_BASE_URL; // Para compatibilidad con código existente

// Endpoints específicos para Betterware
export const API_ENDPOINTS = {
  productos: {
    getById: `${API_BASE_URL}/productos_better/productosId`,
    getByIdAlt: `${API_BASE_URL}/productos_better/Productos`, // Para modificar producto
    getAll: `${API_BASE_URL}/productos_better/Productos`,
    getAllAdmin: `${API_BASE_URL}/productos_better/ProductosAll`,
    search: `${API_BASE_URL}/productos_better/Buscar_productos`,
    filter: `${API_BASE_URL}/productos_better/filtro_producto`,
    update: `${API_BASE_URL}/productos_better/actualizar`,
    create: `${API_BASE_URL}/productos_better/crear`,
    ofertas: `${API_BASE_URL}/productos_better/ProductosOfertas`,
  },
  carrito: {
    crear: `${API_BASE_URL}/Carrito/crearCarrito`,
    detalles: `${API_BASE_URL}/DetalleCarrito/crear`,
    obtenerUno: `${API_BASE_URL}/Carrito/uno`,
    eliminarCompleto: `${API_BASE_URL}/Carrito/eliminarCa`,
    detalleModificarCantidad: `${API_BASE_URL}/DetalleCarrito/modificarCantidad`,
    detalleEliminarProducto: `${API_BASE_URL}/DetalleCarrito/eliminar/producto`,
    detalleEliminarCarrito: `${API_BASE_URL}/DetalleCarrito/eliminar`,
  },
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/clientes/registrar`,
    perfil: `${API_BASE_URL}/clientes/perfil`,
  },
  catalogos: {
    getAll: `${API_BASE_URL}/catalogos/`,
    create: `${API_BASE_URL}/catalogos/agregar-catalogo`,
    delete: `${API_BASE_URL}/catalogos/eliminar`,
  },
  categorias: {
    getAll: `${API_BASE_URL}/categoria/`,
    getById: `${API_BASE_URL}/categoria`,
    checkProducts: `${API_BASE_URL}/categoria/check-products`,
    create: `${API_BASE_URL}/categoria/agregar-categoria`,
    update: `${API_BASE_URL}/categoria/actualizar-categoria`,
    delete: `${API_BASE_URL}/categoria/eliminar-categoria`,
  },
  citas: {
    crear: `${API_BASE_URL}/citas/crear`,
    obtener: `${API_BASE_URL}/citas/cliente`,
    modificar: `${API_BASE_URL}/citas/modificar`,
    cancelar: `${API_BASE_URL}/citas/cancelar`,
    horarios: `${API_BASE_URL}/citas/horarios-disponibles`,
  },
  clientes: {
    recuperarPassword: `${API_BASE_URL}/clientes/recuperar-contrasena`,
    enviarCodigo: `${API_BASE_URL}/clientes/enviar_codigo`,
    verificarCodigo: `${API_BASE_URL}/clientes/verificar_codigo`,
    cambiarPassword: `${API_BASE_URL}/clientes/cambiar_contrasena`,
    preguntaSecreta: `${API_BASE_URL}/clientes/pregunta-secreta`,
    verificarPregunta: `${API_BASE_URL}/clientes/verificar_pregunta`,
  },
  retos: {
    topVentas: `${API_BASE_URL}/top-vendedor`,
    topReferidos: `${API_BASE_URL}/top-referidos`,
    imagenes: `${API_BASE_URL}/imagenes/filtrar`,
  },
  uneteEquipo: {
    obtener: `${API_BASE_URL}/unete-equipo/`,
  },
};

// Funciones de API migradas y actualizadas para Betterware
export const fetchProductosOfertas = async () => {
  const response = await axios.get(API_ENDPOINTS.productos.ofertas);
  return response.data;
};

export const fetchProducts = async () => {
  const response = await axios.get(API_ENDPOINTS.productos.getAll);
  return response.data;
};

export const fetchProductById = async (id: string | number) => {
  const response = await axios.get(`${API_ENDPOINTS.productos.getById}/${id}`);
  return response.data;
};

// Función de búsqueda de productos
export const searchProducts = async (query: string, filters?: any) => {
  const params = new URLSearchParams();
  params.append('busqueda', query);
  
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'all') {
        params.append(key, filters[key]);
      }
    });
  }
  
  const response = await axios.get(`${API_ENDPOINTS.productos.search}?${params}`);
  return response.data;
};

// Funciones del carrito
export const createCart = async (clienteId: number) => {
  const response = await axios.post(API_ENDPOINTS.carrito.crear, { clienteId });
  return response.data;
};

export const addProductToCart = async (carritoId: number, productId: number, cantidad: number = 1) => {
  const response = await axios.post(API_ENDPOINTS.carrito.detalles, {
    IdCarrito: carritoId,
    IdProducto: productId,
    intCantidad: cantidad
  });
  return response.data;
};

export const getCartByClient = async (clienteId: number) => {
  const response = await axios.get(`${API_ENDPOINTS.carrito.obtenerUno}/${clienteId}`);
  return response.data;
};

export const updateCartItemQuantity = async (detalleId: number, cantidad: number) => {
  const response = await axios.put(`${API_ENDPOINTS.carrito.detalleModificarCantidad}/${detalleId}`, {
    intCantidad: cantidad
  });
  return response.data;
};

export const removeProductFromCart = async (detalleId: number) => {
  const response = await axios.delete(`${API_ENDPOINTS.carrito.detalleEliminarProducto}/${detalleId}`);
  return response.data;
};

export const clearCart = async (carritoId: number) => {
  const response = await axios.delete(`${API_ENDPOINTS.carrito.eliminarCompleto}/${carritoId}`);
  return response.data;
};

// Función de autenticación
export const LoginUser = async (email: string, password: string) => {
  const response = await axios.post(API_ENDPOINTS.auth.login, {
    vchCorreo: email,
    vchContrasena: password
  });
  return response.data;
};

// Función de registro
export const registerUser = async (userData: any) => {
  const response = await axios.post(API_ENDPOINTS.auth.register, userData);
  return response.data;
};

// Funciones para catálogos
export const getCatalogos = async () => {
  const response = await axios.get(API_ENDPOINTS.catalogos.getAll);
  return response.data;
};

// Funciones para citas
export const createCita = async (citaData: any) => {
  const response = await axios.post(API_ENDPOINTS.citas.crear, citaData);
  return response.data;
};

export const getCitasByClient = async (clienteId: number) => {
  const response = await axios.get(`${API_ENDPOINTS.citas.obtener}/${clienteId}`);
  return response.data;
};

export const getHorariosDisponibles = async (fecha: string) => {
  const response = await axios.get(`${API_ENDPOINTS.citas.horarios}?fecha=${fecha}`);
  return response.data;
};

// Funciones para recuperación de contraseña
export const recuperarPassword = async (email: string) => {
  const response = await axios.post(API_ENDPOINTS.clientes.recuperarPassword, {
    vchCorreo: email
  });
  return response.data;
};

export const enviarCodigoRecuperacion = async (email: string) => {
  const response = await axios.post(API_ENDPOINTS.clientes.enviarCodigo, {
    correoElectronico: email
  });
  return response.data;
};

export const verificarCodigo = async (email: string, codigo: string) => {
  const response = await axios.post(API_ENDPOINTS.clientes.verificarCodigo, {
    correoElectronico: email,
    codigo
  });
  return response.data;
};

export const cambiarPassword = async (email: string, nuevaPassword: string) => {
  const response = await axios.post(API_ENDPOINTS.clientes.cambiarPassword, {
    correoElectronico: email,
    nuevaContrasena: nuevaPassword
  });
  return response.data;
};

// Funciones para retos
export const getTopVentas = async (month: string, year: number) => {
  const response = await axios.get(`${API_ENDPOINTS.retos.topVentas}?month=${month}&year=${year}`);
  return response.data;
};

export const getTopReferidos = async (month: string, year: number) => {
  const response = await axios.get(`${API_ENDPOINTS.retos.topReferidos}?month=${month}&year=${year}`);
  return response.data;
};

export const getImagenesRetos = async (tipo: string) => {
  const response = await axios.get(`${API_ENDPOINTS.retos.imagenes}/${tipo}`);
  return response.data;
};

// Función para obtener información de "Únete al equipo"
export const getUneteEquipo = async () => {
  const response = await axios.get(API_ENDPOINTS.uneteEquipo.obtener);
  return response.data;
};

// Interceptor para manejar errores de manera consistente
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Para compatibilidad con código existente que usa otras funciones
export const fetchGraduations = async () => {
  // Esta función puede no ser necesaria para Betterware, pero la mantenemos por compatibilidad
  console.warn('fetchGraduations: Esta función puede no estar disponible para Betterware');
  return [];
};

export const fetchTreatments = async () => {
  // Esta función puede no ser necesaria para Betterware, pero la mantenemos por compatibilidad
  console.warn('fetchTreatments: Esta función puede no estar disponible para Betterware');
  return [];
};