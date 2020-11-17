import Model from './model'

export default class OpportunityData extends Model {
  delete() {
    this.navTo()
    // window.confirm is auto-confirmed by Cypress
    cy.findByRole('button', {name: /Delete entire dataset/i}).click()
    cy.navComplete()
  }

  navTo() {
    cy.location('href').then((href) => {
      if (href !== this.path) {
        cy.visit(this.path)
        cy.navComplete()
      }
    })
  }
}
