import './commands'
import './map'

/**
 * Remove all old modifications that contain the temporary prefix
 */
function clearAllModifications() {
  return cy
    .get('body')
    .then(($body) => {
      return $body.find('button[aria-label="Edit modification"]')
    })
    .then((buttons) => {
      if (buttons.length > 0) {
        cy.wrap(buttons[0]).click()
        cy.deleteThisModification()
        return clearAllModifications()
      }
    })
}

Cypress.Commands.add('clearAllModifications', () => {
  cy.goToEntity('project')
  return clearAllModifications()
})

Cypress.Commands.add('createModification', function (
  type: Cypress.ModificationType,
  name: string
) {
  // assumes we are already on this page or editing another mod
  cy.findByText('Create a modification').click()
  cy.findByLabelText(/Modification name/i).type(name)
  if (type.indexOf('Street') > -1) {
    cy.findByText('Street').click()
    cy.findByLabelText(/Street modification type/i).select(type)
  } else {
    cy.findByLabelText(/Transit modification type/i).select(type)
  }
  cy.findByText('Create').click()
  cy.findByRole('dialog').should('not.exist')
  cy.navComplete()
  cy.location('pathname').should('match', /.*\/modifications\/.{24}$/)
})

Cypress.Commands.add('deleteThisModification', function () {
  // Delete an open modification
  cy.findByRole('button', {name: 'Delete modification'}).click()
  cy.findByRole('button', {name: 'Confirm: Delete modification'}).click()
  cy.findByRole('dialog').should('not.exist')
  cy.contains('Create a modification')
  cy.wait(100) // eslint-disable-line
  cy.navComplete() // Modifications are not loaded in GetInitialProps
})

Cypress.Commands.add('clickMapAtCoord', (coord: Cypress.Coord) => {
  cy.getLeafletMap().then((map) => {
    map.panTo(coord, {animate: false})
    const point = map.latLngToLayerPoint(coord)
    cy.getMapDiv().click(point.x, point.y)
  })
})

Cypress.Commands.add('drawRouteGeometry', function (newRoute) {
  cy.findByText(/Edit route geometry/i)
    .click()
    .contains(/Stop editing/i)
  cy.getLeafletMap().then((map) => {
    map.fitBounds(newRoute, {animate: false})
    cy.waitForMapToLoad()
    // click at the coordinates
    newRoute.forEach((coord, i) => {
      const point = map.latLngToContainerPoint(coord)
      cy.getMapDiv().click(point.x, point.y)
      if (i > 0) {
        cy.contains(new RegExp(i + 1 + ' stops over \\d\\.\\d+ km'))
      }
    })
    // convert an arbitrary stop to a control point
    const stop = newRoute[newRoute.length - 2]
    const point = map.latLngToContainerPoint(stop)
    cy.getMapDiv().click(point.x, point.y)
    cy.getMapDiv()
      .findByText(/make control point/)
      .click()
    // control point not counted as stop
    cy.contains(new RegExp(newRoute.length - 1 + ' stops over \\d\\.\\d+ km'))
    // convert control point back to stop
    cy.getMapDiv().click(point.x, point.y)
    cy.getMapDiv()
      .findByText(/make stop/)
      .click()
    cy.contains(new RegExp(newRoute.length + ' stops over \\d\\.\\d+ km'))
  })
  cy.findByText(/Stop editing/i).click()
})

Cypress.Commands.add('openModification', function (
  modType: Cypress.ModificationType,
  modName
) {
  // opens the first listed modification of this type with this name
  cy.navTo('edit modifications')
  cy.findByRole('tab', {name: /Modifications/g}).click()
  // find the container for this modification type and open it if need be
  cy.findByText(modType)
    .parent()
    .parent()
    .as('modList')
    .then((modList) => {
      if (!modList.text().includes(modName)) {
        cy.wrap(modList).click()
      }
    })
  cy.get('@modList').contains(modName).click()
  cy.location('pathname').should('match', /.*\/modifications\/.{24}$/)
  cy.contains(modName)
})
