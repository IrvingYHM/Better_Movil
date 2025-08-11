import React, { useState, useEffect } from "react";
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons';

const ScrollButton: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const checkScroll = () => {
    const scrolled = document.documentElement.scrollTop;
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrolled > 400) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }

    if (scrolled < maxHeight - 400) {
      setShowScrollBottom(true);
    } else {
      setShowScrollBottom(false);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <>
      {/* Botón para subir */}
      {showScrollTop && (
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ bottom: '120px', right: '16px' }}>
          <IonFabButton color="medium" onClick={scrollTop}>
            <IonIcon icon={arrowUpOutline} />
          </IonFabButton>
        </IonFab>
      )}
      
      {/* Botón para bajar */}
      {showScrollBottom && (
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ bottom: '70px', right: '16px' }}>
          <IonFabButton color="medium" onClick={scrollBottom}>
            <IonIcon icon={arrowDownOutline} />
          </IonFabButton>
        </IonFab>
      )}
    </>
  );
};

export default ScrollButton;