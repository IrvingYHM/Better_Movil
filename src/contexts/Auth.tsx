import React, { createContext, useState, useContext, ReactNode } from "react";
import { IonToast } from "@ionic/react";

export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token'); 
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const login = () => {
    setIsAuthenticated(true);
    setToastMessage("Inicio de sesión exitoso");
    setShowToast(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); 
    setToastMessage("Sesión cerrada correctamente");
    setShowToast(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
