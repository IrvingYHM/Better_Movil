describe('Home Page Interface Test', () => {
    beforeEach(() => {
      cy.visit('/Home') // Asegúrate de que la URL base esté configurada en cypress.config.js
    });
  
    it('should display the header', () => {
      cy.get('ion-header').should('exist'); // Comprueba que el encabezado esté presente
    });
  
    it('should show the "Crear cuenta" button and navigate on click', () => {
      cy.contains('Crear cuenta').should('be.visible').click();
      cy.url().should('include', '/Crearcuenta'); // Verifica que el enlace funcione
    });
  
    it('should show "Ingresar a mi cuenta" link and navigate on click', () => {
      cy.contains('Ingresar a mi cuenta').should('be.visible').click();
      cy.url().should('include', '/IniciaSesion'); // Comprueba la navegación
    });
  
    it('should render the image carousel', () => {
      cy.get('ion-card').find('ion-img').should('exist'); // Verifica la presencia de imágenes del carrusel
    });
  
    it('should display product offers section', () => {
        cy.get('#productosOfertas').should('exist');
    });
  
    it('should show help section links', () => {
      cy.contains('¿Necesitas ayuda?').should('exist');
      cy.contains('Terminos y condiciones').should('exist');
      cy.contains('Conocer más').should('exist');
    });
  });
  