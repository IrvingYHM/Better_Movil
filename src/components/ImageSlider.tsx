import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText
} from '@ionic/react';
import { 
  chevronBackOutline, 
  chevronForwardOutline 
} from 'ionicons/icons';

interface Slide {
  Imagen: string;
  UrlDestino?: string;
}

const ImageSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  // Traer las imágenes del slider desde la API
  useEffect(() => {
    async function fetchSliderImages() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://backbetter-production.up.railway.app/imagenes/filtrar/slider"
        );
        const data = await res.json();
        setSlides(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener imágenes del slider:", error);
        setLoading(false);
      }
    }
    fetchSliderImages();
  }, []);

  // Función para manejar cuando una imagen se carga
  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  // Función para manejar errores de carga de imagen
  const handleImageError = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: false }));
  };

  // Cambiar automáticamente de imagen cada 5 segundos
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [slides, currentIndex]);

  // Funciones de navegación
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Ir a un slide por índice
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  // Redireccionar al dar clic si tiene UrlDestino
  const handleImageClick = () => {
    const slide = slides[currentIndex];
    if (slide && slide.UrlDestino) {
      window.location.href = slide.UrlDestino;
    }
  };

  if (loading) {
    return (
      <IonCard>
        <IonCardContent>
          <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <IonSpinner name="crescent" color="primary" />
              <IonText>
                <p className="mt-2 text-gray-500">Cargando slider...</p>
              </IonText>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  if (!slides.length) {
    return (
      <IonCard>
        <IonCardContent>
          <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
            <IonText>
              <p className="text-gray-500">No hay imágenes disponibles</p>
            </IonText>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard>
      <div className="relative">
        {/* Container de imagen */}
        <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden">
          {/* Skeleton overlay si la imagen no se ha cargado */}
          {!imageLoaded[currentIndex] && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 animate-pulse z-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <IonSpinner name="crescent" color="primary" />
              </div>
            </div>
          )}

          {/* Imagen real del slider */}
          {slides[currentIndex] && (
            <img
              src={slides[currentIndex].Imagen ? slides[currentIndex].Imagen.replace('http://', 'https://') : "/assets/placeholder.svg"}
              alt="Slide"
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded[currentIndex] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleImageLoad(currentIndex)}
              onError={() => {
                handleImageError(currentIndex);
                console.warn(`Error cargando imagen del slider: ${slides[currentIndex]?.Imagen}`);
              }}
              onClick={handleImageClick}
              style={{
                cursor: slides[currentIndex]?.UrlDestino ? "pointer" : "default",
              }}
            />
          )}
        </div>

        {/* Botones de navegación */}
        {slides.length > 1 && (
          <>
            <IonButton
              fill="clear"
              className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-30"
              onClick={prevSlide}
            >
              <IonIcon 
                icon={chevronBackOutline} 
                className="text-white text-2xl bg-black bg-opacity-50 rounded-full p-1" 
              />
            </IonButton>
            
            <IonButton
              fill="clear"
              className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-30"
              onClick={nextSlide}
            >
              <IonIcon 
                icon={chevronForwardOutline} 
                className="text-white text-2xl bg-black bg-opacity-50 rounded-full p-1" 
              />
            </IonButton>
          </>
        )}

        {/* Indicadores de puntos */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-30">
            {slides.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                  currentIndex === slideIndex
                    ? "bg-blue-600 w-4"
                    : "bg-white bg-opacity-60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </IonCard>
  );
};

export default ImageSlider;