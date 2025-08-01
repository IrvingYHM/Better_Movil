// AvatarCarousel.tsx
import { IonCard, IonToolbar, IonButtons, IonButton, IonAvatar } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import ventas from '../../assets/Venta.png';

interface Avatar {
  src: string;
  description: string;
  route: string;
}

const avatars = [
    { src: ventas, description: "Categoria 1", route: "/Cat1" },
    { src: ventas, description: "Categoria 2", route: "/Cat2" },
    { src: ventas, description: "Categoria 3", route: "/Cat3" },
    { src: ventas, description: "Categoria 4", route: "/Cat4" },
    { src: ventas, description: "Categoria 5", route: "/Cat5" },
    { src: ventas, description: "Categoria 6", route: "/Cat6" }
  ];
const AvatarCarousel: React.FC = () => {
  const history = useHistory();

  const handleNavigation = (route: string) => {
    history.push(route);
  };
  

  return (
    <IonCard>
      <IonToolbar>
        <IonButtons className="flex overflow-x-auto space-x-4 p-3">
          {avatars.map((avatar, index) => (
            <div key={index} className="flex flex-col items-center shrink-0">
              <IonButton className="shrink-0" onClick={() => handleNavigation(avatar.route)}>
                <IonAvatar>
                  <img src={avatar.src} alt={`avatar-${index}`} />
                </IonAvatar>
              </IonButton>
              <span className="text-sm text-center mt-1">{avatar.description}</span>
            </div>
          ))}
        </IonButtons>
      </IonToolbar>
    </IonCard>
  );
};

export default AvatarCarousel;
