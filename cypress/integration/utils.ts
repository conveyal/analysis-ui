// All modification types
export const ModificationTypes = [
  'Add Streets',
  'Add Trip Pattern',
  'Adjust Dwell Time',
  'Adjust Speed',
  'Convert To Frequency',
  'Modify Streets',
  'Remove Stops',
  'Remove Trips',
  'Reroute',
  'Custom'
] as const

const modificationPrefix = Cypress.env('dataPrefix') + 'MOD'
export function createModificationName(type: string, description = '') {
  return `${modificationPrefix}${type}${description}${Date.now()}`
}

/**
 * Perform initialization and cleanup for modification tests.
 */
export function testModification(
  type: typeof ModificationTypes[number],
  description: string,
  runner: (name: string) => void
) {
  it(`testModification<${type}>: ${description}`, function () {
    const name = createModificationName(type)
    cy.createModification(type, name)
    runner.call(this, name)
    cy.openModification(type, name)
    cy.deleteThisModification()
  })
}

/**
 * Setup a group of modification tests.
 */
export function setupModificationTests(
  description: string,
  runner: () => void
) {
  describe(`Modification Tests: ${description}`, function () {
    before(() => {
      cy.setup('project')
      cy.clearAllModifications() // clean up from failed tests in development
    })

    beforeEach(() => {
      cy.goToEntity('project')
      cy.fixture('regions/scratch.json').as('region')
    })

    runner()

    after(() => {
      cy.clearAllModifications() // clean up for other test groups
    })
  })
}
