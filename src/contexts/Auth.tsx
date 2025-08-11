import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { IonToast } from "@ionic/react";
import { Capacitor } from '@capacitor/core';
import { StorageService } from '../services/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isLoading: true
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Verificar el token al inicializar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await StorageService.getItem('token');
        console.log('Token encontrado en storage:', !!token);
        
        if (token) {
          // Verificar si el token sigue siendo válido
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decodedToken = JSON.parse(jsonPayload);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp && decodedToken.exp > currentTime) {
              console.log('Token válido, usuario autenticado');
              setIsAuthenticated(true);
            } else {
              console.log('Token expirado, removiendo...');
              await StorageService.removeItem('token');
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error('Error al validar token:', error);
            await StorageService.removeItem('token');
            setIsAuthenticated(false);
          }
        } else {
          console.log('No hay token, usuario no autenticado');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al verificar estado de autenticación:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    console.log('Login ejecutado - estableciendo isAuthenticated = true');
    setIsAuthenticated(true);
    setToastMessage("Inicio de sesión exitoso");
    setShowToast(true);
  };

  const logout = async () => {
    console.log('Logout ejecutado - limpiando datos de sesión');
    
    try {
      // Limpiar todos los datos relacionados con la sesión usando StorageService
      await StorageService.removeItem('token');
      await StorageService.removeItem('userType');
      await StorageService.removeItem('clienteId');
      await StorageService.removeItem('userData');
      
      // Limpiar caché de productos si existe
      await StorageService.removeItem('cached_productos');
      await StorageService.removeItem('cached_productos_timestamp');
      
      setIsAuthenticated(false);
      setToastMessage("Sesión cerrada correctamente");
      setShowToast(true);
      
      console.log('Datos de sesión limpiados correctamente');
      
      // Force reload en plataformas nativas para asegurar que todos los estados se reseteen
      setTimeout(() => {
        if (Capacitor.isNativePlatform()) {
          window.location.reload();
        }
      }, 1000);
    } catch (error) {
      console.error('Error durante logout:', error);
      // Fallback: limpiar localStorage directamente
      localStorage.clear();
      setIsAuthenticated(false);
    }
  };

  // Mostrar loading mientras se verifica el estado de autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
        color={toastMessage.includes('cerrada') ? 'success' : 'primary'}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
