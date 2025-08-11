import { API_ENDPOINTS } from "../../services/Apis";

// Cache simple usando localStorage como alternativa a IndexedDB
const CACHE_KEY = 'productos_cache';
const CACHE_TIMESTAMP_KEY = 'productos_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milliseconds

// Función para cachear los datos obtenidos de la API en localStorage
function cacheProductos(data: any) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn('No se pudo cachear los productos:', error);
  }
}

// Función para obtener los datos cacheados de localStorage
function getCachedProductos() {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cachedData && timestamp) {
      const cacheAge = Date.now() - parseInt(timestamp);
      if (cacheAge < CACHE_DURATION) {
        return JSON.parse(cachedData);
      } else {
        // Cache expirado, limpiar
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      }
    }
    return null;
  } catch (error) {
    console.warn('Error al obtener cache de productos:', error);
    return null;
  }
}

// Función principal para obtener productos, usando cache si no hay conexión
export async function obtenerProductos() {
  try {
    const response = await fetch(
      API_ENDPOINTS.productos.getAll,
      {
        headers: {
          "ngrok-skip-browser-warning": "true", // Ignora advertencias de navegador de ngrok
          "Content-Type": "application/json", // Tipo de contenido
        },
      }
    );

    // Si la respuesta no es exitosa, lanza un error
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    // Procesa la respuesta a JSON y cachea los datos
    const data = await response.json();
    cacheProductos(data);  // Cachea los datos cuando hay conexión
    return data;
  } catch (error) {
    console.log("Fallo en la red, cargando desde la caché:", error);

    // Si falla, intenta cargar desde la caché de localStorage
    const cachedData = getCachedProductos();
    return cachedData || [];  // Devuelve la caché o un array vacío si no hay nada cacheado
  }
}