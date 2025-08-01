// GraduationsView.tsx
import React, { useEffect, useState } from 'react';
import { fetchGraduations } from '../services/Apis';
import { IonButton, IonCard, IonList } from '@ionic/react';
import './ExploreContainer.css'

interface GraduationsViewProps {
  onSelectGraduation: (graduation: any) => void;
}

const GraduationsView: React.FC<GraduationsViewProps> = ({ onSelectGraduation }) => {
  const [graduaciones, setGraduaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGraduation, setSelectedGraduation] = useState<any | null>(null); // Estado para la graduación seleccionada

  useEffect(() => {
    const loadGraduations = async () => {
      try {
        const data = await fetchGraduations();
        setGraduaciones(data);
      } catch (err) {
        setError('Error loading graduations');
      } finally {
        setLoading(false);
      }
    };

    loadGraduations();
  }, []);

  const handleSelectGraduation = (graduation: any) => {
    setSelectedGraduation(graduation); // Guarda la graduación seleccionada
    onSelectGraduation(graduation); // Llama a onSelectGraduation para pasar la graduación seleccionada al componente padre
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>  
        <IonList className='flex'>
          {graduaciones.map((graduacion) => (
            <IonButton
              key={graduacion.IdGraduacion}
              fill='outline'
              id='Btn'
              onClick={() => handleSelectGraduation(graduacion)} // Manejador para seleccionar graduación
              className={`cursor-pointer transition-colors text-black duration-300 w-28 p-1 small-button-text ${
                selectedGraduation?.IdGraduacion === graduacion.IdGraduacion ? 'selected-button': ''
              }`}
            >
              <strong>{graduacion.ValorGraduacion}</strong>
            </IonButton>
          ))}
        </IonList>
    </>
  );
};

export default GraduationsView;
