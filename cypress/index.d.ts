/// <reference types="cypress" />
/// <reference types="leaflet" />

declare namespace Cypress {
  type Entity = 'analysis' | 'bundle' | 'opportunities' | 'project' | 'region'

  // eslint-disable-next-line
  interface Chainable {
    /**
     * Center the map on the given coordinates.
     * @example cy.centerMapOn([60, 25])
     */
    centerMapOn(coord: [number, number], zoom?: number): Chainable<L.Map>

    /**
     * Get the LeafletMap.
     * @example cy.getLeafletMap().then(map => {...})
     */
    getLeafletMap(): Chainable<L.Map>

    /**
     * Get the pseudo fixture contents.
     * @example cy.getPseudoFixture().then((fixture) => { ... })
     */
    getPseudoFixture(): Chainable<Record<string, unknown>>

    /**
     * Check if the values are within a tolerance of each other
     * @example cy.get('#input').itsNumericValue().isWithin(7, 1)
     */
    isWithin(comparison: number, tolerance?: number): Chainable<boolean>

    /**
     * Get the numeric value of an input.
     * @example cy.get('#input').itsNumericValue().should('be', 12)
     */
    itsNumericValue(): Chainable<number>

    /**
     * Get the text as a numberic value.
     * @example cy.findByText('Opportunities).itsNumericText().should('be', 18200)
     */
    itsNumericText(): Chainable<number>

    /**
     * Wait until the spinner is gone and loading is complete.
     */
    loadingComplete(): Chainable<boolean>

    /**
     * Check if the map is centered on a set of coordinates.
     * @example cy.mapCenteredOn([50.5, 121.2], 5)
     */
    mapCenteredOn(lonlat: number[], tolerance: number): Chainable<boolean>

    /**
     * Navigate to a page via the sidebar.
     * @example cy.navTo('projects')
     */
    navTo(location: string): Chainable<boolean>

    /**
     * Wait until a manual navigation is complete.
     * @example cy.navComplete()
     */
    navComplete(): Chainable<boolean>

    /**
     * Setup an entity and all of it's dependencies.
     * @example cy.setup('bundle')
     */
    setup(entity: Entity): Chainable<boolean>

    /**
     * Wait for the map to be ready for interactivity
     * @example cy.waitForMapToLoad()
     */
    waitForMapToLoad(): Chainable<void>
  }
}
