import {latLng} from 'leaflet'

import scratchRegion from '../fixtures/regions/scratch.json'

const getPrimary = () => cy.get('div#PrimaryAnalysisSettings')
const getComparison = () => cy.get('div#ComparisonAnalysisSettings')
const setProjectScenario = (project: string, scenario: string) => {
  cy.findByLabelText(/^Project$/)
    .click({force: true})
    .type(`${project}{enter}`, {delay: 0})

  cy.findByLabelText(/^Scenario$/)
    .click({force: true})
    .type(`${scenario}{enter}`, {delay: 0})
}

const expandIfClosed = () => {
  // Expand JSON if it is not open
  cy.get('button').then((buttons) => {
    const pb = buttons.filter((_, el) => el.title === 'expand')
    if (pb.length !== 0) cy.wrap(pb.first()).click()
  })
}

Cypress.Commands.add('getPrimaryAnalysisSettings', () => {
  getPrimary().within(() => expandIfClosed())
  return getPrimary()
})

Cypress.Commands.add('getComparisonAnalysisSettings', () => {
  getComparison().within(() => expandIfClosed())
  return getComparison()
})

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
 * Must be done within an open primary/comparison.
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
  primary?: Cypress.ProjectScenario,
  comparison?: Cypress.ProjectScenario
) {
  // This is necessary so that selected projects do not carry over
  // TODO that may be a common use case so we should optimize for that and use navTo
  cy.goToEntity('analysis')

  getPrimary().within(() => {
    const project = primary?.project ?? 'scratch'
    const scenario = primary?.scenario ?? 'default'
    setProjectScenario(project, scenario)
    cy.patchAnalysisJSON({
      date: scratchRegion.date,
      fromLat: coords[0],
      fromLon: coords[1]
    })
    if (primary?.settings) cy.patchAnalysisJSON(primary.settings)
  })

  getComparison().within(() => {
    const project = comparison?.project ?? 'scratch'
    const scenario = comparison?.scenario ?? 'baseline'
    setProjectScenario(project, scenario)
    if (comparison?.settings) cy.patchAnalysisJSON(comparison.settings)
  })

  // TODO Make this an option?
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
  cy.getPrimaryAnalysisSettings().within(() => {
    cy.patchAnalysisJSON({
      fromLat: latlng.lat,
      fromLon: latlng.lng
    })
  })
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
