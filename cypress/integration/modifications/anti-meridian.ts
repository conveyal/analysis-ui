/**
 * TODO:
 * 1. Add Reroute modification
 * 2. Add Modify Street modification
 * 3. Edit the modification JSON and save invalid coords. Ensure they still open.
 */

import {createModificationName} from '../utils'

const coordsOverAntiMeridian: L.LatLngTuple[] = [
  [5, 160],
  [5, 200]
]

const addTripSegment = {
  stopAtStart: true,
  stopAtEnd: true,
  spacing: 0,
  geometry: {
    type: 'LineString',
    coordinates: [
      [160, 5],
      [200, 5]
    ]
  }
}

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

  it.only('should handle Add Trip Patterns', () => {
    const name = createModificationName('Add Trip Pattern', 'anti-meridian')
    cy.createModification('Add Trip Pattern', name)

    cy.waitForMapToLoad()
    cy.getLeafletMap().then((map) => map.fitBounds(coordsOverAntiMeridian))

    cy.findByRole('button', {name: /Edit route geometry/i}).click()
    coordsOverAntiMeridian.forEach((coord) => cy.clickMapAtCoord(coord))
    cy.get('#react-toast').findByRole('alert') // Alert should pop up
    cy.findByRole('button', {name: /Stop editing/i}).click()

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification('Add Trip Pattern', name)

    // Edit the JSON directly
    cy.editJSONValues({segments: [addTripSegment]})

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
    cy.findByRole('alert')
    cy.findByTitle(/Finish drawing/i).click()

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification('Add Streets', name)

    cy.deleteThisModification()
  })
})
