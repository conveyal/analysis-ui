context('Scenarios', () => {
  before(() => {
    cy.fixture('regions/scratch.json').as('region')
    cy.setupProject('scratch')
  })

  beforeEach(() => {
    // open the scenarios panel, if closed
    cy.findByText(/Scenarios/)
      .parent()
      .as('scenarioPanel')
    cy.get('@scenarioPanel').then((pan) => {
      if (!pan.text().includes('Create a scenario')) {
        cy.get('@scenarioPanel').click()
      }
    })
  })

  it('start with baseline and default', () => {
    cy.get('@scenarioPanel')
      .contains(/Baseline/)
      .findByTitle(/Delete this scenario/)
      .should('not.exist')
    cy.get('@scenarioPanel')
      .contains(/Default/)
      .findByTitle(/Rename this scenario/)
      .should('exist')
  })

  it('can be created and deleted', function () {
    let scenarioName = 'scenario ' + Date.now()
    // stub the prompt
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(scenarioName)
    })
    // create
    cy.findByRole('link', {name: 'Create a scenario'}).click()
    // confirm creation and delete
    cy.get('@scenarioPanel')
      .contains(scenarioName)
      .findByTitle(/Delete this scenario/)
      .click()
    cy.findByText(scenarioName).should('not.exist')
  })

  it('can be created and renamed', () => {
    // TODO
  })
})
