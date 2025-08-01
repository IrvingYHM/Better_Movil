import React, { useState, useEffect } from 'react';
import logo from '../../assets/an.png';
import anuncio from '../../assets/anuncioOpti.jpg';
import './ImageCarousel.css'

const ImageCarousel: React.FC = () => {
  // Arreglo de imágenes
  const images = [anuncio, logo]; // Puedes agregar más imágenes aquí

  // Estado para controlar la imagen actual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Función para cambiar a la siguiente imagen
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Efecto para el cambio automático de imagen cada 3 segundos
  useEffect(() => {
    const intervalId = setInterval(nextImage, 3000); // Cambia cada 3 segundos
    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, []);

  return (
    <div className="p-1">
      <img
        src={images[currentImageIndex]}
        alt={`Image ${currentImageIndex + 1}`}
        className="carousel-image"
      />
      <div className="carousel-controls">
      </div>
    </div>
  );
};

export default ImageCarousel;
