import axios from 'axios';

//const API_URL = 'http://localhost:3000/';

const API_URL = 'https://backopt-production.up.railway.app';


export const fetchProductosOfertas = async () => {
  const response = await axios.get(`${API_URL}/productos/productosOfertas`)
  return response.data;
};

export const fetchProducts = async () => {
  const response = await axios.get(`${API_URL}/productos/productos`);
  return response.data;
};

export const fetchGraduations = async () => {
  const response = await axios.get(`${API_URL}/graduaciones`);
  return response.data;
  
};

export const fetchTreatments = async () => {
  const response = await axios.get(`${API_URL}/Tratamiento`);
  return response.data;
};

export const addProductToCart = async (productId: number) => {
  const response = await axios.post(`${API_URL}/crearCarrito`, { productId });
  return response.data;
};


export const LoginUser = async () =>{
  const response = await axios.post(`${API_URL}/auth/login`)
};