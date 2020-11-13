import {scratchRegion, setupProject} from '../utils'

/**
 * EXAMPLE TEST
 *
 * This test is an example of how to setup a modification and run an
 * accessibility calculation comparing the results of the new scenario to the
 * baseline against the default opportunity data.
 */
describe('Example Modification Test', () => {
  // Uses scratch region, bundle, and opportunity data. Creates a new project for this test group.
  const project = setupProject('Example Modification Test')

  // Create scenarios to be used
  project.setupScenarios(['Example Scenario 1', 'Example Scenario 2'])

  // Creates a modification if it does not exist.
  const persistentMod = project.setupModification({
    type: 'Adjust Speed',
    data: {
      // Will be set on each test run. Not just on creation.
      scale: 10,
      variants: [true, false, true] // corresponds to the above
    }
  })
  const transientMod = project.setupModification({
    type: 'Add Streets',
    id: 'UUID', // When in development tests may run out of order. Set an id manually to ensure stability.
    onCreate: () => {
      // Setup the modification. Only run on initial creation.
    }
  })

  it('should have equal accessibility with no changes', () => {
    // Helper to open modification
    persistentMod.navTo()

    // Delete modification with helper. Does not need to be open
    transientMod.delete()

    // Runs a single point comparison at the coords and returns the two accessibility results
    cy.fetchAccessibilityComparison(
      scratchRegion.locations.center as L.LatLngTuple,
      {project: project.name, scenario: 'default'},
      {project: project.name, scenario: 'baseline'}
    ).should(([a, c]) => expect(a).to.be.greaterThan(c))
  })
})
