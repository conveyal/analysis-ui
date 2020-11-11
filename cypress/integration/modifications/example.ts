import {scratchRegion, setupProject} from '../utils'

/**
 * EXAMPLE TEST
 *
 * This test is an example of how to setup a modification and run an
 * accessibility calculation comparing the results of the new scenario to the
 * baseline against the default opportunity data.
 */
describe('Example Modification Test', () => {
  const centralCoords: L.LatLngTuple = scratchRegion.locations
    .center as L.LatLngTuple // Downtown
  const beEqual = ([v, b]) => expect(v).to.be.equal(b)

  // Uses scratch region, bundle, and opportunity data. Creates a new project for this test group.
  const project = setupProject('Example Modification Test')

  // Creates a modification if it does not exist.
  const persistentMod = project.setupModification({
    type: 'Adjust Speed'
  })
  const transientMod = project.setupModification({
    type: 'Add Streets'
  })

  it('should have equal accessibility with no changes', () => {
    persistentMod.navTo()
    cy.selectDefaultFeedAndRoute()

    // Delete modification with helper. Does not need to be open
    transientMod.delete()

    // Runs a single point comparison at the coords and returns the two accessibility results
    cy.fetchAccessibilityComparison(
      centralCoords,
      [project.name, 'default'],
      [project.name, 'baseline']
    ).should(beEqual)
  })
})
