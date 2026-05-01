describe('Prueba de inicio de sesion', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    // Page URL changed.
    cy.url()
      .should('eq', 'http://localhost:5173/login')
    // Page title changed. The page title is 'seguridadnacional'.
    cy.title()
      .should('eq', 'seguridadnacional')
    // The heading 'Login - Seguridad Nacional' is displayed.
    cy.get('#root h2.font-bold')
      .should('contain.text', 'Login - Seguridad Nacional')
    // The username input field is displayed.
    cy.get('#nombre_usuario')
      .should(($el) => {
        expect($el).to.have.attr('required')
        expect($el).to.have.value('')
      })
    // The password input field is displayed.
    cy.get('#contrasena')
      .should('have.attr', 'required')
    // The label 'Nombre de Usuario' is displayed.
    cy.get('#root div.mb-4')
      .should('contain.text', 'Nombre de Usuario')
    // The label 'Contraseña' is displayed.
    cy.get('#root div.mb-6')
      .should('contain.text', 'Contraseña')
    // The 'Sign In' button is displayed.
    cy.get('#root div.justify-between')
      .should('contain.text', 'Sign In')
    
    cy.get('#nombre_usuario').click();
    cy.get('#nombre_usuario').type('admin');
    // The username input field now contains the text 'admin'.
    cy.get('#nombre_usuario')
      .should('have.value', 'admin')
    
    cy.get('#contrasena').type('admin123{enter}');
    cy.get('#root button.rounded').click();
    // Page URL changed.
    cy.url()
      .should('eq', 'http://localhost:5173/home')
    
  })
});
