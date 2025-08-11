import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonSkeletonText,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

interface PromocionesLoadingProps {
  visibleCards: number;
}

const PromocionesLoading: React.FC<PromocionesLoadingProps> = ({ visibleCards }) => {
  const getColSize = () => {
    if (visibleCards === 1) return "12";
    if (visibleCards === 2) return "6";
    if (visibleCards === 3) return "4";
    return "12"; // Para móvil siempre será full width en grid
  };

  return (
    <div className="overflow-hidden pl-4 pr-8">
      <div className="flex gap-4">
        {Array.from({ length: Math.min(visibleCards + 1, 3) }).map((_, index) => (
          <div key={index} className="flex-shrink-0" style={{ width: 'calc(50% - 8px)' }}>
            <IonCard>
              <div className="relative">
                {/* Skeleton para la imagen */}
                <div className="h-32 bg-gray-200 animate-pulse rounded-t-lg"></div>
                
                {/* Etiqueta de descuento skeleton */}
                <div className="absolute top-2 right-2 bg-gray-300 animate-pulse w-12 h-6 rounded-full"></div>
              </div>
              
              <IonCardContent>
                {/* Skeleton para el título */}
                <IonSkeletonText animated style={{ width: '80%', height: '20px' }} />
                <IonSkeletonText animated style={{ width: '60%', height: '16px', marginTop: '8px' }} />
                
                {/* Skeleton para precios */}
                <div className="mt-4 space-y-2">
                  <IonSkeletonText animated style={{ width: '50%', height: '18px' }} />
                  <IonSkeletonText animated style={{ width: '70%', height: '16px' }} />
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromocionesLoading;