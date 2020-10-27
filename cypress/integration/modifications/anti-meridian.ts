import {createModificationName} from '../utils'

const coordsOverAntiMeridian: Cypress.Coord[] = [
  [5, 160],
  [5, 200]
]

/**
 * Modifications that allow drawing should handle drawing over the anti-meridian
 * without failing.
 *
 * Reported here: https://github.com/conveyal/analysis-ui/issues/1315
 */
describe('Modification drawing over anti-meridian', () => {
  before(() => {
    cy.setup('project')
    cy.clearAllModifications() // clean up for development
  })

  beforeEach(() => {
    cy.goToEntity('project')
  })

  it('should handle Add Trip Patterns', () => {
    const name = createModificationName('Add Trip Pattern', 'anti-meridian')
    cy.createModification('Add Trip Pattern', name)

    cy.waitForMapToLoad()
    cy.getLeafletMap().then((map) => map.fitBounds(coordsOverAntiMeridian))

    cy.findByRole('button', {name: /Edit route geometry/i}).click()
    coordsOverAntiMeridian.forEach((coord) => cy.clickMapAtCoord(coord))
    cy.findByRole('button', {name: /Stop editing/i}).click()

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification('Add Trip Pattern', name)

    cy.deleteThisModification()
  })

  it('should handle Add Streets', () => {
    const name = createModificationName('Add Streets', 'anti-meridian')
    cy.createModification('Add Streets', name)

    cy.waitForMapToLoad()
    cy.getLeafletMap().then((map) => map.fitBounds(coordsOverAntiMeridian))

    cy.findByTitle(/Draw a polyline/i).click()
    coordsOverAntiMeridian.forEach((coord) => cy.clickMapAtCoord(coord))
    cy.findByTitle(/Finish drawing/i).click()

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification('Add Streets', name)

    cy.deleteThisModification()
  })
})
