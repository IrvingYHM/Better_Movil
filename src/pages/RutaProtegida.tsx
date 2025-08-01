import React from "react";
import { Redirect } from "react-router-dom"; 
import { useAuth } from "../contexts/Auth"; 

interface RutaProtegidaProps {
  element: React.ReactNode; 
}

const RutaProtegida: React.FC<RutaProtegidaProps> = ({ element }) => {
  const { isAuthenticated } = useAuth(); 
  return isAuthenticated ? <>{element}</> : <Redirect to="/IniciaSesion" />;
};

export default RutaProtegida;
