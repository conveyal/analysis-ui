import {setupModificationTests, testModification} from '../utils'

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
 * Modifications that allow drawing can have problems when drawing over the anti-meridian.
 * This test ensures that these modifications both:
 * 1. Show alerts when drawing over the anti-meridian.
 * 2. Still open if they have invalid coordinates from undefined usage.
 *
 * Reported here: https://github.com/conveyal/analysis-ui/issues/1315
 */
setupModificationTests('Drawing over anti-meridian', () => {
  testModification(
    'Add Trip Pattern',
    'handle anti-meridian drawing',
    (name) => {
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
      cy.editModificationJSON({segments: [addTripSegment]})

      // Save and re-open and attempt to edit the route geometry
      cy.findByRole('button', {name: /^Modifications$/}).click()
      cy.openModification('Add Trip Pattern', name)
      cy.findByRole('button', {name: /Edit route geometry/i}).click()
    }
  )

  testModification('Reroute', 'anti-meridian drawing', function (name) {
    const type = 'Reroute'
    cy.selectFeed(this.region.feedAgencyName)
    cy.selectRoute(this.region.sampleRouteName)
    cy.findByLabelText(/Select from stop/).click()

    cy.waitForMapToLoad()
    cy.clickMapAtCoord([39.085704, -84.515856])

    cy.findByRole('button', {name: /Edit route geometry/}).click()
    coordsOverAntiMeridian.forEach((coord) => cy.clickMapAtCoord(coord))
    cy.get('#react-toast').findByRole('alert') // Alert should pop up
    cy.findByRole('button', {name: /Stop editing/i}).click()

    // Save and re-open
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification(type, name)

    // Edit the JSON directly
    cy.editModificationJSON({segments: [addTripSegment]})

    // Save and re-open and attempt to edit the route geometry
    cy.findByRole('button', {name: /^Modifications$/}).click()
    cy.openModification(type, name)
    cy.findByRole('button', {name: /Edit route geometry/i}).click()
  })

  testModification('Add Streets', 'anti-meridian drawing', function (name) {
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
  })

  testModification('Modify Streets', 'anti-meridian drawing', function (name) {
    const withEndCoord = [...coordsOverAntiMeridian, coordsOverAntiMeridian[0]]
    const type = 'Modify Streets'

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
  })
})
