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

const lineString: GeoJSON.LineString = {
  type: 'LineString',
  coordinates: [
    [160, 5],
    [200, 5]
  ]
}

const addTripSegment = {
  stopAtStart: true,
  stopAtEnd: true,
  spacing: 0,
  geometry: lineString
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

  it('should handle Add Trip Patterns', () => {
    const type = 'Add Trip Pattern'
    const name = createModificationName(type, 'anti-meridian')
    cy.createModification(type, name)

    cy.waitForMapToLoad()
    cy.getLeafletMap().then((map) => map.fitBounds(coordsOverAntiMeridian))

    cy.findByRole('button', {name: /Edit route geometry/i}).click()
    coordsOverAntiMeridian.forEach((coord) => cy.clickMapAtCoord(coord))
    cy.get('#react-toast').findByRole('alert') // Alert should pop up
    cy.findByRole('button', {name: /Stop editing/i}).click()

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification(type, name)

    // Edit the JSON directly
    cy.editModificationJSON({segments: [addTripSegment]})

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification(type, name)

    cy.deleteThisModification()
  })

  it('should handle Reroute', () => {
    const type = 'Reroute'
    const name = createModificationName(type, 'anti-meridian')
    cy.createModification(type, name)

    cy.waitForMapToLoad()
    cy.getLeafletMap().then((map) => map.fitBounds(coordsOverAntiMeridian))

    // Edit the JSON directly
    cy.editModificationJSON({segments: [addTripSegment]})

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification(type, name)

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

    // Edit the JSON directly
    cy.editModificationJSON({lineStrings: [lineString.coordinates]})

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification('Add Streets', name)

    cy.deleteThisModification()
  })

  it('should handle Modify Streets', () => {
    const withEndCoord = [...coordsOverAntiMeridian, coordsOverAntiMeridian[0]]
    const type = 'Modify Streets'
    const name = createModificationName(type, 'anti-meridian')
    cy.createModification(type, name)

    cy.waitForMapToLoad()
    cy.getLeafletMap().then((map) => map.fitBounds(coordsOverAntiMeridian))

    cy.findByTitle(/Draw a polygon/i).click()
    withEndCoord.forEach((coord) => cy.clickMapAtCoord(coord))
    cy.findByRole('alert')
    cy.findByTitle(/Finish drawing/i).click()

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification(type, name)

    // Edit the JSON directly
    cy.editModificationJSON({polygons: [withEndCoord.map((c) => [c[1], c[0]])]})

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification(type, name)

    cy.deleteThisModification()
  })
})
