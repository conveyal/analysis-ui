import Model from './model'

export default class Bundle extends Model {
  delete() {
    this.navTo()
    cy.findByRole('button', {name: /Delete this network bundle/}).click()
    cy.findByRole('button', {
      name: /Confirm: Delete this network bundle/
    }).click()
    cy.findByRole('alertdialog').should('not.exist')
    cy.navComplete()
  }

  navTo() {
    cy.location('pathname').then((path) => {
      if (path !== this.path) {
        cy.visit(this.path)
        cy.navComplete()
      }
    })
  }
}
