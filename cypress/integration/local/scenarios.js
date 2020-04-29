context('Scenarios', () => {
  before(() => {
    cy.setupProject('scratch')
  })

  beforeEach(() => {
    // identify and open the scenarios panel, if closed
    cy.findByText(/Scenarios/)
      .parent()
      .as('scenarioPanel')
    cy.get('@scenarioPanel').then((panel) => {
      if (!panel.text().includes('Create a scenario')) {
        cy.get('@scenarioPanel').click()
      }
    })
  })

  it("include 'baseline' & 'default'", () => {
    cy.get('@scenarioPanel')
      .contains(/Baseline/)
      .findByTitle(/Delete this scenario/)
      .should('not.exist')
    cy.get('@scenarioPanel')
      .contains(/Default/)
      .findByTitle(/Rename this scenario/)
      .should('exist')
  })

  it('can be created, renamed, & deleted', function () {
    let scenarioName = 'scenario ' + Date.now()
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(scenarioName)
      //.returns(scenarioName + ' altered')
    })
    cy.findByRole('link', {name: 'Create a scenario'}).click()
    cy.window().then((win) => {
      win.prompt.restore()
      cy.stub(win, 'prompt').returns(scenarioName + ' altered')
    })
    cy.get('@scenarioPanel')
      .contains(scenarioName)
      .findByTitle(/Rename/)
      .click()
    cy.get('@scenarioPanel')
      .contains(scenarioName + ' altered')
      .findByTitle(/Delete this scenario/)
      .click()
    cy.get('@scenarioPanel').findByText(scenarioName).should('not.exist')
  })
})
