// Reusable command for getting the map container
Cypress.Commands.add('getMapDiv', () => cy.get('div.leaflet-container'))
Cypress.Commands.add('getLeafletMap', () => cy.window().its('LeafletMap'))

Cypress.Commands.add('clickMapAtCoord', (coord: L.LatLngExpression) => {
  cy.getLeafletMap().then((map) => {
    map.panTo(coord, {animate: false})
    const point = map.latLngToLayerPoint(coord)
    cy.getMapDiv().click(point.x, point.y)
  })
})

Cypress.Commands.add('waitForMapToLoad', () =>
  cy // eslint-disable-line
    .getLeafletMap()
    .its('_loaded')
    .should('be.true') // this just does not seem to work as expected. The wait remains necessary
    .wait(500)
)

Cypress.Commands.add(
  'mapCenteredOn',
  (latlng: L.LatLngExpression, tolerance: number) =>
    cy
      .getLeafletMap()
      .then((map) =>
        cy
          .wrap(map.distance(map.getCenter(), latlng))
          .should('be.lessThan', tolerance)
      )
)

Cypress.Commands.add('centerMapOn', (latlng: L.LatLngExpression, zoom = 12) =>
  // centers map on a given lat/lon coordinate: [x,y]
  cy.getLeafletMap().then((map) => {
    map.setView(latlng, zoom)
    return map
  })
)
