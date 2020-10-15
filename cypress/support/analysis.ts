const getPrimary = () => cy.get('div#PrimaryAnalysisSettings')

/**
 * Sets a value in the custom JSON editor
 */
Cypress.Commands.add('editPrimaryAnalysisJSON', (key, newValue) => {
  getPrimary()
    .findByRole('tab', {name: /Custom JSON editor/i})
    .click()

  getPrimary()
    .findByLabelText(/Customize analysis request/i)
    .as('profile')
    .invoke('val')
    .then((currentConfig) => {
      const newConfig = JSON.parse(currentConfig + '')
      newConfig[key] = newValue

      return cy
        .get('@profile')
        .invoke('val', JSON.stringify(newConfig, null, 2))
        .type(' {backspace}')
    })

  getPrimary()
    .findByRole('tab', {name: /Form editor/i})
    .click()
})

Cypress.Commands.add('setOrigin', (latLonArray) => {
  cy.editPrimaryAnalysisJSON('fromLat', latLonArray[0])
  cy.editPrimaryAnalysisJSON('fromLon', latLonArray[1])
})

Cypress.Commands.add('fetchResults', () => {
  cy.findByText(/Fetch results/i) // eslint-disable-line cypress/no-unnecessary-waiting
    .click()
    .wait(200)
  // fetch results button usually disappears when clicked, but may not always
  // when it returns, we know the results have been fetched
  cy.findByText(/Fetch results/i, {timeout: 240000}).should('exist')
})

Cypress.Commands.add('setTimeCutoff', (minutes) => {
  // TODO this does not work yet
  cy.findByRole('slider', {name: 'Time cutoff'})
    .invoke('val', minutes)
    .trigger('input', {force: true})
})

Cypress.Commands.add('selectDefaultOpportunityDataset', () => {
  cy.findByLabelText(/^Opportunity Dataset$/) // eslint-disable-line cypress/no-unnecessary-waiting
    .click({force: true})
    .type(`default{enter}`)
    .wait(100)
  cy.findByLabelText(/^Opportunity Dataset$/).should('be.enabled')
})

Cypress.Commands.add('setupAnalysis', () => {
  cy.getLocalFixture().then((region) => {
    cy.visit(`/regions/${region.regionId}/analysis`)
    cy.navComplete()
  })

  // set a standard project and scenario for all tests
  getPrimary()
    .findByLabelText(/^Project$/)
    .click({force: true})
    .type('scratch{enter}')
  getPrimary()
    .findByLabelText(/^Scenario$/)
    .click({force: true})
    .type('baseline{enter}')
  cy.fixture('regions/scratch').then((region) =>
    getPrimary().findByLabelText(/Date/i).clear().type(region.date)
  )
})
