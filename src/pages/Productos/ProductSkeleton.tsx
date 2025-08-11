import React from 'react';
import { IonCard, IonCardContent, IonSkeletonText } from '@ionic/react';

interface ProductSkeletonGridProps {
  count: number;
}

export const ProductSkeletonGrid: React.FC<ProductSkeletonGridProps> = ({ count = 12 }) => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-6 mt-8">
      {Array.from({ length: count }).map((_, index) => (
        <IonCard key={index} className="w-72 bg-white border-2 border-gray-200 shadow-lg rounded-xl overflow-hidden">
          <div className="relative h-72 w-full bg-gray-100">
            <IonSkeletonText animated className="h-full w-full" />
          </div>
          
          <IonCardContent className="p-4 space-y-2">
            <IonSkeletonText animated className="h-6 w-full mb-2" />
            <IonSkeletonText animated className="h-4 w-3/4 mb-2" />
            <IonSkeletonText animated className="h-8 w-1/2" />
          </IonCardContent>
        </IonCard>
      ))}
    </div>
  );
};