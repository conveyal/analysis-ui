import {latLng} from 'leaflet'

import scratchRegion from '../fixtures/regions/scratch.json'

const getPrimary = () => cy.get('div#PrimaryAnalysisSettings')
const getComparison = () => cy.get('div#ComparisonAnalysisSettings')
const setProjectScenario = (ps: Cypress.ProjectScenario) => {
  cy.findByLabelText(/^Project$/)
    .click({force: true})
    .type(`${ps[0]}{enter}`, {delay: 0})

  cy.findByLabelText(/^Scenario$/)
    .click({force: true})
    .type(`${ps[1]}{enter}`, {delay: 0})
}

/**
 * Sets a value in the custom JSON editor.
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

/**
 * Must be done within primary/comparison.
 */
Cypress.Commands.add(
  'patchAnalysisJSON',
  (newValues: Record<string, unknown>) => {
    cy.findByRole('tab', {name: /Custom JSON editor/i}).click()

    cy.findByLabelText(/Customize analysis request/i)
      .as('profile')
      .invoke('val')
      .then((currentConfig) => {
        const parsedConfig = JSON.parse(currentConfig + '')
        return cy
          .findByLabelText(/Customize analysis request/i)
          .invoke(
            'val',
            JSON.stringify({...parsedConfig, ...newValues}, null, 2)
          )
          .type(' {backspace}', {delay: 0})
      })

    cy.findByRole('tab', {name: /Form editor/i}).click()
  }
)

Cypress.Commands.add('fetchAccessibilityComparison', function (
  coords: L.LatLngExpression,
  project: Cypress.ProjectScenario = ['scratch', 'default'],
  comparison: Cypress.ProjectScenario = ['scratch', 'baseline']
) {
  cy.goToEntity('analysis')

  getPrimary().within(() => {
    setProjectScenario(project)
    cy.patchAnalysisJSON({
      date: scratchRegion.date,
      fromLat: coords[0],
      fromLon: coords[1]
    })
  })
  getComparison().within(() => setProjectScenario(comparison))

  cy.selectDefaultOpportunityDataset()
  cy.fetchResults()

  return cy
    .findByLabelText('Opportunities within isochrone')
    .itsNumericText()
    .then((o) => {
      cy.findByLabelText('Opportunities within comparison isochrone')
        .itsNumericText()
        .then((c) => [o, c])
    })
})

Cypress.Commands.add('setOrigin', (newOrigin: L.LatLngExpression) => {
  const latlng = latLng(newOrigin)
  cy.editPrimaryAnalysisJSON('fromLat', latlng.lat)
  cy.editPrimaryAnalysisJSON('fromLon', latlng.lng)
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
    .type(`default{enter}`, {delay: 0})
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
