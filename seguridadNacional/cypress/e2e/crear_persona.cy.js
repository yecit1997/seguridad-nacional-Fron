describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    // Page URL changed.
    cy.url()
      .should('eq', 'http://localhost:5173/login')
    // Page title changed. The page title is 'seguridadnacional'.
    cy.title()
      .should('eq', 'seguridadnacional')
    // The login form title is 'Login - Seguridad Nacional'.
    cy.get('#root h2.font-bold')
      .should('contain.text', 'Login - Seguridad Nacional')
    // The username input field is visible.
    cy.get('#nombre_usuario')
      .should(($el) => {
        expect($el).to.have.attr('required')
        expect($el).to.have.value('')
      })
    // The password input field is visible.
    cy.get('#contrasena')
      .should('have.attr', 'required')
    // The username label is 'Nombre de Usuario'.
    cy.get('#root div.mb-4')
      .should('contain.text', 'Nombre de Usuario')
    // The password label is 'Contraseña'.
    cy.get('#root div.mb-6')
      .should('contain.text', 'Contraseña')
    // The 'Sign In' button is visible.
    cy.get('#root div.justify-between')
      .should('contain.text', 'Sign In')
    
      
    cy.get('#nombre_usuario').click();
    cy.get('#nombre_usuario').type('admin');
    // The username input field now has the value 'admin'.
    cy.get('#nombre_usuario')
      .should('have.value', 'admin')
    
    cy.get('#contrasena').type('admin123{enter}');
    cy.get('#root button.rounded').click();
    // Page URL changed.
    cy.url()
      .should('eq', 'http://localhost:5173/home')
    
    cy.get('#root a[href="/personas"]').click();
    // Page URL changed.
    cy.url()
      .should('eq', 'http://localhost:5173/personas')
    // The page heading changed to 'Personas'.
    cy.get('#root h1.font-bold')
      .should('contain.text', '👥 Personas')
    // A description for the 'Personas' section is now visible.
    cy.get('#root p.mt-1')
      .should('contain.text', 'Gestión de personas registradas en el sistema')
    // Length changed from 0 to 7
    cy.get('#root thead tr > th')
      .should('have.length', 7)
    // The table headers are updated to show 'ID', 'DNI', 'Nombre', 'Apellido', and 'Correo'.
    cy.get('#root th:nth-child(1)')
      .should('contain.text', 'ID')
    // Length changed from 0 to 3
    cy.get('#root tbody.bg-white > tr')
      .should('have.length', 3)
    // The 'Home' link is no longer highlighted as the active page.
    cy.get('#root a[href="/home"]')
      .should(($el) => {
        expect($el).to.have.class('text-sky-200')
        expect($el).to.have.class('hover:bg-sky-700')
        expect($el).to.have.class('hover:text-white')
        expect($el).to.not.have.class('bg-sky-700')
        expect($el).to.not.have.class('text-white')
      })
    // The 'Personas' link is now highlighted as the active page.
    cy.get('#root a[href="/personas"]')
      .should(($el) => {
        expect($el).to.have.class('bg-sky-700')
        expect($el).to.have.class('text-white')
        expect($el).to.not.have.class('text-sky-200')
        expect($el).to.not.have.class('hover:bg-sky-700')
        expect($el).to.not.have.class('hover:text-white')
      })
    
    cy.get('#root span.flex').click();
    // The sidebar menu is no longer visible.
    cy.get('#root div.h-full')
      .should('not.be.visible')
    // The DNI input field is visible and required.
    cy.get('#root [name="dni"]')
      .should(($el) => {
        expect($el).to.be.visible
        expect($el).to.have.attr('required')
        expect($el).to.have.value('')
      })
    // The 'Nombre' input field is visible and required.
    cy.get('#root [name="nombre"]')
      .should(($el) => {
        expect($el).to.be.visible
        expect($el).to.have.attr('required')
        expect($el).to.have.value('')
      })
    // The 'Apellido' input field is visible.
    cy.get('#root [name="apellido"]')
      .should(($el) => {
        expect($el).to.be.visible
        expect($el).to.have.value('')
      })
    // The 'Correo Electrónico' input field is visible.
    cy.get('#root [name="correo"]')
      .should(($el) => {
        expect($el).to.be.visible
        expect($el).to.have.value('')
      })
    // The 'Crear' button is visible.
    cy.get('#root div.justify-end button.text-white')
      .should(($el) => {
        expect($el).to.be.visible
        expect($el).to.contain.text('Crear')
      })
    // A new modal dialog titled '➕ Nueva Persona' has appeared.
    cy.get('#root div.w-full')
      .should('be.visible')
    // The modal dialog title is '➕ Nueva Persona'.
    cy.get('#root h3.font-medium')
      .should(($el) => {
        expect($el).to.be.visible
        expect($el).to.contain.text('➕ Nueva Persona')
      })
    
    cy.get('#root [name="dni"]').click();
    cy.get('#root [name="dni"]').type('78749839');
    // The DNI input field now has the value '78749839'.
    cy.get('#root [name="dni"]')
      .should('have.value', '78749839')
    
    cy.get('#root [name="nombre"]').click();
    cy.get('#root [name="nombre"]').type('Juaquin');
    // The 'Nombre' input field now has the value 'Juaquin'.
    cy.get('#root [name="nombre"]')
      .should('have.value', 'Juaquin')
    
    cy.get('#root [name="apellido"]').type('marin');
    // The 'Apellido' input field now has the value 'marin'.
    cy.get('#root [name="apellido"]')
      .should('have.value', 'marin')
    
    cy.get('#root [name="correo"]').type('juaquin@gmail.com');
    // The 'Correo Electrónico' input field now has the value 'juaquin@gmail.com'.
    cy.get('#root [name="correo"]')
      .should('have.value', 'juaquin@gmail.com')
    
    cy.get('#root [name="telefono"]').click();
    cy.get('#root [name="telefono"]').type('9895983');
    // The 'telefono' input field now has the value '9895983'.
    cy.get('#root [name="telefono"]')
      .should('have.value', '9895983')
    
    cy.get('#root div.justify-end button.text-white').click();
    // A success message 'Persona creada correctamente' is now visible.
    cy.get('#root div.right-4')
      .should('be.visible')
    // The success message text is 'Persona creada correctamente'.
    cy.get('#root span.font-medium')
      .should(($el) => {
        expect($el).to.be.visible
        expect($el).to.contain.text('Persona creada correctamente')
      })
    // Length changed from 3 to 4
    cy.get('#root tbody.bg-white > tr')
      .should('have.length', 4)
    // A new row is added to the table.
    cy.get('#root tr:nth-child(4) > td')
      .should('have.length', 7)
    // The DNI '78749839' is displayed in the table.
    cy.get('#root tr:nth-child(4) td:nth-child(2)')
      .should('contain.text', '78749839')
    // The name 'Juaquin' is displayed in the table.
    cy.get('#root tr:nth-child(4) td:nth-child(3)')
      .should('contain.text', 'Juaquin')
    // The last name 'marin' is displayed in the table.
    cy.get('#root tr:nth-child(4) td:nth-child(4)')
      .should('contain.text', 'marin')
    // The email 'juaquin@gmail.com' is displayed in the table.
    cy.get('#root tr:nth-child(4) td:nth-child(5)')
      .should('contain.text', 'juaquin@gmail.com')
    
    cy.get('#root a[href="/home"]').click();
    // Page URL changed.
    cy.url()
      .should('eq', 'http://localhost:5173/home')
    // The page heading is 'Reportes'.
    cy.get('#root h1.font-bold')
      .should('contain.text', '📋 Reportes')
    // Length changed from 0 to 1
    cy.get('#root tbody.bg-white tr > td')
      .should('have.length', 1)
    // The reports table shows 'No hay datos disponibles'.
    cy.get('#root td.text-center')
      .should('contain.text', 'No hay datos disponibles')
    // The 'Home' link is highlighted.
    cy.get('#root a[href="/home"]')
      .should(($el) => {
        expect($el).to.have.class('bg-sky-700')
        expect($el).to.have.class('text-white')
        expect($el).to.not.have.class('text-sky-200')
        expect($el).to.not.have.class('hover:bg-sky-700')
        expect($el).to.not.have.class('hover:text-white')
      })
    // The 'Personas' link is no longer highlighted.
    cy.get('#root a[href="/personas"]')
      .should(($el) => {
        expect($el).to.have.class('text-sky-200')
        expect($el).to.have.class('hover:bg-sky-700')
        expect($el).to.have.class('hover:text-white')
        expect($el).to.not.have.class('bg-sky-700')
        expect($el).to.not.have.class('text-white')
      })
    
    cy.get('#root a[href="/personas"]').click();
    // The page heading is now 'Personas'.
    cy.get('#root h1.font-bold')
      .should('contain.text', '👥 Personas')
    // A description for the 'Personas' section is now visible.
    cy.get('#root p.mt-1')
      .should('contain.text', 'Gestión de personas registradas en el sistema')
    // The table header 'ID' is visible.
    cy.get('#root th:nth-child(1)')
      .should('contain.text', 'ID')
    // The table header 'DNI' is visible.
    cy.get('#root th:nth-child(2)')
      .should('contain.text', 'DNI')
    // The table header 'Nombre' is visible.
    cy.get('#root th:nth-child(3)')
      .should('contain.text', 'Nombre')
    // The table header 'Apellido' is visible.
    cy.get('#root th:nth-child(4)')
      .should('contain.text', 'Apellido')
    // The 'Home' link is no longer highlighted.
    cy.get('#root a[href="/home"]')
      .should(($el) => {
        expect($el).to.have.class('text-sky-200')
        expect($el).to.have.class('hover:bg-sky-700')
        expect($el).to.have.class('hover:text-white')
        expect($el).to.not.have.class('bg-sky-700')
        expect($el).to.not.have.class('text-white')
      })
    // The 'Personas' link is now highlighted.
    cy.get('#root a[href="/personas"]')
      .should(($el) => {
        expect($el).to.have.class('bg-sky-700')
        expect($el).to.have.class('text-white')
        expect($el).to.not.have.class('text-sky-200')
        expect($el).to.not.have.class('hover:bg-sky-700')
        expect($el).to.not.have.class('hover:text-white')
      })
    
  })
})