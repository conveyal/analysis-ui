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

type TestModificationOptions = {
  testFunction?: Mocha.ExclusiveTestFunction | Mocha.TestFunction
  title: string
  type: Cypress.ModificationType
}

/**
 * Perform initialization and cleanup for modification tests.
 */
export function testModification(
  {testFunction = it, title, type}: TestModificationOptions,
  runner: (name: string) => void
) {
  testFunction(`testModification<${type}>: ${title}`, function () {
    const name = createModificationName(type)
    cy.createModification(type, name)
    runner.call(this, name)
    cy.deleteModification(name)
  })
}

testModification.only = (
  options: TestModificationOptions,
  runner: (name: string) => void
) =>
  testModification(
    {
      ...options,
      testFunction: it.only
    },
    runner
  )

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
  })
}
