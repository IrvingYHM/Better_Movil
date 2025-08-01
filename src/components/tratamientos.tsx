import React, { useEffect, useState } from 'react';
import { fetchTreatments } from '../services/Apis';
import { IonButton, IonList } from '@ionic/react';
import './ExploreContainer.css'

interface TratamientosProps {
  onSelectTreatment: (treatment: any) => void;
}

const TreatmentsView: React.FC<TratamientosProps> = ({ onSelectTreatment }) => {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<any | null>(null);

  useEffect(() => {
    const loadTreatments = async () => {
      try {
        const data = await fetchTreatments();
        setTreatments(data);
      } catch (err) {
        setError('Error loading treatments');
      } finally {
        setLoading(false);
      }
    };

    loadTreatments();
  }, []);

  const handleSelectTreatment = (treatment: any) => {
    setSelectedTreatment(treatment); 
    onSelectTreatment(treatment); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='w-auto'>
      <IonList className='flex'>
        {treatments.map((treatment) => (
          <IonButton
           key={treatment.IdTratamiento}
            onClick={() => handleSelectTreatment(treatment)}
            fill="outline"
            id="Btn"
            className={`cursor-pointer transition-colors duration-300 w-28 p-1 small-button-text ${
              selectedTreatment?.IdTratamiento === treatment.IdTratamiento ? 'selected-button' : ''
            }`}
          >
        <strong>{treatment.Nombre}</strong>
        </IonButton>
        ))}
      </IonList>
    </div>
  );
};

export default TreatmentsView;
