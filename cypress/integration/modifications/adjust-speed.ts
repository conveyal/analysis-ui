import {
  beforeModificationTests,
  createScenario,
  scratchRegion,
  setupModification
} from '../utils'

describe('Adjust Speed', () => {
  const routeName = '1 Dixie Hwy'
  const centralCoords: L.LatLngTuple = scratchRegion.locations
    .center as L.LatLngTuple
  const farFromRouteCoords: L.LatLngTuple = [39.021, -84.44] // Cold Spring
  const beGreater = ([v, b]) => expect(v).to.be.greaterThan(b)
  const beLess = ([v, b]) => expect(v).to.be.lessThan(b)
  const selectAll = () =>
    cy.findAllByRole('button', {name: /Select all routes/}).click()
  const scaleSpeedBy = (v: number) =>
    cy.findByLabelText('Scale speed by').clear().type(`${v}`)

  beforeModificationTests()

  // const projectName = setupProject('Unique Identifier')
  const modificationName = setupModification('Adjust Speed')

  beforeEach(() => cy.openModification(modificationName))

  describe('all routes selected', () => {
    before(() => {
      cy.selectFeed(scratchRegion.feedAgencyName)
      selectAll()
    })

    it('should increase accessibility with increased speed', () => {
      scaleSpeedBy(10)
      cy.fetchAccessibilityComparison(centralCoords).should(beGreater)
    })

    it('should decrease accessibility with decreased speed', () => {
      scaleSpeedBy(0.1)
      cy.fetchAccessibilityComparison(centralCoords).should(beLess)
    })

    after(() => {
      cy.openModification(modificationName)
      cy.findByRole('button', {name: /Deselect all routes/}).click()
    })
  })

  describe('single route selected', () => {
    before(() => {
      cy.selectFeed(scratchRegion.feedAgencyName)
      cy.selectRoute(routeName)
    })

    it('should increase accessibility with increased speed', () => {
      scaleSpeedBy(10)
      cy.fetchAccessibilityComparison(centralCoords).should(beGreater)
    })

    it('should have equal accessibility far from the route', () => {
      scaleSpeedBy(10)
      cy.fetchAccessibilityComparison(farFromRouteCoords).should(([v, c]) =>
        expect(v).to.be.equal(c)
      )
    })

    it('should decrease accessibility with decreased speed', () => {
      scaleSpeedBy(0.1)
      cy.fetchAccessibilityComparison(centralCoords).should(beLess)
    })
  })

  describe.only('segments of a single route selected', () => {
    const scenarioName = 'Segments'
    before(() => {
      createScenario(scenarioName)
      cy.findByRole('tab', {name: /Modifications/}).click()
    })

    // Since this is created after the scenario it will be added to it automatically
    const segmentMod = setupModification('Adjust Speed')

    const [lat, lon] = centralCoords
    const offset = 0.03
    const segmentPolygonCoords: L.LatLngTuple[] = [
      [lat, lon + offset],
      [lat + offset, lon],
      [lat, lon - offset],
      [lat - offset, lon]
    ]

    it('should have different accessibility from a full route modification', () => {
      cy.openModification(segmentMod)
      cy.selectFeed(scratchRegion.feedAgencyName)
      cy.selectRoute(routeName)
      scaleSpeedBy(10)

      // Draw box around segments
      cy.findByRole('button', {name: /Select segments/}).click()
      segmentPolygonCoords.forEach((ll) => cy.clickMapAtCoord(ll))
      cy.clickMapAtCoord(segmentPolygonCoords[0]) // Closes the polygon

      // Add to, Remove from, and clear buttons should now exist
      cy.findByRole('button', {name: /Add to/})

      // Remove from the default scenario
      cy.findByText('Active in scenarios')
        .parent()
        .findByLabelText(/Default/)
        .uncheck({force: true})

      cy.openModification(modificationName)
      cy.selectFeed(scratchRegion.feedAgencyName)
      cy.selectRoute(routeName)
      scaleSpeedBy(10)
      cy.findByText('Active in scenarios')
        .parent()
        .findByLabelText(new RegExp(scenarioName))
        .uncheck({force: true})

      cy.fetchAccessibilityComparison(
        centralCoords,
        ['scratch', 'default'],
        ['scratch', scenarioName]
      ).should(beGreater)
    })
  })

  describe('different results when patterns are deselected', () => {})
})
